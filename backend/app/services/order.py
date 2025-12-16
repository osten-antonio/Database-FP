from ..db import connect
from datetime import date,datetime

def search_order(item='',customer_name='', address=''):
    try:
        conn = connect()
        cursor = conn.cursor(dictionary=True)
        sql = """
            SELECT 
                o.order_id,
                p.product_name AS item,
                ol.amount,
                ol.order_price AS cost,
                c.name AS customer_name,
                a.delivery_address,
                o.order_date,
                o.expected_delivery_date,
                o.is_delivered,
                w.name AS warehouse_name,
                c.customer_id,
                w.warehouse_id,
                a.address_id,
                ol.product_id
            FROM `Order` o
            JOIN Address a ON o.address_id = a.address_id
            JOIN Customer c ON a.customer_id = c.customer_id
            JOIN OrderLine ol ON o.order_id = ol.order_id
            JOIN Product p ON ol.product_id = p.product_id
            JOIN Warehouse w ON o.warehouse_id = w.warehouse_id
            WHERE 1 = 1
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
        rows = cursor.fetchall()
        cursor.close()
        conn.close()
        results = []
        today = date.today()
        print(rows)
        for row in rows:
            is_delivered = row['is_delivered']
            expected_date = row['expected_delivery_date']

            if is_delivered:
                status = "Delivered"
            elif expected_date and today > expected_date:
                status = "Overdue"
            else:
                status = "In progress"

            results.append({
                'order_id': row['order_id'],
                'customer_name': row['customer_name'],
                'item': row['item'],
                'amount': row['amount'],
                'cost': row['cost'],
                'order_date': row['order_date'],
                'expected_delivery_date': row['expected_delivery_date'],
                'status': status,
                'warehouse_name': row['warehouse_name'],
                'customer_id': row['customer_id'],
                'warehouse_id': row['warehouse_id'],
                'address_id': row['address_id'],  
                'product_id': row['product_id']
            })
        return results

    except Exception as e:
        print(e)
        raise e

def filter_order(
        order_date_from=None, order_date_to=None,
        deliver_date_from=None, deliver_date_to=None,
        cost_min=0,cost_max=None,
        delivered=False,overdue=False,in_progress=False,
        warehouse=[],category=[],supplier=[]
        ):
    try:
        sql = """
            SELECT 
                o.order_id,
                p.product_name AS item,
                ol.amount,
                ol.order_price AS cost,
                c.name AS customer_name,
                a.delivery_address,
                o.order_date,
                o.expected_delivery_date,
                o.is_delivered,
                w.name AS warehouse_name,
                c.customer_id,
                w.warehouse_id,
                a.address_id,
                ol.product_id
            FROM `Order` o
            JOIN Address a ON o.address_id = a.address_id
            JOIN Customer c ON a.customer_id = c.customer_id
            JOIN OrderLine ol ON o.order_id = ol.order_id
            JOIN Product p ON ol.product_id = p.product_id
            JOIN Warehouse w ON o.warehouse_id = w.warehouse_id
            WHERE 1 = 1
        """

        params = []

        if order_date_from:
            sql += " AND o.order_date >= %s"
            params.append(order_date_from)

        if order_date_to:
            sql += " AND o.order_date <= %s"
            params.append(order_date_to)

        if deliver_date_from:
            sql += " AND o.expected_delivery_date >= %s"
            params.append(deliver_date_from)

        if deliver_date_to:
            sql += " AND o.expected_delivery_date <= %s"
            params.append(deliver_date_to)

        if cost_min is not None and cost_max is not None:
            sql += " AND ol.order_price BETWEEN %s AND %s"
            params.extend([cost_min, cost_max])
        elif cost_min is not None:
            sql += " AND ol.order_price >= %s"
            params.append(cost_min)
        elif cost_max is not None:
            sql += " AND ol.order_price <= %s"
            params.append(cost_max)

        if delivered:
            sql += " AND o.is_delivered = TRUE"
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
            sql += f" AND w.warehouse_id IN ({placeholders})"
            params.extend(warehouse)

        conn = connect()
        cursor = conn.cursor()
        print(sql)
        print(params)
        cursor.execute(sql, params)

        rows = cursor.fetchall()
        cursor.close()
        conn.close()
        results = []
        today = date.today()
        for row in rows:
            if row[8]:
                status = "Delivered"
            elif today > row[7]:
                status = "Overdue"
            else:
                status = "In progress"
            results.append({
                'order_id':row[0],
                'customer_name':row[4],
                'item': row[1],
                'amount': row[2],
                'cost': row[3],
                'order_date': row[6],
                'expected_delivery_date': row[7],
                'status': status,
                'warehouse_name': row[9],
                'customer_id': row[10],
                'warehouse_id': row[11],
                'address_id': row[12],  
                'product_id': row[13]
            })

        return results
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
        customer_id,delivery_address,warehouse_id,order_date,delivery_date,items=[]
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
        order_date = datetime.fromisoformat(order_date.replace("Z", "")).date()
        delivery_date = datetime.fromisoformat(
            delivery_date.replace("Z", "")
        ).date()
        conn = connect()
        cursor = conn.cursor()
        print(customer_id, " ".join(delivery_address.split()[:-1]))
        # get address_id
        cursor.execute("""
            SELECT address_id
            FROM Address
            WHERE customer_id = %s AND LOWER(delivery_address) = LOWER(%s)
        """, (customer_id, " ".join(delivery_address.split()[:-1])))
        
        row = cursor.fetchone()
        
        address_id = row[0]        
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
        raise e

def edit_order(
    customer_id,
    delivery_address,
    order_id,
    warehouse_id,
    order_date,
    expected_delivery_date,
    items=None
):
    if items is None:
        items = []

    try:
        order_date = datetime.fromisoformat(order_date.replace("Z", "")).date()
        expected_delivery_date = datetime.fromisoformat(
            expected_delivery_date.replace("Z", "")
        ).date()
        conn = connect()
        cursor = conn.cursor()
        # get address_id
        cursor.execute("""
            SELECT address_id
            FROM Address
            WHERE customer_id = %s AND LOWER(delivery_address) = LOWER(%s)
        """, (customer_id, " ".join(delivery_address.split()[:-1])))
        
        row = cursor.fetchone()
        
        address_id = row[0]
        cursor.execute("START TRANSACTION;")

        # update order
        cursor.execute("""
            UPDATE `Order`
            SET address_id = %s,
                warehouse_id = %s,
                order_date = %s,
                expected_delivery_date = %s,
                is_delivered = FALSE
            WHERE order_id = %s;
        """, (
            address_id,
            warehouse_id,
            order_date,
            expected_delivery_date,
            order_id
        ))

        cursor.execute(
            "DELETE FROM OrderLine WHERE order_id = %s;",
            (order_id,)
        )

        # insert new items
        for item in items:
            cursor.execute("""
                INSERT INTO OrderLine (order_id, product_id, amount, order_price)
                VALUES (%s, %s, %s, %s);
            """, (
                order_id,
                item["product_id"],
                item["amount"],
                float(item["order_price"])
            ))

        conn.commit()
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
                o.order_id,
                p.product_name AS item,
                ol.amount,
                ol.order_price AS cost,
                c.name AS customer_name,
                a.delivery_address,
                o.order_date,
                o.expected_delivery_date,
                o.is_delivered,
                w.name AS warehouse_name,
                c.customer_id,
                w.warehouse_id,
                a.address_id,
                ol.product_id
            FROM `Order` o
            JOIN Address a ON o.address_id = a.address_id
            JOIN Customer c ON a.customer_id = c.customer_id
            JOIN OrderLine ol ON o.order_id = ol.order_id
            JOIN Product p ON ol.product_id = p.product_id
            JOIN Warehouse w ON o.warehouse_id = w.warehouse_id
            ORDER BY o.order_id DESC
        '''
        if limit:
            sql += " LIMIT %s"
        cursor = conn.cursor()
        cursor.execute(sql, (limit,) if limit else ())
        rows = cursor.fetchall()
        cursor.close()
        conn.close()
        results = []
        today = date.today()
        for row in rows:
            if row[8]:
                status = "Delivered"
            elif today > row[7]:
                status = "Overdue"
            else:
                status = "In progress"
            results.append({
                'order_id':row[0],
                'customer_name':row[4],
                'item': row[1],
                'amount': row[2],
                'cost': row[3],
                'order_date': row[6],
                'expected_delivery_date': row[7],
                'status': status,
                'warehouse_name': row[9],
                'customer_id': row[10],
                'warehouse_id': row[11],
                'address_id': row[12],    
                'product_id': row[13]            
            })
        

        return results

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