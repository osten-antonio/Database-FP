from ..db import connect

def get_product():
    try:
        conn = connect()
        cur = conn.cursor()

        query = """
            SELECT p.product_id, p.product_name, p.price, c.name AS category_name, a.name AS supplier_name, a.email AS supplier_email
            FROM product p
            LEFT JOIN category c ON p.category_id = c.category_id
            LEFT JOIN account a ON p.account_id = a.account_id
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
            SELECT p.product_id, p.product_name, p.price, c.name AS category_name, a.name AS supplier_name, a.email AS supplier_email
            FROM product p
            LEFT JOIN category c ON p.category_id = c.category_id
            LEFT JOIN account a ON p.account_id = a.account_id
            WHERE 1 = 1
        """
        
        params = []

        if name:
            query += " AND p.product_name LIKE %s"
            params.append(f"%{name}%")

        if supplier:
            query += " AND a.name LIKE %s"
            params.append(f"%{supplier}%")

        cur.execute(query, params)
        rows = cur.fetchall()
        conn.close()

        return {"status": "success", "data": rows}

    except Exception as e:
        return {"status": "error", "message": str(e)}


def delete_product(id):
    try:
        conn = connect()
        cur = conn.cursor()

        query = "DELETE FROM product WHERE product_id = %s"

        cur.execute(query, (id,))
        conn.commit()
        conn.close()

        return {"status": "success", "message": "product deleted"}

    except Exception as e:
        return {"status": "error", "message": str(e)}


def create_product(product_name,price=0,category_id=0,account_id=None):
    try:
        conn = connect()
        cur = conn.cursor()

        query = """
            INSERT INTO product (product_name, price, category_id, account_id)
            VALUES (%s, %s, %s, %s)
        """
        
        cur.execute(query, (product_name, price, category_id, account_id))
        conn.commit()
        conn.close()

        return {"status": "success", "message": "product created"}
        
        conn.close()
    except Exception as e:
        return {"status": "error", "message": str(e)}


def edit_product(id,product_name,price=0,category_id=0,account_id=None):
    try:
        conn = connect()
        cur = conn.cursor()

        query = """
            UPDATE product
            SET product_name = %s, price = %s, category_id = %s, account_id = %s
            WHERE product_id = %s
        """

        cur.execute(query, (product_name, price, account_id, category_id, id))
        conn.commit()
        conn.close()

        return {"status": "success", "message": "product updated"}

    except Exception as e:
        return {"status": "error", "message": str(e)}

    
def filter_product(min_cost=0,max_cost=float('inf'),suppliers=[],category=[]):
    try:
        conn = connect()
        cur = conn.cursor()

        query = """
            SELECT p.product_id, p.product_name, p.price, c.name AS category_name, a.name AS supplier_name
            FROM product p
            LEFT JOIN category c ON p.category_id = c.category_id
            LEFT JOIN account a ON p.account_id = a.account_id
            WHERE p.price BETWEEN %s AND %s
        """
        
        params = [min_cost, max_cost]

        if suppliers:
            query += " AND a.name IN (" + ", ".join(["%s"] * len(suppliers)) + ")"
            params.extend(suppliers)

        if category:
            query += " AND a.name IN (" + ", ".join(["%s"] * len(category)) + ")"
            params.extend(category)
        
        cur.execute(query, params)
        rows = cur.fetchall()
        conn.close()

        return {"status": "success", "data": rows}

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
    print(filter_product(min_cost=10, max_cost=50, suppliers=["Supplier A"], category=["Electronics"]))