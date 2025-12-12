from ..db import connect

def search_order(item='',customer_name='', address=''):
    try:
        conn = connect()
        cursor = conn.cursor()
        sql = """
            SELECT 
                o.order_id, p.product_name, ol.amount, ol.order_price, 
                c.name, a.delivery_address, o.order_date, 
                o.expected_delivery_date, o.is_delivered
            FROM `Order` o
            JOIN Address a ON o.address_id = a.address_id
            JOIN Customer c ON a.customer_id = c.customer_id
            JOIN OrderLine ol ON o.order_id = ol.order_id
            JOIN Product p ON ol.product_id = p.product_id
            WHERE 1=1
        """
        params = []

        if item:
            sql+= " AND LOWER(p.product_name) LIKE LOWER(%s)"
            params.append(f"%{item}%")
        if customer_name:
            sql+= " AND LOWER(c.name) LIKE LOWER(%s)"
            params.append(f"%{customer_name}%")
        if address:
            sql+= " AND LOWER(a.delivery_address) LIKE LOWER(%s)"
            params.append(f"%{address}%")

        cursor.execute(sql, params)
        result = cursor.fetchall()

        formatted_result = []
        for row in result:
            formatted_result.append({
                "order_id": row[0],
                "amount": row[1],
                "order_price": row[2],
                "customer_name": row[3],
                "delivery_address": row[4],
                "order_date": row[5],
                "expected_delivery_date": row[6],
                "is_delivered": row[7]
            })
        cursor.close()
        conn.close()

        return formatted_result
    except Exception as e:
        raise e

def filter_order(
        order_date=None,deliver_date=None,
        cost_min=0,cost_max=float('inf'),
        delivered=False,overdue=False,in_progress=False,
        warehouse=[],category=[],supplier=[]
        ):
    try:
        sql = """
            SELECT 
                o.order_id, p.product_name, ol.amount, ol.order_price, 
                c.name, a.delivery_address, o.order_date, 
                o.expected_delivery_date, o.is_delivered
            FROM `Order` o
            JOIN Address a ON o.address_id = a.address_id
            JOIN Customer c ON a.customer_id = c.customer_id
            JOIN OrderLine ol ON o.order_id = ol.order_id
            JOIN Product p ON ol.product_id = p.product_id
            JOIN Account ac ON p.account_id = ac.id
            JOIN Inventory inv ON p.product_id = inv.product_id
            WHERE 1 = 1
        """

        params = []

        if order_date:
            sql += " AND o.order_date = %s"
            params.append(order_date)

        if deliver_date:
            sql += " AND o.expected_delivery_date = %s"
            params.append(deliver_date)

        sql += " AND ol.order_price BETWEEN %s AND %s"
        params.extend([cost_min, cost_max])

        if delivered is True:
            sql += " AND o.is_delivered = TRUE"
        elif delivered is False:
            sql += " AND o.is_delivered = FALSE"

        if overdue:
            sql += " AND o.expected_delivery_date < CURRENT_DATE AND o.is_delivered = FALSE"

        if in_progress:
            sql += " AND o.is_delivered = FALSE"

        if supplier:
            sql += """
                AND p.account_id IN (
                    SELECT id FROM Account 
                    WHERE account_type = 'supplier' 
                    AND LOWER(name) LIKE LOWER(%s)
                )
            """
            params.append(f"%{supplier}%")

        if category:
            placeholders = ", ".join(["%s"] * len(category))
            sql += f" AND p.category_id IN ({placeholders})"
            params.extend(category)

        if warehouse:
            placeholders = ", ".join(["%s"] * len(warehouse))
            sql += f" AND inv.warehouse_id IN ({placeholders})"
            params.extend(warehouse)

        conn = connect()
        cursor = conn.cursor()
        cursor.execute(sql, params)

        conn.close()
    except Exception as e:
        raise e
    
def delete_order(order_id,product_id):
    try:
        conn = connect()

        cursor = conn.cursor()
        cursor.execute(""" START TRANSACTION; """)
        cursor.execute("DELETE FROM OrderLine WHERE product_id = %s AND order_id = %s", (product_id, order_id))
        
        cursor.execute("SELECT COUNT(*) FROM OrderLine WHERE order_id = %s", (order_id,))
        count = cursor.fetchone()[0]
        if count == 0:
            cursor.execute("DELETE FROM `Order` WHERE order_id = %s", (order_id,))
        cursor.execute(""" COMMIT; """)
        cursor.close()
        conn.close()
    except Exception as e:
        if conn:
            conn.rollback()
        raise e
    
def create_order(
        warehouse_id,address_id,order_date,delivery_date,items=[]
        ):
    '''
    Docstring for create_order
    Args:
        customer_id (int): ID of the customer placing the order
        warehouse_id (int): ID of the warehouse fulfilling the order
        address_id (int): ID of the delivery address
        order_date (string): Date when the order was placed (format: 'YYYY-MM-DD')
        delivery_date (string): Expected delivery date (format: 'YYYY-MM-DD')
        items (list[dict]): each dict contains 'product_id', 'amount', 'order_price'
    '''
    # TODO update inventory accordingly using warehouse_id, and items
    try:
        conn = connect()
        cursor = conn.cursor()
        cursor.execute(""" START TRANSACTION; """)
        cursor.execute("""
            INSERT INTO `Order` (address_id, warehouse_id, order_date, expected_delivery_date, is_delivered)
            VALUES (%s, %s, %s, %s, FALSE);
        """, (address_id, warehouse_id, order_date, delivery_date))
        order_id = cursor.lastrowid
        for item in items:
            cursor.execute("""
                INSERT INTO OrderLine (order_id, product_id, amount, order_price)
                VALUES (%s, %s, %s, %s);
            """, (order_id, item['product_id'], item['amount'], item['order_price']))
        cursor.execute(""" COMMIT; """)
        cursor.close()
        
        conn.close()
    except Exception as e:
        if conn:
            conn.rollback()
        raise e

def edit_order(
        order_id,warehouse_id,address_id,order_date,delivery_date,item_ids=[],items=[]
        ):
    '''
    Edit entire order, from order table, not orderline

    Args:
        order_date (string): dd-mm-yyyy format
        delivery_date (string): dd-mm-yyyy format
        items (list[int]): list of id 

    Returns:
        None
    '''
    try:
        conn = connect()
        cursor = conn.cursor()
        cursor.execute(""" START TRANSACTION; """)
        cursor.execute("""
            UPDATE `Order` SET address_id = %s, warehouse_id = %s, order_date = %s, expected_delivery_date = %s, is_delivered = FALSE
            WHERE order_id = %s;
        """, (address_id, warehouse_id, order_date, delivery_date, order_id))
        for i, item_id in enumerate(item_ids):
            cursor.execute("""
                UPDATE OrderLine SET order_id = %s, product_id = %s, amount = %s, order_price = %s
                WHERE order_id = %s AND product_id = %s;
            """, (order_id, items[i]['product_id'], items[i]['amount'], items[i]['order_price'], order_id, item_id))
        cursor.execute(""" COMMIT; """)
        cursor.close()

        conn.close()
    except Exception as e:
        if conn:
            conn.rollback()
        raise e



def get_order(limit=None):
    '''
    limit is int, so get all order descending order in ID
    '''
    try:
        conn = connect()

        sql = '''
            SELECT 
                o.order_id, p.product_name, ol.amount, ol.order_price, 
                c.name, a.delivery_address, o.order_date, 
                o.expected_delivery_date, o.is_delivered
            FROM `Order` o
            JOIN Address a ON o.address_id = a.address_id
            JOIN Customer c ON a.customer_id = c.customer_id
            JOIN OrderLine ol ON o.order_id = ol.order_id
            JOIN Product p ON ol.product_id = p.product_id
            ORDER BY o.order_id DESC
        '''
        if limit:
            sql += " LIMIT %s"
        cursor = conn.cursor()
        cursor.execute(sql, (limit,) if limit else ())
        results = cursor.fetchall()
        formatted_result = []
        for row in results:
            formatted_result.append({
                "order_id": row[0],
                "amount": row[1],
                "order_price": row[2],
                "customer_name": row[3],
                "delivery_address": row[4],
                "order_date": row[5],
                "expected_delivery_date": row[6],
                "is_delivered": row[7]
            })
        cursor.close()
        conn.close()
        return formatted_result
    except Exception as e:
        raise e

if __name__ == '__main__':
    # print('--')
    # print(create_order(
    #     warehouse_id=1,
    #     address_id=2,
    #     order_date='2024-06-01',
    #     delivery_date='2024-06-10',
    #     items=[
    #         {'product_id': 3, 'amount': 2, 'order_price': 50.0},
    #     ]
    # ))
    # print('--')
    # print(get_order())
    # print(delete_order(5,1))
    # print(edit_order(
    #     order_id=7,
    #     warehouse_id=1,
    #     address_id=1,
    #     order_date='2024-06-05',
    #     delivery_date='2024-07-15',
    #     item_ids=[1],
    #     items=[
    #         {'product_id': 1, 'amount': 3, 'order_price': 75.0},
    #     ]
    # ))

    # print(search_order(address='AAAA'))
    pass