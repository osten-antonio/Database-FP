from ..db import connect

def get_customers():
    try:
        conn = connect()

        # TODO
        
        conn.close()
    except Exception as e:
        return {"status": "error", "message": str(e)}

def search_customers(name='',address='',email='',phone=''):
    try:
        conn = connect()

        # TODO
        
        conn.close()
    except Exception as e:
        return {"status": "error", "message": str(e)}

def add_customer(name,email,addresses=[]):
    try:
        conn = connect()

        # TODO
        
        conn.close()
    except Exception as e:
        return {"status": "error", "message": str(e)}

def edit_customer(id, name,email,addresses=[]):
    try:
        conn = connect()

        # TODO
        
        conn.close()
    except Exception as e:
        return {"status": "error", "message": str(e)}

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

