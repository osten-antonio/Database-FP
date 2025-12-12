from ..db import connect


def get_customers():
    try:
        conn = connect()
        cursor = conn.cursor(dictionary=True)
        query = """
            SELECT c.customer_id, c.name, c.email,
                   a.address_id, a.delivery_address, a.phone_num
            FROM Customer c
            LEFT JOIN Address a ON c.customer_id = a.customer_id
        """
        cursor.execute(query)
        rows = cursor.fetchall()


        # TODO
        
        conn.close()
        return {"status": "success", "data": rows}  
    except Exception as e:
        return {"status": "error", "message": str(e)}

def search_customers(name='',address='',email='',phone=''):
    try:
        conn = connect()
        cursor = conn.cursor(dictionary=True)
        query = """
            SELECT c.customer_id, c.name, c.email,
                   a.address_id, a.delivery_address, a.phone_num
            FROM Customer c
            LEFT JOIN Address a ON c.customer_id = a.customer_id
            WHERE (%s = '' OR c.name LIKE %s)
              AND (%s = '' OR c.email LIKE %s)
              AND (%s = '' OR a.delivery_address LIKE %s)
              AND (%s = '' OR a.phone_num LIKE %s)
        """
        params =  (
            name, f'%{name}%',
            email, f'%{email}%',
            address, f'%{address}%',
            phone, f'%{phone}%'
        )
        cursor.execute(query, params)
        rows = cursor.fetchall()
        cursor.close()
        # TODO
        
        conn.close()
        return{"status": "success", "data": rows}
    except Exception as e:
        return {"status": "error", "message": str(e)}

def add_customer(name,email,addresses=[]):
    try:
        conn = connect()
        cursor = conn.cursor()
        cursor.execute("INSERT INTO Customer (name, email) VALUES (%s, %s)", (name, email))
        customer_id = cursor.lastrowid


        for addr in addresses:
            cursor.execute(
                "INSERT INTO Address (customer_id, delivery_address, phone_num) VALUES (%s, %s, %s)",
                (customer_id, addr.get('delivery_address'), addr.get('phone_num'))
            )
        conn.commit()
        cursor.close()
       
        
        conn.close()
        return customer_id
    except Exception as e:
        raise e

def edit_customer(id, name,email,addresses=[]):
    try:
        conn = connect()
        cursor = conn.cursor()
        cursor.execute("UPDATE Customer SET name=%s, email=%s WHERE customer_id=%s", (name, email, id))
        cursor.execute("DELETE FROM Address WHERE customer_id=%s", (id,))
        for addr in addresses:
            cursor.execute(
                "INSERT INTO Address (customer_id, delivery_address, phone_num) VALUES (%s, %s, %s)",
                (id, addr.get('delivery_address'), addr.get('phone_num'))
            )
        conn.commit()
        cursor.close()

        conn.close()
    except Exception as e:
        raise e

if __name__ == '__main__':
    '''
    test here
    '''
    pass
    print('t')