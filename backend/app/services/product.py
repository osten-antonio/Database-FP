from ..db import connect

def get_product():
    try:
        conn = connect()
        cur = conn.cursor(dictionary=True)

        query = """
            SELECT p.product_id, p.product_name, p.price, p.category_id, a.name AS supplier_name, a.email AS supplier_email, COALESCE(SUM(ol.amount * ol.order_price), 0) AS total_sales, a.account_id as account_id 
            FROM Product p
            LEFT JOIN Account a ON p.account_id = a.account_id
            LEFT JOIN OrderLine ol ON p.product_id = ol.product_id
            GROUP BY p.product_id, p.product_name, p.price, p.category_id, a.name, a.email
        """
        
        cur.execute(query)
        rows = cur.fetchall()
        conn.close()

        return rows

    except Exception as e:
        return {"status": "error", "message": str(e)}

def search_product(name='', supplier=''):
    try:
        conn = connect()
        cur = conn.cursor(dictionary=True)

        query = """
            SELECT p.product_id, p.product_name, p.price, p.category_id, a.name AS supplier_name, COALESCE(SUM(ol.amount * ol.order_price), 0) AS total_sales, a.account_id as account_id 
            FROM Product p
            LEFT JOIN Account a ON p.account_id = a.account_id
            LEFT JOIN OrderLine ol ON p.product_id = ol.product_id
            WHERE 1 = 1
        """
        
        params = []

        if name:
            query += " AND p.product_name LIKE %s"
            params.append(f"%{name}%")

        if supplier:
            query += " AND a.name LIKE %s"
            params.append(f"%{supplier}%")

        query += """
            GROUP BY p.product_id, p.product_name, p.price, p.category_id, a.name
        """

        cur.execute(query, params)
        rows = cur.fetchall()
        conn.close()

        return rows

    except Exception as e:
        return {"status": "error", "message": str(e)}


def delete_product(id):
    try:
        conn = connect()
        cur = conn.cursor()

        query = "DELETE FROM Product WHERE product_id = %s"

        cur.execute(query, (id,))
        conn.commit()
        conn.close()

        return {"status": "success", "message": "product deleted"}

    except Exception as e:
        return {"status": "error", "message": str(e)}


def create_product(product_name,price=0,category_id=0,supplier_name=''):
    try:
        conn = connect()
        cur = conn.cursor()

        cur.execute('SELECT account_id FROM Account WHERE LOWER(name)=%s',(supplier_name.lower(),))
        account_id = cur.fetchone()[0]


        query = """
            INSERT INTO Product (product_name, price, category_id, account_id)
            VALUES (%s, %s, %s, %s)
        """
        
        cur.execute(query, (product_name, price, category_id, account_id))
        conn.commit()
        conn.close()

        return {"status": "success", "message": "product created"}
        
    except Exception as e:
        return {"status": "error", "message": str(e)}


def edit_product(id, product_name, price=0, category_id=0, supplier_name=''):
    try:
        conn = connect()
        cur = conn.cursor()

        cur.execute('SELECT account_id FROM Account WHERE LOWER(name)=%s',(supplier_name.lower(),))
        account_id = cur.fetchone()[0]


        query = """
            UPDATE Product
            SET product_name = %s, price = %s, category_id = %s, account_id = %s
            WHERE product_id = %s
        """

        cur.execute(query, (product_name, price, category_id, account_id, id))
        conn.commit()
        conn.close()

        return {"status": "success", "message": "product updated"}

    except Exception as e:
        return {"status": "error", "message": str(e)}

    
def filter_product(min_cost=0,max_cost=float('inf'),suppliers=[],category_id=[]):
    try:
        conn = connect()
        cur = conn.cursor(dictionary=True)

        query = """
        
            SELECT p.product_id, p.product_name, p.price, p.category_id, a.name AS supplier_name, a.email AS supplier_email, COALESCE(SUM(ol.amount * ol.order_price), 0) AS total_sales, a.account_id as account_id 
            FROM Product p
            LEFT JOIN Account a ON p.account_id = a.account_id
            LEFT JOIN OrderLine ol ON p.product_id = ol.product_id
            WHERE p.price BETWEEN %s AND %s
        """
        
        params = [min_cost, max_cost]

        if suppliers:
            query += " AND a.name IN (" + ", ".join(["%s"] * len(suppliers)) + ")"
            params.extend(suppliers)

        if category_id:
            query += " AND a.name IN (" + ", ".join(["%s"] * len(category_id)) + ")"
            params.extend(category_id)

        query += """
            GROUP BY p.product_id, p.product_name, p.price, p.category_id, a.name
        """
        print(query,params)
        cur.execute(query, params)
        rows = cur.fetchall()
        conn.close()

        return rows

    except Exception as e:
        return {"status": "error", "message": str(e)}



if __name__ == '__main__':
    print("\nget product:")
    print(get_product())

    print("\nsearch product:")
    print(search_product(name="milk"))

    print("\ndelete product:")
    print(delete_product(1))

    print("\ncreate product:")
    print(create_product(
        product_name = "chocolate chip cookie",
        price = 19.99,
        category_id = 4,
        account_id = 7
    ))

    print("\nedit product:")
    print(edit_product(
        id = 3,
        product_name = "milkshake",
        price = 25.50,
        category_id = 1,
        account_id = 1
    ))

    print("\nfilter product:")
    print(filter_product(
        min_cost=10,
        max_cost=50,
        suppliers=["Supplier A"],
        category_id=[1,4]
    ))