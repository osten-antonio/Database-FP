from ..db import connect

def get_categories():
    try:
        conn = connect()
        cursor = conn.cursor()
        cursor.execute("SELECT category_id, name, bg_color, text_color FROM Category")
        categories = cursor.fetchall()

        result = []
        for cat in categories:
            result.append({
                "category_id": cat[0],
                "name": cat[1],
                "bg_color": cat[2],
                "text_color": cat[3]
            })

        cursor.close()
        conn.close()
        return {"status": "success", "data": result}
    except Exception as e:
        return {"status": "error", "message": str(e)}
    
def insert_categories(name,bg='#FFFFFF',text='#000000'):
    try:
        conn = connect()
        cursor = conn.cursor()
        cursor.execute("INSERT INTO categories (name, bg_color, text_color) VALUES (%s, %s, %s)", (name,bg,text))
        conn.commit()
        cursor.close()
        return {"status": "success", "message": "Category inserted successfully."}
        conn.close()
    except Exception as e:
        return {"status": "error", "message": str(e)}

if __name__ == '__main__':
    # py -m uv run -m app.services.category
    '''
    test here
    '''
    print(get_categories())
