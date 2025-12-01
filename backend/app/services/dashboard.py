from ..db import connect

def get_top_products_qty():
    try:
        conn = connect()

        # TODO
        
        conn.close()
    except Exception as e:
        return {"status": "error", "message": str(e)}
    
def get_top_products_money():
    try:
        conn = connect()

        # TODO
        
        conn.close()
    except Exception as e:
        return {"status": "error", "message": str(e)}

def get_total_sales_card():
    try:
        conn = connect()

        # TODO
        
        conn.close()
    except Exception as e:
        return {"status": "error", "message": str(e)}

def get_total_sales_month(month):
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