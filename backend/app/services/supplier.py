from ..db import connect

def get_suppliers():
    try:
        conn = connect()
        cur = conn.cursor(dictionary=True)

        query = """
            SELECT account_id as id, name, address, email, phone_number
            FROM Account
            WHERE account_type = 'supplier'
        """

        cur.execute(query)
        rows = cur.fetchall()
        conn.close()

        return rows
        
    except Exception as e:
        return {"status": "error", "message": str(e)}

def search_supplier(name='',address='',email=''):
    try:
        conn = connect()
        cur = conn.cursor(dictionary=True)

        query = """
            SELECT account_id as id, name, address, email, phone_number
            FROM Account
            WHERE account_type = 'supplier'
        """

        params = []

        if name:
            query += " AND name LIKE %s"
            params.append(f"%{name}%")

        if address:
            query += " AND address LIKE %s"
            params.append(f"%{address}%")
        
        if email:
            query += " AND email LIKE %s"
            params.append(f"%{email}%")

        cur.execute(query, params)
        rows = cur.fetchall()
        conn.close()

        return rows

    except Exception as e:
        return {"status": "error", "message": str(e)}

def create_supplier(name, address, email, phone_number=''):
    try:
        conn = connect()
        cur = conn.cursor()
        
        query = """
            INSERT INTO Account (name, address, email, phone_number, account_type)
            VALUES (%s, %s, %s, %s, 'supplier')
        """
        
        cur.execute(query, (name, address, email, phone_number))
        conn.commit()
        conn.close()
        
        return {"status": "success", "message": "supplier created"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

def update_supplier(id, name, address, email, phone_number=''):
    try:
        conn = connect()
        cur = conn.cursor()
        
        query = """
            UPDATE Account
            SET name = %s, address = %s, email = %s, phone_number = %s
            WHERE account_id = %s AND account_type = 'supplier'
        """
        
        cur.execute(query, (name, address, email, phone_number, id))
        conn.commit()
        conn.close()
        
        return {"status": "success", "message": "supplier updated"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

def delete_supplier(id):
    try:
        conn = connect()
        cur = conn.cursor()
        
        query = "DELETE FROM Account WHERE account_id = %s AND account_type = 'supplier'"
        
        cur.execute(query, (id,))
        conn.commit()
        conn.close()
        
        return {"status": "success", "message": "supplier deleted"}
    except Exception as e:
        return {"status": "error", "message": str(e)}
    
if __name__ == '__main__':
    print("\n get suppliers:")
    print(get_suppliers())

    print("\n search suppliers:")
    print(search_supplier(name="bob"))