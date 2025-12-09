from ..db import connect

def get_product():
    try:
        conn = connect()
        cur = conn.cursor()

        query = """
            SELECT p.product_id, p.product_name, p.price, c.category_name, a.name AS supplier_name, a.email AS supplier_email
            FROM product p
            LEFT JOIN category c ON p.category_id = c.category_id
            LEFT JOIN account a ON p.account_id = a.account_id;
        """
        
        cur.execute(query)
        rows = cur.fetchall()
        conn.close()

        return {"status": "success", "data": rows}

    except Exception as e:
        return {"status": "error", "message": str(e)}

def search_product(name='',supplier=''):
    try:
        conn = connect()
        cur = conn.cursor()

        query = """
            
        """
        
        cur.execute(query)
        rows = cur.fetchall()
        conn.close()


    except Exception as e:
        return {"status": "error", "message": str(e)}


def delete_product(id):
    try:
        conn = connect()

        # TODO
        
        conn.close()
    except Exception as e:
        return {"status": "error", "message": str(e)}


def create_product(product_name,price=0,category_id=0):
    try:
        conn = connect()

        # TODO
        
        conn.close()
    except Exception as e:
        return {"status": "error", "message": str(e)}


def edit_product(id,product_name,price=0,category_id=0):
    try:
        conn = connect()

        # TODO
        
        conn.close()
    except Exception as e:
        return {"status": "error", "message": str(e)}

    
def filter_product(min_cost=0,max_cost=float('inf'),suppliers=[],category=[]):
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