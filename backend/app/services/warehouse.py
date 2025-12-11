from ..db import connect

def get_warehouse_specific(id):
    # TODO, combine warehouse customers, products
    pass

def get_warehouse():
    try:
        conn = connect()
        cursor = conn.cursor()
        cursor.execute('''
            SELECT w.warehouse_id,w.name, w.address, a.name, SUM(i.stock), COUNT(o.order_id)
            FROM Warehouse w
            JOIN Account a ON w.account_id = a.account_id
            JOIN Inventory i ON w.warehouse_id = i.warehouse_id
            JOIN Order o ON i.warehouse_id = o.warehouse_id
            GROUP BY w.name, w.address, a.name
        ''')

        result = cursor.fetchall()
        cursor.close()
        conn.close()
        return {"status":"success","data":result}
    except Exception as e:
        return {"status": "error", "message": str(e)}

def create_warehouse(name,address,manager_id):
    try:
        conn = connect()

        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO Warehouse (name, address, manager_id)
            VALUES (%s, %s, %s)
        ''', (name, address, manager_id))
        conn.commit()
        cursor.close()
        
        conn.close()
    except Exception as e:
        return {"status": "error", "message": str(e)}

def edit_warehouse(id, name,address,manager):
    try:
        conn = connect()

        cursor = conn.cursor()
        cursor.execute('''
            UPDATE Warehouse
            SET name=%s, address=%s, manager_id=%s
            WHERE warehouse_id=%s
        ''', (name, address, manager, id))
        conn.commit()
        cursor.close()

        conn.close()
    except Exception as e:
        return {"status": "error", "message": str(e)}
    
def get_warehouse_products(id,limit=None):
    try:
        conn = connect()

        params = [id]
        sql = '''
            SELECT i.product_id, p.name, p.category_id, a.name, p.cost, i.stock, COUNT(ol.order_id)
            FROM Inventory i
            JOIN Product p ON i.product_id = p.product_id
            JOIN Warehouse w ON i.warehouse_id = w.warehouse_id
            JOIN `Order` o ON o.warehouse_id = w.warehouse_id
            JOIN OrderLine ol ON o.order_id = ol.order_id
            WHERE i.warehouse_id=%s
        '''
        if limit:
            sql+=' LIMIT %s'
            params.append(limit)
        cursor = conn.cursor()
        cursor.execute(sql,params)
        result = cursor.fetchall()
        cursor.close()
        conn.close()
        return {"status":"success","data":result}
    except Exception as e:
        return {"status": "error", "message": str(e)}


def filter_warehouse_product(id, min_cost=0,max_cost=float('inf'),suppliers=[],category=[]):
    try:
        conn = connect()
        cursor = conn.cursor()
        params=[id,min_cost,max_cost]
        sql = '''
            SELECT i.product_id, p.name, p.category_id, a.name, p.cost, i.stock, COUNT(ol.order_id)
            FROM Inventory i
            JOIN Product p ON i.product_id = p.product_id
            JOIN Account a ON p.supplier_id = a.account_id
            JOIN Warehouse w ON i.warehouse_id = w.warehouse_id
            JOIN `Order` o ON o.warehouse_id = w.warehouse_id
            JOIN OrderLine ol ON o.order_id = ol.order_id
            WHERE i.warehouse_id=%s AND p.cost >= %s AND p.cost <= %s
        '''
        if suppliers:
            placeholders = ', '.join(['%s'] * len(suppliers))
            sql += f" AND a.account_id IN ({placeholders})"
            params.extend(suppliers)

        if category:
            placeholders = ', '.join(['%s'] * len(category))
            sql += f" AND p.category_id IN ({placeholders})"
            params.extend(category)
        cursor.execute(sql,params)
        result = cursor.fetchall()
        cursor.close()
        conn.close()
        return {"status":"success","data":result}
    except Exception as e:
        return {"status": "error", "message": str(e)}

def get_warehouse_customer(id):
    try:
        conn = connect()

        cursor=conn.cursor()
        cursor.execute('''
            SELECT c.customer_id, c.name, c.email,
                   a.address_id, a.delivery_address, a.phone_num
            FROM Customer c
            LEFT JOIN Address a ON c.customer_id = a.customer_id
            WHERE c.customer_id IN (
                       SELECT a.customer_id FROM `Order` o JOIN Address a ON o.address_id = a.address_id 
                       WHERE warehouse_id = %s
                       )
        ''',(id))
        result = cursor.fetchall()
        cursor.close()
        conn.close()
        return {"status":"success","data":result}
    except Exception as e:
        return {"status": "error", "message": str(e)}

def search_warehouse(name):
    try:
        conn = connect()
        cursor = conn.cursor()
        cursor.execute('''
            SELECT w.warehouse_id, w.name, w.address, a.name, SUM(i.stock), COUNT(o.order_id)
            FROM Warehouse w
            JOIN Account a ON w.account_id = a.account_id
            JOIN Inventory i ON w.warehouse_id = i.warehouse_id
            JOIN Order o ON i.warehouse_id = o.warehouse_id
            GROUP BY w.name, w.address, a.name
            WHERE w.name LIKE %s
        ''',(f'%{name}%',))

        result = cursor.fetchall()
        cursor.close()
        conn.close()
        return {"status":"success","data":result}
    except Exception as e:
        return {"status": "error", "message": str(e)}

if __name__ == '__main__':
    '''
    test here
    '''
    pass