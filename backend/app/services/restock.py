from ..db import connect

def add_stock(product_id,warehouse_id,amount,cost,date):
    try:
        conn = connect()
        cursor=conn.cursor()
        cursor.execute('''
            INSERT INTO Restock(product_id,warehouse_id,amount,cost,order_date)
            VALUES (%s,%s,%s,%s,%s)        
        ''', (product_id,warehouse_id,amount,cost,date))
        conn.commit()
        cursor.close()
        conn.close()
    except Exception as e:
        raise e
    
def complete_order(restock_id):
    try:
        conn = connect()
        cursor = conn.cursor()

        cursor.execute('''
            SELECT product_id, warehouse_id, amount, cost 
            FROM Restock 
            WHERE restock_id = %s
        ''', (restock_id,))
        restock = cursor.fetchone()

        if not restock:
            return {"status": "error", "message": "Restock ID not found"}

        product_id, warehouse_id, amount, cost = restock

        cursor.execute('''
            SELECT stock 
            FROM Inventory 
            WHERE product_id = %s AND warehouse_id = %s
        ''', (product_id, warehouse_id))
        inventory_row = cursor.fetchone()
        print(inventory_row)
        print((product_id, warehouse_id))
        if inventory_row:
            cursor.execute('''
                UPDATE Inventory
                SET stock = stock + %s
                WHERE product_id = %s AND warehouse_id = %s
            ''', (amount, product_id, warehouse_id))
        else:
            cursor.execute('''
                INSERT INTO Inventory (product_id, warehouse_id, stock)
                VALUES (%s, %s, %s)
            ''', (product_id, warehouse_id, amount))


        cursor.execute('DELETE FROM Restock WHERE restock_id = %s', (restock_id,))

        conn.commit()

        cursor.close()
        conn.close()
    except Exception as e:
        raise e
    
def get_restock_orders(warehouse_id):
    try:
        conn = connect()
        cursor=conn.cursor()
        cursor.execute('''
            SELECT r.restock_id, p.product_name, a.name, r.amount, r.cost, r.order_date, p.category_id
            FROM Restock r
            JOIN Product p ON r.product_id = p.product_id
            JOIN Account a ON p.account_id = a.account_id
            WHERE r.warehouse_id = %s
        ''', (warehouse_id,))
        rows = cursor.fetchall()
        cursor.close()
        conn.close()
        res = []
        for row in rows:
            res.append({
                'id':row[0],
                'product_name':row[1],
                'supplier_name':row[2],
                'amount':row[3],
                'cost':row[4],
                'order_date':row[5],
                'category_id': row[6]
            })
        return res
    except Exception as e:
        raise e

if __name__ == '__main__':
    '''
    test here
    '''
    pass