from ..db import connect

def add_stock(product_id,warehouse_id,amount,cost,date):
    try:
        conn = connect()
        cursor=conn.cursor()
        cursor.execute('''
            INSERT INTO Restock(product_id,warehouse_id,amount,cost,order_date)
            VALUES (%s,%s,%s,%s,%s)        
        ''', (product_id,warehouse_id,amount,cost,date))
        
        cursor.close()
        conn.close()
    except Exception as e:
        return {"status": "error", "message": str(e)}

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
        return {"status": "error", "message": str(e)}
    
if __name__ == '__main__':
    '''
    test here
    '''
    pass