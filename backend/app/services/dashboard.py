from ..db import connect

def get_top_products_qty():
    try:
        conn = connect()
        cursor = conn.cursor()


        cursor.execute("""
            SELECT 
                p.product_name,
                SUM(ol.amount) AS total_qty
            FROM OrderLine ol
            JOIN Product p ON ol.product_id = p.product_id
            GROUP BY ol.product_id
            ORDER BY total_qty DESC
            LIMIT 5
        """)

        rows = cursor.fetchall()
        cursor.close()
        conn.close()

        return [
            {"product": row[0], "Quantity": int(row[1])}
            for row in rows
        ]

    except Exception as e:
        raise e
    
def get_top_products_money():
    try:
        conn = connect()
        cursor = conn.cursor()
        cursor.execute('''
            SELECT 
                p.product_name,
                SUM(ol.order_price) AS revenue
            FROM OrderLine ol
            JOIN Product p ON ol.product_id = p.product_id
            GROUP BY ol.product_id
            ORDER BY revenue DESC
            LIMIT 5
        ''')
        rows = cursor.fetchall()
        cursor.close()
        conn.close()
        return [
            {"product": row[0], "Revenue": float(row[1])}
            for row in rows
        ]
    except Exception as e:
        raise e

def get_total_sales_card():
    try:
        conn = connect()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT
                COALESCE(SUM(ol.order_price), 0) AS total_sales,
                COUNT(DISTINCT o.order_id) AS orders
            FROM OrderLine ol
            JOIN `Order` o ON ol.order_id = o.order_id
            WHERE o.order_date >= DATE_SUB(CURDATE(), INTERVAL 90 DAY)
        """)

        total_sales, orders = cursor.fetchone()
        avg_order = (total_sales / orders) if orders else 0

        cursor.close()
        conn.close()
        return {
            "total_sales": float(total_sales or 0),
            "orders": int(orders or 0),
            "avg_order_value": float(avg_order)
        }
    except Exception as e:
        raise e

def get_total_sales_month():
    try:
        conn = connect()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT
                o.order_date,
                SUM(ol.order_price) AS daily_sales
            FROM OrderLine ol
            JOIN `Order` o ON ol.order_id = o.order_id
            WHERE o.order_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
            GROUP BY o.order_date
            ORDER BY o.order_date
        """)

        rows = cursor.fetchall()
        cursor.close()
        conn.close()
        return [
            {"date": row[0].strftime("%Y-%m-%d"), "Sales": float(row[1])}
            for row in rows
        ]
    except Exception as e:
        raise e
    
def get_warehouse_stocks():
    try:
        conn = connect()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT 
                w.name,
                SUM(i.stock) AS total_stock
            FROM Warehouse w
            JOIN Inventory i ON w.warehouse_id = i.warehouse_id
            GROUP BY w.warehouse_id
            ORDER BY total_stock DESC
            LIMIT 5
        """)
        
        rows = cursor.fetchall()
        cursor.close()
        conn.close()
        return [
            {"warehouse": row[0], "Stock": int(row[1])}
            for row in rows
        ]
    except Exception as e:
        raise e
    
if __name__ == '__main__':
    '''
    test here
    '''
    pass