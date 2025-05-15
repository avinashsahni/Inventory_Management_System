Absolutely! Here’s a complete `README.md` file with all the information you requested, formatted nicely for your GitHub repo:

````markdown
# Inventory Management System

This repository contains a full-stack Inventory Management System built with **Node.js**, **Express.js**, **PostgreSQL** (using Prisma ORM), and **React**.

---

## Features

- Manage products, sales, and inventory logs.
- Stored procedures for sales calculation and product restocking.
- Triggers for logging sales and low stock notifications.
- Responsive React frontend with Bootstrap styling.

---

## Setup Instructions

### Backend

1. Navigate to the backend folder:
   ```bash
   cd backend
````

2. Create a `.env` file (copy from `.env.example`) and fill in your PostgreSQL credentials:

   ```
   PG_HOST=localhost
   PG_PORT=5432
   PG_USER=your_user
   PG_PASSWORD=your_password
   PG_DATABASE=inventory_db
   PORT=3000
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Set up your database:

   * Run the SQL scripts in the `procedures/` folder to create tables, stored procedures, and triggers.
   * Alternatively, use Prisma migrations if configured.

5. Start the backend server:

   ```bash
   npm start
   ```

---

### Frontend

1. Navigate to the frontend folder:

   ```bash
   cd frontend
   ```

2. Create a `.env` file (copy from `.env.example`) and add the backend API URL:

   ```
   VITE_API_BASE_URL=http://localhost:3000
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the frontend server:

   ```bash
   npm run dev
   ```

---

## Database Schema

### Tables

* **products:** Holds product info (id, name, description, price, stock\_quantity, timestamps).
* **sales:** Records each sale (product\_id, quantity\_sold, total\_price, discount\_applied, sale\_date).
* **inventory\_logs:** Logs inventory changes (product\_id, quantity\_changed, change\_type, log\_date).

### Stored Procedures

* **calculate\_sale:** Calculates discounted total, updates stock, inserts sale record, and returns sale details.
* **restock\_product:** Adds stock quantity and logs restock event.

### Triggers

* **after\_sale\_trigger:** Logs inventory changes after a sale.
* **low\_stock\_trigger:** Alerts when stock quantity falls below 5.

---

## ORM

This project uses **Prisma** as the ORM for these reasons:

* Type-safe database queries in JavaScript/TypeScript.
* Auto-generated models from the database schema.
* Easy migration management.
* Modern developer experience and good community support.

---

## Usage

Once both backend and frontend are running, access the React app on `http://localhost:5173` (default Vite port). Use the UI to manage products, create sales, restock inventory, and view reports/logs.

---

## Example SQL Stored Procedures (Located in `backend/procedures/stored_procedures.sql`)

```sql
-- Table creation example (run once)

CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  stock_quantity INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sales (
  id SERIAL PRIMARY KEY,
  product_id INT REFERENCES products(id),
  quantity_sold INT NOT NULL,
  total_price NUMERIC(10, 2) NOT NULL,
  discount_applied NUMERIC(5, 2) NOT NULL,
  sale_date TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS inventory_logs (
  id SERIAL PRIMARY KEY,
  product_id INT REFERENCES products(id),
  quantity_changed INT NOT NULL,
  change_type VARCHAR(20) NOT NULL,
  log_date TIMESTAMP DEFAULT NOW()
);

-- Stored procedure: calculate_sale
CREATE OR REPLACE FUNCTION calculate_sale(
  p_product_id INT,
  p_quantity_sold INT,
  p_discount_percentage NUMERIC
)
RETURNS TABLE (
  total_price NUMERIC,
  discount_applied NUMERIC
) AS $$
DECLARE
  original_price NUMERIC;
  discounted_price NUMERIC;
  total_price_calc NUMERIC;
  total_discount NUMERIC;
BEGIN
  IF p_discount_percentage > 50 THEN
    RAISE EXCEPTION 'Discount cannot exceed 50%%';
  END IF;

  SELECT price INTO original_price FROM products WHERE id = p_product_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Product not found';
  END IF;

  -- Extra 5% discount if quantity_sold > 10
  IF p_quantity_sold > 10 THEN
    p_discount_percentage := p_discount_percentage + 5;
    IF p_discount_percentage > 50 THEN
      p_discount_percentage := 50;
    END IF;
  END IF;

  total_price_calc := original_price * p_quantity_sold;
  total_discount := (p_discount_percentage / 100.0) * total_price_calc;
  discounted_price := total_price_calc - total_discount;

  IF discounted_price < total_price_calc * 0.1 THEN
    RAISE EXCEPTION 'Sale price cannot be less than 10%% of original price';
  END IF;

  -- Update stock
  UPDATE products SET stock_quantity = stock_quantity - p_quantity_sold, updated_at = NOW()
  WHERE id = p_product_id AND stock_quantity >= p_quantity_sold;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Insufficient stock';
  END IF;

  -- Insert sale
  INSERT INTO sales (product_id, quantity_sold, total_price, discount_applied)
  VALUES (p_product_id, p_quantity_sold, discounted_price, p_discount_percentage);

  RETURN QUERY SELECT discounted_price, p_discount_percentage;
END;
$$ LANGUAGE plpgsql;

-- Stored procedure: restock_product
CREATE OR REPLACE FUNCTION restock_product(
  p_product_id INT,
  p_quantity_to_add INT
)
RETURNS VOID AS $$
BEGIN
  UPDATE products SET stock_quantity = stock_quantity + p_quantity_to_add, updated_at = NOW()
  WHERE id = p_product_id;

  INSERT INTO inventory_logs(product_id, quantity_changed, change_type)
  VALUES (p_product_id, p_quantity_to_add, 'RESTOCK');
END;
$$ LANGUAGE plpgsql;
```

---

## Git Setup

To initialize git and push your code to GitHub:

```bash
git init
git add .
git commit -m "Initial commit - Inventory Management System"
git remote add origin https://github.com/avinashsahni/inventory-management-system.git
git branch -M main
git push -u origin main
```

---

## License

MIT License

---

If you want help generating any code or configuration files, just ask!

```

---

You can simply copy-paste this into your repo’s root `README.md`. Want me to help create `.env.example`, backend boilerplate, or frontend starter files next?
```
