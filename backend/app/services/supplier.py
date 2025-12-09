from ..db import connect

def get_suppliers():
    try:
        conn = connect()
        cur = conn.cursor()

        #print('\n[DEBUG] connected to database')

        query = """
            SELECT account_id, name, address, email, phone_number
            FROM account
            WHERE account_type = 'supplier'
        """

        #print('\n[DEBUG] running query:', query)

        cur.execute(query)
        rows = cur.fetchall()

        #print('\n[DEBUG] query returned:', rows)

        conn.close()
        return {"status": "success", "message": rows}
        
    except Exception as e:
        #print('\n[DEBUG] ERROR:', e)
        return {"status": "error", "message": str(e)}

def search_supplier(name='',address='',email=''):
    try:
        conn = connect()
        cur = conn.cursor()

        #print('\n[DEBUG] connected to database')

        query = """
            SELECT account_id, name, address, email, phone_number
            FROM account
            WHERE account_type = 'supplier'
        """

        #print('\n[DEBUG] running base query:', query)

        params = []

        if name:
            query += " AND name LIKE %s"
            params.append(f"%{name}%")
            #print('\n[DEBUG] add name filter:', name)

        if address:
            query += " AND address LIKE %s"
            params.append(f"%{address}%")
            #print('\n[DEBUG] add address filter:', address)
        
        if email:
            query += " AND email LIKE %s"
            params.append(f"%{email}%")
            #print('\n[DEBUG] add email filter:', email)

        cur.execute(query, params)
        rows = cur.fetchall()

        #print('\n[DEBUG] query returned:', rows)

        conn.close()
        return {"status": "success", "message": rows}

    except Exception as e:
        #print('\n[DEBUG] ERROR:', repr(e))
        return {"status": "error", "message": str(e)}
    
if __name__ == '__main__':
    print('\n all suppliers:')
    print(get_suppliers())

    print('\n search for suppliers:')
    print(search_supplier(name='bob'))