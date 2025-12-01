from ..db import connect

def search_order(item='',customer_name=''):
    try:
        conn = connect()
        cursor = conn.cursor()
        
        # TODO here

        result = cursor.fetchall()

        cursor.close()
        conn.close()

        return {"status": "ok", "result": result}
    except Exception as e:
        return {"status": "error", "message": str(e)}

def filter_order(
        date_ordered=None,deliver_date=None,
        cost_min=0,cost_max=float('inf'),
        delivered=False,overdue=False,in_progress=False,
        warehouse=[],category=[],supplier=[]
        ):
    try:
        conn = connect()

        # TODO

        conn.close()
    except Exception as e:
        return {"status": "error", "message": str(e)}
    
def delete_order(order_id,line_id):
    try:
        conn = connect()

        # TODO
        
        conn.close()
    except Exception as e:
        return {"status": "error", "message": str(e)}
def create_order(
        customer_id,warehouse_id,address_id,order_date,delivery_date,items=[]
        ):
    try:
        conn = connect()

        # TODO
        
        conn.close()
    except Exception as e:
        return {"status": "error", "message": str(e)}

def edit_order(
        order_id,customer_id,warehouse,address_id,order_date,delivery_date,items=[]
        ):
    '''
    Edit entire order, from order table, not orderline

    Args:
        date_ordered (string): dd-mm-yyyy format
        delivery_date (string): dd-mm-yyyy format
        items (list[int]): list of id 

    Returns:
        None
    '''
    try:
        conn = connect()

        # TODO
        
        conn.close()
    except Exception as e:
        return {"status": "error", "message": str(e)}

def get_order(limit=None):
    '''
    limit is int, so get all order descending order in ID
    '''
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