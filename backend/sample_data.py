'''
This file is used to give sample data to build on the frontend
Just used to ensure all of the data is on the right format, etc
Data is chatgpted lol, but format is the same as in the figma and lucidchart
'''
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://localhost:8080",
    "http://localhost:6767",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



@app.get("/orders")
def get_order():
    orders=[
        { "order_id": 2001, "customer_name": "Fitriani Yusuf", "order_date": "19-12-2013", "item": "Smartphone Lens Kit", "amount": 1, "cost": 19.99, "expected_delivery_date": "30-12-2013", "status": 1, "warehouse_name": "Jakarta Central" },
        { "order_id": 2001, "customer_name": "Fitriani Yusuf", "order_date": "19-12-2013", "item": "Tripod Mount", "amount": 2, "cost": 12.50, "expected_delivery_date": "30-12-2013", "status": 1, "warehouse_name": "Jakarta Central" },
        { "order_id": 2001, "customer_name": "Fitriani Yusuf", "order_date": "19-12-2013", "item": "Bluetooth Remote Shutter", "amount": 1, "cost": 8.75, "expected_delivery_date": "30-12-2013", "status": 1, "warehouse_name": "Jakarta Central" },

        { "order_id": 2002, "customer_name": "Rina Sari", "order_date": "20-12-2013", "item": "Wireless Mouse", "amount": 3, "cost": 45.00, "expected_delivery_date": "02-01-2014", "status": 2, "warehouse_name": "Bandung Hub" },
        { "order_id": 2002, "customer_name": "Rina Sari", "order_date": "20-12-2013", "item": "USB-C Charger", "amount": 1, "cost": 15.99, "expected_delivery_date": "02-01-2014", "status": 2, "warehouse_name": "Bandung Hub" },

        { "order_id": 2003, "customer_name": "Dedi Pratama", "order_date": "21-12-2013", "item": "Mechanical Keyboard", "amount": 1, "cost": 79.99, "expected_delivery_date": "05-01-2014", "status": 3, "warehouse_name": "Surabaya Depot" },
        { "order_id": 2003, "customer_name": "Dedi Pratama", "order_date": "21-12-2013", "item": "Laptop Stand", "amount": 2, "cost": 39.50, "expected_delivery_date": "05-01-2014", "status": 3, "warehouse_name": "Surabaya Depot" },

        { "order_id": 2004, "customer_name": "Grace Lim", "order_date": "22-12-2013", "item": "Bluetooth Speaker", "amount": 1, "cost": 55.00, "expected_delivery_date": "06-01-2014", "status": 1, "warehouse_name": "Medan Storage" },
        { "order_id": 2004, "customer_name": "Grace Lim", "order_date": "22-12-2013", "item": "HDMI Cable", "amount": 2, "cost": 20.00, "expected_delivery_date": "06-01-2014", "status": 1, "warehouse_name": "Medan Storage" },
        { "order_id": 2006, "customer_name": "Intan Dewi", "order_date": "24-12-2013", "item": "Ergonomic Chair", "amount": 1, "cost": 199.99, "expected_delivery_date": "08-01-2014", "status": 1, "warehouse_name": "Jakarta Central" },
        { "order_id": 2006, "customer_name": "Intan Dewi", "order_date": "24-12-2013", "item": "Laptop Stand", "amount": 2, "cost": 39.50, "expected_delivery_date": "08-01-2014", "status": 1, "warehouse_name": "Jakarta Central" },

        { "order_id": 2007, "customer_name": "Maya Fitri", "order_date": "25-12-2013", "item": "Wireless Earbuds", "amount": 1, "cost": 59.99, "expected_delivery_date": "09-01-2014", "status": 2, "warehouse_name": "Bandung Hub" },
        { "order_id": 2007, "customer_name": "Maya Fitri", "order_date": "25-12-2013", "item": "Power Bank 10000mAh", "amount": 1, "cost": 29.99, "expected_delivery_date": "09-01-2014", "status": 2, "warehouse_name": "Bandung Hub" },

        { "order_id": 2008, "customer_name": "Rudi Hartono", "order_date": "26-12-2013", "item": "USB-C Hub", "amount": 2, "cost": 24.99, "expected_delivery_date": "10-01-2014", "status": 3, "warehouse_name": "Surabaya Depot" },

        { "order_id": 2009, "customer_name": "Tina Marlina", "order_date": "27-12-2013", "item": "Smartwatch", "amount": 1, "cost": 129.99, "expected_delivery_date": "11-01-2014", "status": 1, "warehouse_name": "Medan Storage" },
        { "order_id": 2009, "customer_name": "Tina Marlina", "order_date": "27-12-2013", "item": "Wireless Charger Pad", "amount": 1, "cost": 39.99, "expected_delivery_date": "11-01-2014", "status": 1, "warehouse_name": "Medan Storage" },

        { "order_id": 2010, "customer_name": "Wawan Kurniawan", "order_date": "28-12-2013", "item": "Laptop Backpack", "amount": 1, "cost": 49.99, "expected_delivery_date": "12-01-2014", "status": 2, "warehouse_name": "Yogyakarta Storage" },
        { "order_id": 2010, "customer_name": "Wawan Kurniawan", "order_date": "28-12-2013", "item": "USB-C to HDMI Adapter", "amount": 2, "cost": 19.99, "expected_delivery_date": "12-01-2014", "status": 2, "warehouse_name": "Yogyakarta Storage" },

        { "order_id": 2011, "customer_name": "Yuni Astuti", "order_date": "29-12-2013", "item": "Portable SSD 1TB", "amount": 1, "cost": 119.99, "expected_delivery_date": "13-01-2014", "status": 3, "warehouse_name": "Semarang Hub" },

        { "order_id": 2012, "customer_name": "Zaki Ramadhan", "order_date": "30-12-2013", "item": "Mechanical Keyboard", "amount": 1, "cost": 89.99, "expected_delivery_date": "14-01-2014", "status": 1, "warehouse_name": "Makassar Depot" },
        { "order_id": 2012, "customer_name": "Zaki Ramadhan", "order_date": "30-12-2013", "item": "Wireless Mouse", "amount": 2, "cost": 29.99, "expected_delivery_date": "14-01-2014", "status": 1, "warehouse_name": "Makassar Depot" },

        { "order_id": 2013, "customer_name": "Ayu Lestari", "order_date": "31-12-2013", "item": "Laptop Cooling Pad", "amount": 1, "cost": 25.00, "expected_delivery_date": "15-01-2014", "status": 2, "warehouse_name": "Jakarta Central" },
        { "order_id": 2013, "customer_name": "Ayu Lestari", "order_date": "31-12-2013", "item": "USB Hub", "amount": 1, "cost": 15.00, "expected_delivery_date": "15-01-2014", "status": 2, "warehouse_name": "Jakarta Central" },

        { "order_id": 2014, "customer_name": "Bambang Setiawan", "order_date": "01-01-2014", "item": "Gaming Headset", "amount": 1, "cost": 69.99, "expected_delivery_date": "16-01-2014", "status": 3, "warehouse_name": "Bandung Hub" },

        { "order_id": 2015, "customer_name": "Citra Anggraini", "order_date": "02-01-2014", "item": "Wireless Router", "amount": 1, "cost": 59.99, "expected_delivery_date": "17-01-2014", "status": 1, "warehouse_name": "Surabaya Depot" },
        { "order_id": 2015, "customer_name": "Citra Anggraini", "order_date": "02-01-2014", "item": "HDMI Cable", "amount": 2, "cost": 10.00, "expected_delivery_date": "17-01-2014", "status": 1, "warehouse_name": "Surabaya Depot" },

        { "order_id": 2016, "customer_name": "Dian Permata", "order_date": "03-01-2014", "item": "Laptop Docking Station", "amount": 1, "cost": 129.99, "expected_delivery_date": "18-01-2014", "status": 2, "warehouse_name": "Medan Storage" },

        { "order_id": 2017, "customer_name": "Eko Nugroho", "order_date": "04-01-2014", "item": "Smartphone Tripod", "amount": 2, "cost": 29.99, "expected_delivery_date": "19-01-2014", "status": 3, "warehouse_name": "Yogyakarta Storage" },
        { "order_id": 2017, "customer_name": "Eko Nugroho", "order_date": "04-01-2014", "item": "Bluetooth Speaker", "amount": 1, "cost": 49.99, "expected_delivery_date": "19-01-2014", "status": 3, "warehouse_name": "Yogyakarta Storage" },

        { "order_id": 2018, "customer_name": "Fitriani Yusuf", "order_date": "05-01-2014", "item": "Smartphone VR Headset", "amount": 1, "cost": 89.99, "expected_delivery_date": "20-01-2014", "status": 1, "warehouse_name": "Semarang Hub" },

        { "order_id": 2019, "customer_name": "Grace Lim", "order_date": "06-01-2014", "item": "Laptop Sleeve", "amount": 2, "cost": 19.99, "expected_delivery_date": "21-01-2014", "status": 2, "warehouse_name": "Makassar Depot" },

        { "order_id": 2020, "customer_name": "Hendra Saputra", "order_date": "07-01-2014", "item": "Portable Projector", "amount": 1, "cost": 249.99, "expected_delivery_date": "22-01-2014", "status": 3, "warehouse_name": "Jakarta Central" },
        { "order_id": 2021, "customer_name": "Intan Dewi", "order_date": "08-01-2014", "item": "Wireless Presenter", "amount": 1, "cost": 24.99, "expected_delivery_date": "23-01-2014", "status": 1, "warehouse_name": "Bandung Hub" },
        { "order_id": 2021, "customer_name": "Intan Dewi", "order_date": "08-01-2014", "item": "USB-C to VGA Adapter", "amount": 1, "cost": 19.99, "expected_delivery_date": "23-01-2014", "status": 1, "warehouse_name": "Bandung Hub" },

        { "order_id": 2022, "customer_name": "Maya Fitri", "order_date": "09-01-2014", "item": "Smartphone Ring Holder", "amount": 3, "cost": 5.99, "expected_delivery_date": "24-01-2014", "status": 2, "warehouse_name": "Surabaya Depot" },

        { "order_id": 2023, "customer_name": "Rudi Hartono", "order_date": "10-01-2014", "item": "Laptop Privacy Screen", "amount": 1, "cost": 49.99, "expected_delivery_date": "25-01-2014", "status": 3, "warehouse_name": "Medan Storage" },
        { "order_id": 2023, "customer_name": "Rudi Hartono", "order_date": "10-01-2014", "item": "USB-C Multiport Adapter", "amount": 1, "cost": 39.99, "expected_delivery_date": "25-01-2014", "status": 3, "warehouse_name": "Medan Storage" },

        { "order_id": 2024, "customer_name": "Tina Marlina", "order_date": "11-01-2014", "item": "Smartphone VR Headset", "amount": 1, "cost": 89.99, "expected_delivery_date": "26-01-2014", "status": 1, "warehouse_name": "Yogyakarta Storage" },
        { "order_id": 2024, "customer_name": "Tina Marlina", "order_date": "11-01-2014", "item": "Wireless Earbuds", "amount": 1, "cost": 59.99, "expected_delivery_date": "26-01-2014", "status": 1, "warehouse_name": "Yogyakarta Storage" },

        { "order_id": 2025, "customer_name": "Wawan Kurniawan", "order_date": "12-01-2014", "item": "Laptop Desk Organizer", "amount": 2, "cost": 29.99, "expected_delivery_date": "27-01-2014", "status": 2, "warehouse_name": "Semarang Hub" },

        { "order_id": 2026, "customer_name": "Yuni Astuti", "order_date": "13-01-2014", "item": "USB-C to Lightning Cable", "amount": 2, "cost": 14.99, "expected_delivery_date": "28-01-2014", "status": 3, "warehouse_name": "Makassar Depot" },
        { "order_id": 2026, "customer_name": "Yuni Astuti", "order_date": "13-01-2014", "item": "Laptop Sleeve", "amount": 1, "cost": 19.99, "expected_delivery_date": "28-01-2014", "status": 3, "warehouse_name": "Makassar Depot" },

        { "order_id": 2027, "customer_name": "Zaki Ramadhan", "order_date": "14-01-2014", "item": "Smartphone Cooling Fan", "amount": 1, "cost": 24.99, "expected_delivery_date": "29-01-2014", "status": 1, "warehouse_name": "Jakarta Central" },

        { "order_id": 2028, "customer_name": "Ayu Lestari", "order_date": "15-01-2014", "item": "Laptop Stand with Fan", "amount": 1, "cost": 34.99, "expected_delivery_date": "30-01-2014", "status": 2, "warehouse_name": "Bandung Hub" },
        { "order_id": 2028, "customer_name": "Ayu Lestari", "order_date": "15-01-2014", "item": "USB-C to Micro USB Adapter", "amount": 2, "cost": 9.99, "expected_delivery_date": "30-01-2014", "status": 2, "warehouse_name": "Bandung Hub" },

        { "order_id": 2029, "customer_name": "Bambang Setiawan", "order_date": "16-01-2014", "item": "Wireless Trackpad", "amount": 1, "cost": 95.00, "expected_delivery_date": "31-01-2014", "status": 3, "warehouse_name": "Surabaya Depot" },

        { "order_id": 2030, "customer_name": "Citra Anggraini", "order_date": "17-01-2014", "item": "Laptop Riser Stand", "amount": 1, "cost": 45.00, "expected_delivery_date": "01-02-2014", "status": 1, "warehouse_name": "Medan Storage" },
        { "order_id": 2030, "customer_name": "Citra Anggraini", "order_date": "17-01-2014", "item": "USB-C Fast Charger", "amount": 1, "cost": 29.99, "expected_delivery_date": "01-02-2014", "status": 1, "warehouse_name": "Medan Storage" },

        { "order_id": 2031, "customer_name": "Dian Permata", "order_date": "18-01-2014", "item": "Smartphone Selfie Ring Light", "amount": 2, "cost": 15.99, "expected_delivery_date": "02-02-2014", "status": 2, "warehouse_name": "Yogyakarta Storage" },

        { "order_id": 2032, "customer_name": "Eko Nugroho", "order_date": "19-01-2014", "item": "Laptop Cable Organizer", "amount": 3, "cost": 8.99, "expected_delivery_date": "03-02-2014", "status": 3, "warehouse_name": "Semarang Hub" },

        { "order_id": 2033, "customer_name": "Fitriani Yusuf", "order_date": "20-01-2014", "item": "USB-C Audio Adapter", "amount": 1, "cost": 12.99, "expected_delivery_date": "04-02-2014", "status": 1, "warehouse_name": "Makassar Depot" },
        { "order_id": 2033, "customer_name": "Fitriani Yusuf", "order_date": "20-01-2014", "item": "Laptop Screen Protector", "amount": 1, "cost": 19.99, "expected_delivery_date": "04-02-2014", "status": 1, "warehouse_name": "Makassar Depot" },

        { "order_id": 2034, "customer_name": "Grace Lim", "order_date": "21-01-2014", "item": "Smartphone Wireless Gamepad", "amount": 1, "cost": 65.00, "expected_delivery_date": "05-02-2014", "status": 2, "warehouse_name": "Jakarta Central" },

        { "order_id": 2035, "customer_name": "Hendra Saputra", "order_date": "22-01-2014", "item": "Laptop Foot Pads", "amount": 2, "cost": 5.99, "expected_delivery_date": "06-02-2014", "status": 3, "warehouse_name": "Bandung Hub" },

        { "order_id": 2036, "customer_name": "Intan Dewi", "order_date": "23-01-2014", "item": "USB-C Splitter Dock", "amount": 1, "cost": 45.00, "expected_delivery_date": "07-02-2014", "status": 1, "warehouse_name": "Surabaya Depot" },
        { "order_id": 2061, "customer_name": "Intan Dewi", "order_date": "09-02-2014", "item": "USB-C to SD Card Reader", "amount": 1, "cost": 17.99, "expected_delivery_date": "24-02-2014", "status": 1, "warehouse_name": "Jakarta Central" },
        { "order_id": 2061, "customer_name": "Intan Dewi", "order_date": "09-02-2014", "item": "Laptop Screen Cleaner Kit", "amount": 2, "cost": 12.50, "expected_delivery_date": "24-02-2014", "status": 1, "warehouse_name": "Jakarta Central" },

        { "order_id": 2062, "customer_name": "Maya Fitri", "order_date": "10-02-2014", "item": "Smartphone VR Controller", "amount": 1, "cost": 75.00, "expected_delivery_date": "25-02-2014", "status": 2, "warehouse_name": "Bandung Hub" },

        { "order_id": 2063, "customer_name": "Rudi Hartono", "order_date": "11-02-2014", "item": "Laptop Desk Organizer", "amount": 1, "cost": 25.00, "expected_delivery_date": "26-02-2014", "status": 3, "warehouse_name": "Surabaya Depot" },
        { "order_id": 2063, "customer_name": "Rudi Hartono", "order_date": "11-02-2014", "item": "USB-C to Audio Jack", "amount": 1, "cost": 12.99, "expected_delivery_date": "26-02-2014", "status": 3, "warehouse_name": "Surabaya Depot" },

        { "order_id": 2064, "customer_name": "Tina Marlina", "order_date": "12-02-2014", "item": "Smartphone Magnetic Mount", "amount": 2, "cost": 9.99, "expected_delivery_date": "27-02-2014", "status": 1, "warehouse_name": "Medan Storage" },

        { "order_id": 2065, "customer_name": "Wawan Kurniawan", "order_date": "13-02-2014", "item": "Laptop Stand with Drawer", "amount": 1, "cost": 49.99, "expected_delivery_date": "28-02-2014", "status": 2, "warehouse_name": "Yogyakarta Storage" },
        { "order_id": 2065, "customer_name": "Wawan Kurniawan", "order_date": "13-02-2014", "item": "USB-C to Dual HDMI Splitter", "amount": 1, "cost": 45.00, "expected_delivery_date": "28-02-2014", "status": 2, "warehouse_name": "Yogyakarta Storage" },

        { "order_id": 2066, "customer_name": "Yuni Astuti", "order_date": "14-02-2014", "item": "Smartphone Wireless Gamepad", "amount": 1, "cost": 65.00, "expected_delivery_date": "01-03-2014", "status": 3, "warehouse_name": "Semarang Hub" },

        { "order_id": 2067, "customer_name": "Zaki Ramadhan", "order_date": "15-02-2014", "item": "Laptop Screen Protector", "amount": 2, "cost": 19.99, "expected_delivery_date": "02-03-2014", "status": 1, "warehouse_name": "Makassar Depot" },

        { "order_id": 2068, "customer_name": "Ayu Lestari", "order_date": "16-02-2014", "item": "USB-C to USB-A Adapter", "amount": 3, "cost": 7.99, "expected_delivery_date": "03-03-2014", "status": 2, "warehouse_name": "Jakarta Central" },

        { "order_id": 2069, "customer_name": "Bambang Setiawan", "order_date": "17-02-2014", "item": "Laptop Cable Clip Set", "amount": 2, "cost": 8.99, "expected_delivery_date": "04-03-2014", "status": 3, "warehouse_name": "Bandung Hub" },

        { "order_id": 2070, "customer_name": "Citra Anggraini", "order_date": "18-02-2014", "item": "Smartphone Cooling Pad", "amount": 1, "cost": 19.99, "expected_delivery_date": "05-03-2014", "status": 1, "warehouse_name": "Surabaya Depot" },
        { "order_id": 2070, "customer_name": "Citra Anggraini", "order_date": "18-02-2014", "item": "Wireless Display Dongle", "amount": 1, "cost": 59.99, "expected_delivery_date": "05-03-2014", "status": 1, "warehouse_name": "Surabaya Depot" },

        { "order_id": 2071, "customer_name": "Dian Permata", "order_date": "19-02-2014", "item": "Laptop Riser Stand", "amount": 1, "cost": 39.99, "expected_delivery_date": "06-03-2014", "status": 2, "warehouse_name": "Medan Storage" },

        { "order_id": 2072, "customer_name": "Eko Nugroho", "order_date": "20-02-2014", "item": "Smartphone Stylus Pen", "amount": 2, "cost": 12.99, "expected_delivery_date": "07-03-2014", "status": 3, "warehouse_name": "Yogyakarta Storage" },

        { "order_id": 2073, "customer_name": "Fitriani Yusuf", "order_date": "21-02-2014", "item": "Laptop Foot Pads", "amount": 2, "cost": 5.99, "expected_delivery_date": "08-03-2014", "status": 1, "warehouse_name": "Semarang Hub" },

        { "order_id": 2074, "customer_name": "Grace Lim", "order_date": "22-02-2014", "item": "USB-C Magnetic Cable", "amount": 1, "cost": 14.99, "expected_delivery_date": "09-03-2014", "status": 2, "warehouse_name": "Makassar Depot" },
        { "order_id": 2074, "customer_name": "Grace Lim", "order_date": "22-02-2014", "item": "Laptop Stand with Fan", "amount": 1, "cost": 34.99, "expected_delivery_date": "09-03-2014", "status": 2, "warehouse_name": "Makassar Depot" },

        { "order_id": 2075, "customer_name": "Hendra Saputra", "order_date": "23-02-2014", "item": "Smartphone Tripod Mini", "amount": 2, "cost": 15.99, "expected_delivery_date": "10-03-2014", "status": 3, "warehouse_name": "Jakarta Central" },

        { "order_id": 2076, "customer_name": "Intan Dewi", "order_date": "24-02-2014", "item": "Laptop Webcam 1080p", "amount": 1, "cost": 59.99, "expected_delivery_date": "11-03-2014", "status": 1, "warehouse_name": "Bandung Hub" },

        { "order_id": 2077, "customer_name": "Joko Prabowo", "order_date": "25-02-2014", "item": "Smartphone VR Headset", "amount": 1, "cost": 89.99, "expected_delivery_date": "12-03-2014", "status": 2, "warehouse_name": "Surabaya Depot" },

        { "order_id": 2078, "customer_name": "Lina Kusuma", "order_date": "26-02-2014", "item": "Laptop Docking Station", "amount": 1, "cost": 129.99, "expected_delivery_date": "13-03-2014", "status": 3, "warehouse_name": "Medan Storage" },

    ]
    return orders

@app.get("/products")
def get_products():
    '''
    Category ID should be handled in the frontend,
    while getting the supplier name from the product table should be handled here
    '''
    products=[
        { "id": 1, "name": "Wireless Mouse", "total_sales": 320, "price": 14.99, "category_id": 1, "supplier_name": "TechNova Supplies" },
        { "id": 2, "name": "Mechanical Keyboard", "total_sales": 180, "price": 79.50, "category_id": 1, "supplier_name": "KeyPro Indonesia" },
        { "id": 3, "name": "Gaming Headset", "total_sales": 95, "price": 59.99, "category_id": 2, "supplier_name": "SoundWave Gear" },
        { "id": 4, "name": "USB-C Charger", "total_sales": 410, "price": 19.99, "category_id": 3, "supplier_name": "Voltix Electronics" },
        { "id": 5, "name": "Laptop Stand", "total_sales": 260, "price": 34.99, "category_id": 4, "supplier_name": "ErgoCraft" },
        { "id": 6, "name": "Bluetooth Speaker", "total_sales": 150, "price": 49.99, "category_id": 2, "supplier_name": "SoundWave Gear" },
        { "id": 7, "name": "Portable SSD 1TB", "total_sales": 75, "price": 119.00, "category_id": 5, "supplier_name": "DataVault Solutions" },
        { "id": 8, "name": "Webcam HD", "total_sales": 120, "price": 39.99, "category_id": 2, "supplier_name": "VisionTech" },
        { "id": 9, "name": "Ergonomic Chair", "total_sales": 40, "price": 199.00, "category_id": 6, "supplier_name": "ErgoCraft" },
        { "id": 10, "name": "Monitor 24 inch", "total_sales": 55, "price": 210.00, "category_id": 6, "supplier_name": "DisplayHub" },
        { "id": 11, "name": "HDMI Cable", "total_sales": 500, "price": 9.99, "category_id": 3, "supplier_name": "Voltix Electronics" },
        { "id": 12, "name": "Smartphone Stand", "total_sales": 300, "price": 12.50, "category_id": 4, "supplier_name": "ErgoCraft" },
        { "id": 13, "name": "Power Bank 10000mAh", "total_sales": 220, "price": 29.99, "category_id": 3, "supplier_name": "Voltix Electronics" },
        { "id": 14, "name": "Wireless Earbuds", "total_sales": 190, "price": 59.00, "category_id": 2, "supplier_name": "SoundWave Gear" },
        { "id": 15, "name": "Laptop Cooling Pad", "total_sales": 110, "price": 24.99, "category_id": 4, "supplier_name": "ErgoCraft" },
        { "id": 16, "name": "External HDD 2TB", "total_sales": 60, "price": 99.99, "category_id": 5, "supplier_name": "DataVault Solutions" },
        { "id": 17, "name": "Wireless Router", "total_sales": 85, "price": 79.99, "category_id": 5, "supplier_name": "NetLink Systems" },
        { "id": 18, "name": "Smartwatch", "total_sales": 70, "price": 149.00, "category_id": 2, "supplier_name": "SoundWave Gear" },
        { "id": 19, "name": "USB Hub", "total_sales": 340, "price": 14.99, "category_id": 3, "supplier_name": "Voltix Electronics" },
        { "id": 20, "name": "Wireless Presenter", "total_sales": 130, "price": 29.50, "category_id": 4, "supplier_name": "ErgoCraft" },
        { "id": 21, "name": "Graphic Tablet", "total_sales": 45, "price": 89.99, "category_id": 1, "supplier_name": "KeyPro Indonesia" },
        { "id": 22, "name": "Noise Cancelling Headphones", "total_sales": 60, "price": 129.00, "category_id": 2, "supplier_name": "SoundWave Gear" },
        { "id": 23, "name": "Smartphone Tripod", "total_sales": 210, "price": 24.99, "category_id": 4, "supplier_name": "ErgoCraft" },
        { "id": 24, "name": "Laptop Sleeve", "total_sales": 180, "price": 19.99, "category_id": 4, "supplier_name": "ErgoCraft" },
        { "id": 25, "name": "USB-C to HDMI Adapter", "total_sales": 290, "price": 14.99, "category_id": 3, "supplier_name": "Voltix Electronics" },
        { "id": 26, "name": "Wireless Charging Pad", "total_sales": 150, "price": 29.99, "category_id": 3, "supplier_name": "Voltix Electronics" },
        { "id": 27, "name": "Portable Projector", "total_sales": 35, "price": 249.00, "category_id": 6, "supplier_name": "DisplayHub" },
        { "id": 28, "name": "Projector Screen", "total_sales": 40, "price": 89.99, "category_id": 6, "supplier_name": "DisplayHub" },
        { "id": 29, "name": "Laptop Docking Station", "total_sales": 55, "price": 119.00, "category_id": 5, "supplier_name": "NetLink Systems" },
        { "id": 30, "name": "Bluetooth Adapter", "total_sales": 310, "price": 12.99, "category_id": 3, "supplier_name": "Voltix Electronics" },
        { "id": 31, "name": "Tripod Mount", "total_sales": 210, "price": 9.99, "category_id": 4, "supplier_name": "ErgoCraft" },
        { "id": 32, "name": "Bluetooth Remote Shutter", "total_sales": 180, "price": 7.50, "category_id": 4, "supplier_name": "ErgoCraft" },
        { "id": 33, "name": "Smartphone Gimbal", "total_sales": 65, "price": 149.00, "category_id": 2, "supplier_name": "SoundWave Gear" },
        { "id": 34, "name": "USB-C to VGA Adapter", "total_sales": 140, "price": 17.99, "category_id": 3, "supplier_name": "Voltix Electronics" },
        { "id": 35, "name": "DisplayPort Cable", "total_sales": 90, "price": 11.99, "category_id": 3, "supplier_name": "Voltix Electronics" },
        { "id": 36, "name": "Ergonomic Mouse Pad", "total_sales": 310, "price": 6.99, "category_id": 4, "supplier_name": "ErgoCraft" },
        { "id": 37, "name": "Smartphone Lens Kit", "total_sales": 130, "price": 19.99, "category_id": 2, "supplier_name": "SoundWave Gear" },
        { "id": 38, "name": "Noise Filter Microphone", "total_sales": 75, "price": 79.99, "category_id": 2, "supplier_name": "SoundWave Gear" },
        { "id": 39, "name": "Wireless Display Dongle", "total_sales": 95, "price": 59.99, "category_id": 5, "supplier_name": "NetLink Systems" },
        { "id": 40, "name": "Laptop Backpack", "total_sales": 160, "price": 39.99, "category_id": 4, "supplier_name": "ErgoCraft" },
        { "id": 41, "name": "USB-C Ethernet Adapter", "total_sales": 120, "price": 24.99, "category_id": 3, "supplier_name": "Voltix Electronics" },
        { "id": 42, "name": "Smartphone Car Mount", "total_sales": 210, "price": 14.99, "category_id": 4, "supplier_name": "ErgoCraft" },
        { "id": 43, "name": "Laptop Privacy Screen", "total_sales": 45, "price": 49.99, "category_id": 6, "supplier_name": "DisplayHub" },
        { "id": 44, "name": "Portable Monitor 15.6\"", "total_sales": 30, "price": 229.00, "category_id": 6, "supplier_name": "DisplayHub" },
        { "id": 45, "name": "USB-C Multiport Adapter", "total_sales": 180, "price": 39.99, "category_id": 3, "supplier_name": "Voltix Electronics" },
        { "id": 46, "name": "Wireless Charging Stand", "total_sales": 140, "price": 34.99, "category_id": 3, "supplier_name": "Voltix Electronics" },
        { "id": 47, "name": "Foldable Laptop Table", "total_sales": 90, "price": 59.99, "category_id": 4, "supplier_name": "ErgoCraft" },
        { "id": 48, "name": "Smartphone Stylus Pen", "total_sales": 200, "price": 9.99, "category_id": 1, "supplier_name": "KeyPro Indonesia" },
        { "id": 49, "name": "USB-C Magnetic Cable", "total_sales": 310, "price": 12.99, "category_id": 3, "supplier_name": "Voltix Electronics" },
        { "id": 50, "name": "Laptop Screen Cleaner Kit", "total_sales": 400, "price": 7.99, "category_id": 4, "supplier_name": "ErgoCraft" },
        { "id": 51, "name": "Portable Bluetooth Keyboard", "total_sales": 85, "price": 34.99, "category_id": 1, "supplier_name": "KeyPro Indonesia" },
        { "id": 52, "name": "Smartphone VR Headset", "total_sales": 60, "price": 89.99, "category_id": 2, "supplier_name": "SoundWave Gear" },
        { "id": 53, "name": "Laptop Webcam Cover", "total_sales": 500, "price": 4.99, "category_id": 4, "supplier_name": "ErgoCraft" },
        { "id": 54, "name": "USB-C Power Splitter", "total_sales": 150, "price": 19.99, "category_id": 3, "supplier_name": "Voltix Electronics" },
        { "id": 55, "name": "Smartphone Ring Holder", "total_sales": 600, "price": 5.99, "category_id": 4, "supplier_name": "ErgoCraft" },
        { "id": 56, "name": "Laptop Foot Pads", "total_sales": 220, "price": 6.99, "category_id": 4, "supplier_name": "ErgoCraft" },
        { "id": 57, "name": "USB-C Audio Adapter", "total_sales": 180, "price": 14.99, "category_id": 3, "supplier_name": "Voltix Electronics" },
        { "id": 58, "name": "Smartphone Cooling Fan", "total_sales": 95, "price": 24.99, "category_id": 2, "supplier_name": "SoundWave Gear" },
        { "id": 59, "name": "Laptop Cable Organizer", "total_sales": 300, "price": 8.99, "category_id": 4, "supplier_name": "ErgoCraft" },
        { "id": 60, "name": "USB-C Splitter Dock", "total_sales": 110, "price": 49.99, "category_id": 3, "supplier_name": "NetLink Systems" },
        { "id": 61, "name": "Smartphone Screen Protector", "total_sales": 550, "price": 7.99, "category_id": 4, "supplier_name": "ErgoCraft" },
        { "id": 62, "name": "USB-C Fast Charger", "total_sales": 420, "price": 24.99, "category_id": 3, "supplier_name": "Voltix Electronics" },
        { "id": 63, "name": "Wireless Trackpad", "total_sales": 65, "price": 89.99, "category_id": 1, "supplier_name": "KeyPro Indonesia" },
        { "id": 64, "name": "Laptop Riser Stand", "total_sales": 210, "price": 39.99, "category_id": 4, "supplier_name": "ErgoCraft" },
        { "id": 65, "name": "Smartphone Charging Cable", "total_sales": 600, "price": 12.99, "category_id": 3, "supplier_name": "Voltix Electronics" },
        { "id": 66, "name": "Portable Wi-Fi Hotspot", "total_sales": 80, "price": 99.99, "category_id": 5, "supplier_name": "NetLink Systems" },
        { "id": 67, "name": "Laptop Sleeve 15.6\"", "total_sales": 190, "price": 21.99, "category_id": 4, "supplier_name": "ErgoCraft" },
        { "id": 68, "name": "Smartphone Tripod with Light", "total_sales": 110, "price": 34.99, "category_id": 4, "supplier_name": "ErgoCraft" },
        { "id": 69, "name": "USB-C Docking Station", "total_sales": 95, "price": 119.00, "category_id": 5, "supplier_name": "NetLink Systems" },
        { "id": 70, "name": "Wireless Charging Mat", "total_sales": 130, "price": 29.99, "category_id": 3, "supplier_name": "Voltix Electronics" },
        { "id": 71, "name": "Smartphone Armband", "total_sales": 300, "price": 14.99, "category_id": 4, "supplier_name": "ErgoCraft" },
        { "id": 72, "name": "Laptop Stand with Drawer", "total_sales": 75, "price": 49.99, "category_id": 4, "supplier_name": "ErgoCraft" },
        { "id": 73, "name": "USB-C to Lightning Cable", "total_sales": 480, "price": 19.99, "category_id": 3, "supplier_name": "Voltix Electronics" },
        { "id": 74, "name": "Smartphone Cooling Pad", "total_sales": 90, "price": 24.99, "category_id": 2, "supplier_name": "SoundWave Gear" },
        { "id": 75, "name": "Laptop Webcam 1080p", "total_sales": 140, "price": 59.99, "category_id": 2, "supplier_name": "VisionTech" },
        { "id": 76, "name": "Foldable Bluetooth Keyboard", "total_sales": 100, "price": 39.99, "category_id": 1, "supplier_name": "KeyPro Indonesia" },
        { "id": 77, "name": "Smartphone Selfie Ring Light", "total_sales": 250, "price": 15.99, "category_id": 4, "supplier_name": "ErgoCraft" },
        { "id": 78, "name": "USB-C to SD Card Reader", "total_sales": 310, "price": 17.99, "category_id": 3, "supplier_name": "Voltix Electronics" },
        { "id": 79, "name": "Laptop Cable Clip Set", "total_sales": 400, "price": 8.99, "category_id": 4, "supplier_name": "ErgoCraft" },
        { "id": 80, "name": "Smartphone Magnetic Mount", "total_sales": 280, "price": 12.99, "category_id": 4, "supplier_name": "ErgoCraft" },
        { "id": 81, "name": "USB-C to Micro USB Adapter", "total_sales": 350, "price": 6.99, "category_id": 3, "supplier_name": "Voltix Electronics" },
        { "id": 82, "name": "Laptop Stand with Fan", "total_sales": 120, "price": 34.99, "category_id": 4, "supplier_name": "ErgoCraft" },
        { "id": 83, "name": "Smartphone VR Controller", "total_sales": 40, "price": 74.99, "category_id": 2, "supplier_name": "SoundWave Gear" },
        { "id": 84, "name": "USB-C to Audio Jack", "total_sales": 270, "price": 12.99, "category_id": 3, "supplier_name": "Voltix Electronics" },
        { "id": 85, "name": "Laptop Desk Organizer", "total_sales": 180, "price": 24.99, "category_id": 4, "supplier_name": "ErgoCraft" },
        { "id": 86, "name": "Smartphone Tripod Mini", "total_sales": 320, "price": 14.99, "category_id": 4, "supplier_name": "ErgoCraft" },
        { "id": 87, "name": "USB-C to Dual HDMI Splitter", "total_sales": 95, "price": 44.99, "category_id": 3, "supplier_name": "NetLink Systems" },
        { "id": 88, "name": "Laptop Screen Protector", "total_sales": 210, "price": 19.99, "category_id": 4, "supplier_name": "ErgoCraft" },
        { "id": 89, "name": "Smartphone Wireless Gamepad", "total_sales": 60, "price": 64.99, "category_id": 2, "supplier_name": "SoundWave Gear" },
        { "id": 90, "name": "USB-C to USB-A Adapter", "total_sales": 500, "price": 7.99, "category_id": 3, "supplier_name": "Voltix Electronics" },
        { "id": 91, "name": "Laptop Cable Lock", "total_sales": 150, "price": 19.99, "category_id": 4, "supplier_name": "ErgoCraft" },
        { "id": 92, "name": "Smartphone Wireless Charger", "total_sales": 220, "price": 29.99, "category_id": 3, "supplier_name": "Voltix Electronics" },
        { "id": 93, "name": "Portable External DVD Drive", "total_sales": 80, "price": 49.99, "category_id": 5, "supplier_name": "DataVault Solutions" },
        { "id": 94, "name": "Laptop Cooling Stand XL", "total_sales": 65, "price": 59.99, "category_id": 4, "supplier_name": "ErgoCraft" },
        { "id": 95, "name": "Smartphone Clip-On Lens", "total_sales": 140, "price": 19.99, "category_id": 2, "supplier_name": "SoundWave Gear" },
        { "id": 96, "name": "USB-C Charging Hub", "total_sales": 175, "price": 39.99, "category_id": 3, "supplier_name": "Voltix Electronics" },
        { "id": 97, "name": "Laptop Adjustable Desk", "total_sales": 55, "price": 129.00, "category_id": 6, "supplier_name": "ErgoCraft" },
        { "id": 98, "name": "Smartphone VR Glasses", "total_sales": 90, "price": 79.99, "category_id": 2, "supplier_name": "SoundWave Gear" },
        { "id": 99, "name": "USB-C to Ethernet Hub", "total_sales": 200, "price": 34.99, "category_id": 3, "supplier_name": "NetLink Systems" },
        { "id": 100, "name": "Laptop Ergonomic Stand Pro", "total_sales": 100, "price": 89.99, "category_id": 4, "supplier_name": "ErgoCraft" }
    ]    
    return products

@app.get("/suppliers")
def get_supplier():
    suppliers=[
        { "id": 1, "name": "TechNova Supplies", "address": "Jl. Sudirman No. 88, Jakarta, Indonesia", "email": "contact@technova.co.id" },
        { "id": 2, "name": "KeyPro Indonesia", "address": "Jl. Braga No. 15, Bandung, Indonesia", "email": "sales@keypro.id" },
        { "id": 3, "name": "SoundWave Gear", "address": "Jl. Diponegoro No. 21, Surabaya, Indonesia", "email": "support@soundwavegear.com" },
        { "id": 4, "name": "Voltix Electronics", "address": "Jl. Gatot Subroto No. 55, Jakarta, Indonesia", "email": "info@voltix.co.id" },
        { "id": 5, "name": "ErgoCraft", "address": "Jl. Malioboro No. 101, Yogyakarta, Indonesia", "email": "hello@ergocraft.id" },
        { "id": 6, "name": "DataVault Solutions", "address": "Jl. Asia Afrika No. 77, Bandung, Indonesia", "email": "sales@datavault.id" },
        { "id": 7, "name": "NetLink Systems", "address": "Jl. Ahmad Yani No. 12, Makassar, Indonesia", "email": "contact@netlinksystems.co.id" },
        { "id": 8, "name": "VisionTech", "address": "Jl. Pemuda No. 33, Semarang, Indonesia", "email": "info@visiontech.id" },
        { "id": 9, "name": "DisplayHub", "address": "Jl. Thamrin No. 45, Jakarta, Indonesia", "email": "support@displayhub.com" },

        { "id": 10, "name": "GlobalTech Imports", "address": "Jl. Asia Raya No. 12, Medan, Indonesia", "email": "info@globaltechimports.com" },
        { "id": 11, "name": "IndoGadget Supply", "address": "Jl. Veteran No. 5, Surabaya, Indonesia", "email": "sales@indogadget.id" },
        { "id": 12, "name": "Pacific Peripherals", "address": "Jl. Ahmad Dahlan No. 88, Jakarta, Indonesia", "email": "contact@pacificperipherals.com" },
        { "id": 13, "name": "SmartLink Distribution", "address": "Jl. Dipatiukur No. 45, Bandung, Indonesia", "email": "hello@smartlink.id" },
        { "id": 14, "name": "NextWave Components", "address": "Jl. Slamet Riyadi No. 22, Solo, Indonesia", "email": "support@nextwave.id" },
        { "id": 15, "name": "DigitalEra Supply", "address": "Jl. Imam Bonjol No. 33, Denpasar, Indonesia", "email": "sales@digitalera.id" }
    ]
    return suppliers


@app.get("/customers")
def get_customer():
    customers=[
        {"customer_id":1,"name":"Hadi Puspita","email":"hadi.puspita@example.com","addresses":[{"address_id":1,"delivery_address":"Jl. Sudirman No. 84, Medan","phone_num":"+62 816-1244-9609"},{"address_id":2,"delivery_address":"Jl. Gatot Subroto No. 2, Yogyakarta","phone_num":"+62 819-4197-3789"}]},
        {"customer_id":2,"name":"Putri Wulandari","email":"putri.wulandari@example.com","addresses":[{"address_id":3,"delivery_address":"Jl. Melati Raya No. 18, Surabaya","phone_num":"+62 813-4569-3460"},{"address_id":4,"delivery_address":"Jl. Kenanga No. 138, Surabaya","phone_num":"+62 818-1375-9160"}]},
        {"customer_id":3,"name":"Andi Lestari","email":"andi.lestari@example.com","addresses":[{"address_id":5,"delivery_address":"Jl. Melati Raya No. 182, Semarang","phone_num":"+62 819-6824-7299"},{"address_id":6,"delivery_address":"Jl. Gatot Subroto No. 177, Bandung","phone_num":"+62 816-2902-8641"}]},
        {"customer_id":4,"name":"Sinta Wijaya","email":"sinta.wijaya@example.com","addresses":[{"address_id":7,"delivery_address":"Jl. Kenanga No. 123, Surabaya","phone_num":"+62 816-4225-8867"}]},
        {"customer_id":5,"name":"Lina Susilo","email":"lina.susilo@example.com","addresses":[{"address_id":8,"delivery_address":"Jl. Kartini No. 167, Surabaya","phone_num":"+62 814-3829-7953"},{"address_id":9,"delivery_address":"Jl. Melati Raya No. 197, Surabaya","phone_num":"+62 811-8921-7773"}]},
        {"customer_id":6,"name":"Oka Kurniawan","email":"oka.kurniawan@example.com","addresses":[{"address_id":10,"delivery_address":"Jl. Mawar Indah No. 173, Surabaya","phone_num":"+62 813-2082-5235"},{"address_id":11,"delivery_address":"Jl. Sudirman No. 73, Bogor","phone_num":"+62 817-1713-4512"}]},
        {"customer_id":7,"name":"Putri Anggraini","email":"putri.anggraini@example.com","addresses":[{"address_id":12,"delivery_address":"Jl. Pahlawan No. 88, Denpasar","phone_num":"+62 818-3505-6535"}]},
        {"customer_id":8,"name":"Gita Nugroho","email":"gita.nugroho@example.com","addresses":[{"address_id":13,"delivery_address":"Jl. Gatot Subroto No. 20, Semarang","phone_num":"+62 810-9106-2821"}]},
        {"customer_id":9,"name":"Indra Hartono","email":"indra.hartono@example.com","addresses":[{"address_id":14,"delivery_address":"Jl. Melati Raya No. 142, Bandung","phone_num":"+62 816-5898-8143"}]},
        {"customer_id":10,"name":"Nina Prasetyo","email":"nina.prasetyo@example.com","addresses":[{"address_id":15,"delivery_address":"Jl. Gatot Subroto No. 123, Jakarta","phone_num":"+62 815-8505-3871"}]},
        {"customer_id":11,"name":"Dewi Haryanto","email":"dewi.haryanto@example.com","addresses":[{"address_id":16,"delivery_address":"Jl. Kenanga No. 188, Bogor","phone_num":"+62 812-9654-4825"}]},
        {"customer_id":12,"name":"Oka Wulandari","email":"oka.wulandari@example.com","addresses":[{"address_id":17,"delivery_address":"Jl. Sudirman No. 46, Denpasar","phone_num":"+62 817-5506-6589"}]},
        {"customer_id":13,"name":"Lina Puspita","email":"lina.puspita@example.com","addresses":[{"address_id":18,"delivery_address":"Jl. Ahmad Yani No. 85, Surabaya","phone_num":"+62 818-6963-4804"}]},
        {"customer_id":14,"name":"Nina Wijaya","email":"nina.wijaya@example.com","addresses":[{"address_id":19,"delivery_address":"Jl. Mawar Indah No. 163, Denpasar","phone_num":"+62 812-2469-8773"},{"address_id":20,"delivery_address":"Jl. Pahlawan No. 106, Semarang","phone_num":"+62 818-6711-1882"}]},
        {"customer_id":15,"name":"Eko Setiawan","email":"eko.setiawan@example.com","addresses":[{"address_id":21,"delivery_address":"Jl. Pahlawan No. 125, Surabaya","phone_num":"+62 811-5160-2556"}]},
        {"customer_id":16,"name":"Lina Sari","email":"lina.sari@example.com","addresses":[{"address_id":22,"delivery_address":"Jl. Pahlawan No. 171, Surabaya","phone_num":"+62 816-8189-8596"}]},
        {"customer_id":17,"name":"Sinta Santoso","email":"sinta.santoso@example.com","addresses":[{"address_id":23,"delivery_address":"Jl. Ahmad Yani No. 124, Bogor","phone_num":"+62 815-8891-2971"},{"address_id":24,"delivery_address":"Jl. Pahlawan No. 164, Makassar","phone_num":"+62 818-6915-1005"}]},
        {"customer_id":18,"name":"Umi Setiawan","email":"umi.setiawan@example.com","addresses":[{"address_id":25,"delivery_address":"Jl. Veteran No. 61, Bogor","phone_num":"+62 815-5167-7052"}]},
        {"customer_id":19,"name":"Nina Rahmawati","email":"nina.rahmawati@example.com","addresses":[{"address_id":26,"delivery_address":"Jl. Mawar Indah No. 43, Medan","phone_num":"+62 811-3952-8587"}]},
        {"customer_id":20,"name":"Citra Firmansyah","email":"citra.firmansyah@example.com","addresses":[{"address_id":27,"delivery_address":"Jl. Sudirman No. 164, Semarang","phone_num":"+62 813-7244-5961"},{"address_id":28,"delivery_address":"Jl. Ahmad Yani No. 98, Yogyakarta","phone_num":"+62 816-7674-5862"}]}
    ]
    return customers

@app.get("/warehouses")
def get_warehouses():
    return [
        { "warehouse_id": 1, "account_id": 101, "name": "Jakarta Central Warehouse", "address": "Jl. Gatot Subroto No.12, Jakarta Selatan, DKI Jakarta 12950" },
        { "warehouse_id": 2, "account_id": 102, "name": "Bandung Distribution Hub", "address": "Jl. Asia Afrika No.34, Bandung, Jawa Barat 40111" },
        { "warehouse_id": 3, "account_id": 103, "name": "Surabaya Main Warehouse", "address": "Jl. Ahmad Yani No.88, Surabaya, Jawa Timur 60231" },
        { "warehouse_id": 4, "account_id": 104, "name": "Medan North Logistics", "address": "Jl. Gatot Subroto No.19, Medan, Sumatera Utara 20122" },
        { "warehouse_id": 5, "account_id": 105, "name": "Denpasar Bali Storage", "address": "Jl. Sunset Road No.21, Kuta, Bali 80361" },
        { "warehouse_id": 6, "account_id": 106, "name": "Yogyakarta Regional Hub", "address": "Jl. Malioboro No.56, Yogyakarta 55213" }
    
    ]

if __name__ == "__main__":
    uvicorn.run("sample_data:app", host="0.0.0.0", port=6767, reload=True)