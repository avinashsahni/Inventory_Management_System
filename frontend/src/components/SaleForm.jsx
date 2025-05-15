import React, { useState, useEffect } from 'react';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;


function SaleForm() {
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [discount, setDiscount] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get(`${API_URL}/api/products`).then(res => setProducts(res.data));
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    if (discount > 50 || quantity <= 0) return setMessage('Invalid input');

    try {
      const res = await axios.post('/api/sales', {
        product_id: productId,
        quantity_sold: quantity,
        discount_percentage: discount
      });
      setMessage('Sale created successfully');
    } catch (err) {
      setMessage('Error creating sale');
    }
  };

  return (
    <div>
      <h3>Make a Sale</h3>
      <form onSubmit={handleSubmit} className="row g-3">
        <div className="col-md-4">
          <select onChange={e => setProductId(e.target.value)} className="form-select">
            <option>Select product</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <input type="number" min="1" className="form-control" placeholder="Quantity" onChange={e => setQuantity(e.target.value)} />
        </div>
        <div className="col-md-3">
          <input type="number" max="50" min="0" className="form-control" placeholder="Discount %" onChange={e => setDiscount(e.target.value)} />
        </div>
        <div className="col-md-2">
          <button type="submit" className="btn btn-primary">Submit</button>
        </div>
      </form>
      {message && <p className="mt-2 text-danger">{message}</p>}
    </div>
  );
}

export default SaleForm;