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
            ORDER BY c.customer_id, a.address_id
        """
        cursor.execute(query)
        rows = cursor.fetchall()
        conn.close()

        # Nest addresses by customer_id
        customers_dict = {}
        for row in rows:
            cid = row['customer_id']
            if cid not in customers_dict:
                customers_dict[cid] = {
                    'customer_id': cid,
                    'name': row['name'],
                    'email': row['email'],
                    'addresses': []
                }
            if row['address_id']:
                customers_dict[cid]['addresses'].append({
                    'address_id': row['address_id'],
                    'delivery_address': row['delivery_address'],
                    'phone_num': row['phone_num']
                })

        return list(customers_dict.values())

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
            ORDER BY c.customer_id, a.address_id
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
        conn.close()

        # Nest addresses by customer_id
        customers_dict = {}
        for row in rows:
            cid = row['customer_id']
            if cid not in customers_dict:
                customers_dict[cid] = {
                    'customer_id': cid,
                    'name': row['name'],
                    'email': row['email'],
                    'addresses': []
                }
            if row['address_id']:
                customers_dict[cid]['addresses'].append({
                    'address_id': row['address_id'],
                    'delivery_address': row['delivery_address'],
                    'phone_num': row['phone_num']
                })

        return list(customers_dict.values())

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

def get_customer_addresses(customer_id):
    """Get all addresses for a specific customer"""
    try:
        conn = connect()
        cursor = conn.cursor(dictionary=True)
        query = """
            SELECT address_id, delivery_address, phone_num
            FROM Address
            WHERE customer_id = %s
            ORDER BY address_id
        """
        cursor.execute(query, (customer_id,))
        addresses = cursor.fetchall()
        cursor.close()
        conn.close()
        
        return addresses if addresses else []
    except Exception as e:
        raise e

def delete_customer(customer_id):
    try:
        conn = connect()
        cursor = conn.cursor(dictionary=True)
        query = """
            DELETE FROM Customer WHERE customer_id=%s
        """
        cursor.execute(query, (customer_id,))
        conn.commit()
        cursor.close()
        conn.close()
        
    except Exception as e:
        raise e

if __name__ == '__main__':
    '''
    test here
    '''
    try:
        conn = connect()
        cursor = conn.cursor()
        cursor.execute("SHOW TABLES")
        tables = [table[0] for table in cursor.fetchall()]

        cursor.close()
        conn.close()

        print({"tables": tables})
    except Exception as e:
        print(e)

