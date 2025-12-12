from ..db import connect

def get_suppliers():
    try:
        conn = connect()

        # TODO
        
        conn.close()
    except Exception as e:
        return {"status": "error", "message": str(e)}

def search_supplier(name='',address='',email=''):
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
    pass
