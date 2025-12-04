from ..db import connect

def get_categories():
    try:
        conn = connect()

        # TODO
        
        conn.close()
    except Exception as e:
        return {"status": "error", "message": str(e)}
    
def insert_categories(name,bg='#FFFFFF',text='#000000'):
    try:
        conn = connect()

        # TODO
        
        conn.close()
    except Exception as e:
        return {"status": "error", "message": str(e)}

if __name__ == '__main__':
    # py -m uv run -m app.services.category
    '''
    test here
    '''
    print(get_categories())
