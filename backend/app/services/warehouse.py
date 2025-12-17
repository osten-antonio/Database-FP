from ..db import connect

def get_warehouse_specific(id):
    try:
        conn = connect()
        cursor = conn.cursor(dictionary=True)
        
        # Get warehouse info with manager details
        cursor.execute('''
            SELECT w.warehouse_id, w.name, w.address, a.name as manager_name, a.email as manager_email
            FROM Warehouse w
            LEFT JOIN Account a ON w.account_id = a.account_id
            WHERE w.warehouse_id = %s
        ''', (id,))
        
        warehouse = cursor.fetchone()
        cursor.close()
        conn.close()
        
        return warehouse if warehouse else {"error": "Warehouse not found"}
    except Exception as e:
        raise e

def get_warehouse_stats(id):
    try:
        conn = connect()
        cursor = conn.cursor(dictionary=True)
        
        # Get warehouse stats
        cursor.execute('''
            SELECT 
                COALESCE(SUM(ol.amount * ol.order_price), 0) as total_revenue,
                COALESCE(COUNT(DISTINCT ol.order_id), 0) as total_sales,
                COALESCE(COUNT(DISTINCT i.product_id), 0) as total_products,
                COALESCE(SUM(i.stock), 0) as total_stock
            FROM Inventory i
            LEFT JOIN OrderLine ol ON i.product_id = ol.product_id
            WHERE i.warehouse_id = %s
        ''', (id,))
        
        stats = cursor.fetchone()
        cursor.close()
        conn.close()
        
        return stats if stats else {
            "total_revenue": 0,
            "total_sales": 0,
            "total_products": 0,
            "total_stock": 0
        }
    except Exception as e:
        raise e

def get_warehouse_order_stats(id):
    try:
        conn = connect()
        cursor = conn.cursor(dictionary=True)
        
        # Get order stats for warehouse
        cursor.execute('''
            SELECT 
                COALESCE(SUM(CASE WHEN o.expected_delivery_date < CURDATE() AND o.is_delivered = 0 THEN 1 ELSE 0 END), 0) as overdue,
                COALESCE(SUM(CASE WHEN o.is_delivered = 0 AND o.expected_delivery_date >= CURDATE() THEN 1 ELSE 0 END), 0) as in_progress,
                COALESCE(SUM(CASE WHEN o.is_delivered = 1 THEN 1 ELSE 0 END), 0) as completed
            FROM `Order` o
            WHERE o.warehouse_id = %s
        ''', (id,))
        
        stats = cursor.fetchone()
        cursor.close()
        conn.close()
        
        return stats if stats else {
            "overdue": 0,
            "in_progress": 0,
            "completed": 0
        }
    except Exception as e:
        raise e

def get_warehouse():
    try:
        conn = connect()
        cursor = conn.cursor(dictionary=True)
        cursor.execute('''
            SELECT 
                w.warehouse_id,
                w.name,
                w.address,
                COALESCE(inv.total_stock, 0) AS total_stock,
                COALESCE(ord.total_orders, 0) AS total_orders
            FROM Warehouse w
            JOIN Account a ON w.account_id = a.account_id
            LEFT JOIN (
                SELECT warehouse_id, SUM(stock) AS total_stock
                FROM Inventory
                GROUP BY warehouse_id
            ) inv ON w.warehouse_id = inv.warehouse_id
            LEFT JOIN (
                SELECT warehouse_id, COUNT(order_id) AS total_orders
                FROM `Order`
                GROUP BY warehouse_id
            ) ord ON w.warehouse_id = ord.warehouse_id
        ''')

        rows = cursor.fetchall()
        cursor.close()
        conn.close()
        return rows

    except Exception as e:
        raise e

def create_warehouse(name,address,manager_id):
    try:
        conn = connect()

        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO Warehouse (name, address, account_id)
            VALUES (%s, %s, %s)
        ''', (name, address, manager_id))
        conn.commit()
        cursor.close()
        
        conn.close()
    except Exception as e:
        raise e

def edit_warehouse(id, name,address):
    try:
        conn = connect()

        cursor = conn.cursor()
        cursor.execute('''
            UPDATE Warehouse
            SET name=%s, address=%s
            WHERE warehouse_id=%s
        ''', (name, address, id))
        conn.commit()
        cursor.close()

        conn.close()
    except Exception as e:
        raise e

def get_warehouse_customers(id):
    try:
        conn = connect()

        cursor=conn.cursor(dictionary=True)
        cursor.execute('''
            SELECT c.customer_id, c.name, c.email,
                   a.address_id, a.delivery_address, a.phone_num
            FROM Customer c
            LEFT JOIN Address a ON c.customer_id = a.customer_id
            WHERE c.customer_id IN (
                       SELECT a.customer_id FROM `Order` o JOIN Address a ON o.address_id = a.address_id 
                       WHERE warehouse_id = %s
                       )
        ''',(id,))
        rows = cursor.fetchall()
        cursor.close()
        conn.close()
        return rows
    except Exception as e:
        raise e
    
def delete_inv(warehouse_id, product_id):
    try:
        conn = connect()

        cursor = conn.cursor()
        cursor.execute('DELETE FROM Inventory WHERE warehouse_id=%s AND product_id=%s',(warehouse_id,product_id))
        conn.commit()
        cursor.close()
        conn.close()
    except Exception as e:
        print(e)
        raise e


def get_warehouse_products(id,limit=None):
    try:
        conn = connect()

        params = [id]
        sql = '''
            SELECT 
                i.product_id, 
                p.product_name, 
                p.category_id, 
                a.name AS supplier, 
                p.price, 
                i.stock, 
                COALESCE(SUM(ol.order_price), 0) AS ttl_sales
            FROM Inventory i
            JOIN Product p ON i.product_id = p.product_id
            JOIN Warehouse w ON i.warehouse_id = w.warehouse_id
            LEFT JOIN `Order` o ON o.warehouse_id = w.warehouse_id
            LEFT JOIN OrderLine ol ON o.order_id = ol.order_id
            JOIN Account a ON p.account_id = a.account_id
            WHERE i.warehouse_id = %s
            GROUP BY i.product_id, p.product_name, p.category_id, a.name, p.price, i.stock;
        '''
        if limit:
            sql+=' LIMIT %s'
            params.append(limit)
        cursor = conn.cursor()
        cursor.execute(sql,params)
        rows = cursor.fetchall()
        cursor.close()
        conn.close()
        result = []
        for row in rows:
            result.append({
                'product_id':row[0],
                'product_name':row[1],
                'category_id': row[2],
                'supplier': row[3],
                'cost': row[4],
                'stock': row[5],
                'ttl_sales':row[6]
            })
        return result
    except Exception as e:
        print(e)
        raise e


def filter_warehouse_product(id, min_cost=0,max_cost=float('inf'),suppliers=[],category=[]):
    try:
        conn = connect()
        cursor = conn.cursor()
        params=[id,min_cost,max_cost]
        sql = '''

            SELECT 
                i.product_id, 
                p.product_name, 
                p.category_id, 
                a.name AS supplier, 
                p.price, 
                i.stock, 
                COALESCE(SUM(ol.order_price), 0) AS ttl_sales
            FROM Inventory i
            JOIN Product p ON i.product_id = p.product_id
            JOIN Warehouse w ON i.warehouse_id = w.warehouse_id
            LEFT JOIN OrderLine ol ON ol.product_id = i.product_id
            LEFT JOIN `Order` o ON o.order_id = ol.order_id
            JOIN Account a ON p.account_id = a.account_id
            WHERE i.warehouse_id = %s AND p.price >= %s AND p.price <= %s
        '''
        if suppliers:
            placeholders = ', '.join(['%s'] * len(suppliers))
            sql += f" AND a.account_id IN ({placeholders})"
            params.extend(suppliers)

        if category:
            placeholders = ', '.join(['%s'] * len(category))
            sql += f" AND p.category_id IN ({placeholders})"
            params.extend(category)
        sql+='GROUP BY i.product_id, p.product_name, p.category_id, a.name, p.price, i.stock;'
        cursor.execute(sql,params)
        rows = cursor.fetchall()
        cursor.close()
        conn.close()
        result = []
        for row in rows:
            result.append({
                'product_id':row[0],
                'product_name':row[1],
                'category_id': row[2],
                'supplier': row[3],
                'cost': row[4],
                'stock': row[5],
                'ttl_sales':row[6]
            })
        return result
    except Exception as e:
        raise e

def delete_warehouse(id):
    try:
        conn = connect()

        cursor = conn.cursor()
        cursor.execute('''
            DELETE FROM Warehouse WHERE warehouse_id=%s
        ''', (id,))
        conn.commit()
        cursor.close()

        conn.close()
    except Exception as e:
        raise e
    
def get_name(id):
    try:
        conn = connect()
        cursor = conn.cursor()
        cursor.execute('''
            SELECT name FROM Warehouse WHERE warehouse_id=%s
        ''',(int(id),))

        row = cursor.fetchone()
        cursor.close()
        conn.close()
        
        return row[0]
    except Exception as e:
        raise e

def search_warehouse(name):
    try:
        conn = connect()
        cursor = conn.cursor()
        cursor.execute('''
            SELECT 
                w.warehouse_id,
                w.name,
                w.address,
                COALESCE(inv.total_stock, 0) AS total_stock,
                COALESCE(ord.total_orders, 0) AS total_orders
            FROM Warehouse w
            JOIN Account a ON w.account_id = a.account_id
            LEFT JOIN (
                SELECT warehouse_id, SUM(stock) AS total_stock
                FROM Inventory
                GROUP BY warehouse_id
            ) inv ON w.warehouse_id = inv.warehouse_id
            LEFT JOIN (
                SELECT warehouse_id, COUNT(order_id) AS total_orders
                FROM `Order`
                GROUP BY warehouse_id
            ) ord ON w.warehouse_id = ord.warehouse_id
            WHERE w.name LIKE %s;
        ''',(f'%{name}%',))

        rows = cursor.fetchall()
        cursor.close()
        conn.close()
        result = []
        for row in rows:
            result.append({
                'warehouse_id':row[0],
                'name':row[1],
                'address': row[2],
                'stock': row[3],
                'total_sales': row[4]
            })
        return result
    except Exception as e:
        raise e
    
def search_warehouse_product(warehouse_id = 1, name='', supplier=''):
    try:
        conn = connect()
        cur = conn.cursor(dictionary=True)

        query = """
            SELECT
                i.product_id, 
                p.product_name, 
                p.category_id, 
                a.name AS supplier, 
                p.price, 
                i.stock, 
                COALESCE(SUM(ol.order_price), 0) AS ttl_sales
            FROM Inventory i
            JOIN Product p ON i.product_id = p.product_id
            JOIN Warehouse w ON i.warehouse_id = w.warehouse_id
            LEFT JOIN OrderLine ol ON ol.product_id = i.product_id
            LEFT JOIN `Order` o ON o.order_id = ol.order_id
            JOIN Account a ON p.account_id = a.account_id
            WHERE i.warehouse_id = %s
        """
        
        params = [warehouse_id]

        if name:
            query += " AND p.product_name LIKE %s"
            params.append(f"%{name}%")

        if supplier:
            query += " AND a.name LIKE %s"
            params.append(f"%{supplier}%")

        query += """
            GROUP BY p.product_id, p.product_name, p.price, p.category_id, a.name
        """

        cur.execute(query, params)
        rows = cur.fetchall()
        conn.close()

        return rows

    except Exception as e:
        return {"status": "error", "message": str(e)}

if __name__ == '__main__':
    '''
    test here
    '''
    pass