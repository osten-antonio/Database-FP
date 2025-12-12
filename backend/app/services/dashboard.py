from ..db import connect

def get_top_products_qty():
    try:
        conn = connect()
        cursor = conn.cursor()

        cursor.execute('''
        SELECT COUNT(ol.product_id),p.product_name FROM OrderLine ol
        JOIN Product p ON ol.product_id = p.product_id
        GROUP BY ol.product_id
        ORDER BY COUNT(product_id) DESC
        LIMIT 5
        ''')
        rows = cursor.fetchall()
        res = []
        for row in rows:
            res.append({
              'count':row[0],
              'name':row[1]  
            })
        cursor.close()
        conn.close()
        return res
    except Exception as e:
        raise e
    
def get_top_products_money():
    try:
        conn = connect()
        cursor = conn.cursor()
        cursor.execute('''
        SELECT SUM(ol.order_price),p.product_name FROM OrderLine ol
        JOIN Product p ON ol.product_id = p.product_id
        GROUP BY ol.product_id
        ORDER BY SUM(ol.order_price) DESC
        LIMIT 5
        ''')
        rows = cursor.fetchall()
        res = []
        for row in rows:
            res.append({
                'total':row[0],
                'name':row[1]
            })
        cursor.close()
        conn.close()
        return res
    except Exception as e:
        raise e

def get_total_sales_card():
    try:
        conn = connect()

        # TODO
        
        conn.close()
    except Exception as e:
        return {"status": "error", "message": str(e)}

def get_total_sales_month():
    try:
        conn = connect()

        # TODO
        
        conn.close()
    except Exception as e:
        return {"status": "error", "message": str(e)}
    
def get_warehouse_stocks():
    try:
        conn = connect()
        cursor = conn.cursor()
        cursor.execute('''
        SELECT w.name, SUM(i.stock) FROM Warehouse w
        JOIN Inventory i ON w.warehouse_id = i.warehouse_id
        GROUP BY i.warehouse_id
        ORDER BY SUM(i.stock) DESCC
        LIMIT 5
        ''')
        
        result = []
        rows = cursor.fetchall()
        for row in rows:
            result.append({
                'name':row[0],
                'stock':row[1]
            })
        cursor.close()
        conn.close()
    except Exception as e:
        raise e
    
if __name__ == '__main__':
    '''
    test here
    '''
    pass