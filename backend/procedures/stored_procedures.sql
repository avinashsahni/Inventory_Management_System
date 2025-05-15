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
