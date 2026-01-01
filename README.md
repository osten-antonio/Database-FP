
# Inventory and Supplier System

This project was developed as a Database Technology final project and focuses on proper relational database design, normalization, and real-world workflows.

An Inventory and Supplier Management System provides a centralized platform for monitoring warehouse inventory, managing product information, and recording transactions in real time. By consolidating this into a single database, warehouse managers can gain better visibility into warehouse operations, supplier relationships, and order fulfillment processes. This allows for faster decision-making and improvement in operational efficiency.

### Core Entities
- Account (Admin / Manager / Supplier)
- Warehouse
- Product
- Category
- Inventory
- Order & OrderLine
- Restock
- Customer & Address

### Entity Relation Diagram
<img width="1402" height="967" alt="image1" src="https://github.com/user-attachments/assets/36638a2d-807e-4588-a8d9-6e997ff7758a" />


### User Roles
- Admin
  - All permissions granted for manager and supplier

- Manager
  - Manage warehouse inventory
  - Create orders and restock requests

- Supplier
  - Manage supplied products
  - View related sales and restock data

## Features
- JWT-based authentication
- Multi-warehouse inventory tracking
- Product & category management
- Supplier and manager role separation
- Order creation with stock validation
- Restock management for warehouses
- Dashboard with aggregated insights:
  - Total sales
  - Top-selling products
  - Warehouse stock levels
- Search and filter support
- Fully normalized database (up to 3NF)


## Tech Stack

#### Frontend
- Next.js (JavaScript)
- Tailwind CSS
- Leaflet

#### Backend
- Python FastAPI
- MySQL Connector
- Docker (database connection)

#### Database
- MySQL


## Getting Started

### Dependencies
````
- Node.js (Next.js, Tailwind CSS, Leaflet)  
- Python>=3.10 (FastAPI, Uvicorn)  
- MySQL  
- Docker
````

### Database configuration
In MySQL:
```
CREATE DATABASE invsupply_db;

USE invsupply_db;

INSERT INTO Account(name,email,phone_number,password,account_type) VALUES
('admin','admin@db.com','088888888888','$argon2id$v=19$m=65536,t=3,p=4$Sun9fy/FuJcSwtibM2bMGQ$PMrm+cqXehHO7eoC1pt99TDpG7RL1aIDhJhNy9MNZUU','admin');
```

To log in use:
- Email: `admin@db.com`
- Password: `password`

1. **Clone repository:**
```bash
git clone https://github.com/osten-antonio/Database-FP

cd Database-FP
```
2. **Environment variables configuration (```.env```)**:

- Project (```Database-FP/.env```):
```
root_pass:'YOUR_MYSQL_ROOT_PASSWORD'
```

- Backend (```Database-FP/backend/.env```):
```
db_host=db
db_user=YOUR_ROOT_USERNAME
db_password=YOUR_MYSQL_ROOT_PASSWORD
db=invsupply_db
```

- Frontend (```Database-FP/frontend/.env```):
```
NEXT_PUBLIC_API_BASE_URL = 'http://localhost:9000'
API_BASE_URL = 'http://localhost:9000'
```

3. **Running backend:**
```bash
docker compose up --build
```

4. **Installing frontend dependencies and running:**
```bash
cd frontend

npm install

npm run dev
```

## Screenshots
To see more, check the project report

<img width="1715" height="1009" alt="image16" src="https://github.com/user-attachments/assets/43424751-d20c-48ad-9a68-ea974063eb53" />
<img width="1719" height="1004" alt="image18" src="https://github.com/user-attachments/assets/a0622650-616b-4fd2-bea0-f3ba0a862ab1" />
<img width="1999" height="1328" alt="image15" src="https://github.com/user-attachments/assets/5de1954c-2067-4a1c-944b-0cac395d1dea" />
<img width="1725" height="1006" alt="image4" src="https://github.com/user-attachments/assets/c3da9f18-9226-4503-b1e7-721dc367fed4" />
<img width="1724" height="1005" alt="image12" src="https://github.com/user-attachments/assets/6a383789-aa09-4ee9-9435-3ce38169b7f0" />



## Future Improvements
- Automatic restocking based on stock thresholds
- Multi-product restock orders
- Role specialization using EERD
- Performance optimizations for large datasets
- Implementing role specific features (e.g. different permissions/views)
