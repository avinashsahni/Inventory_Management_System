import React, { useState, useEffect } from 'react';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;

function RestockForm() {
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get(`${API_URL}/api/products`).then(res => setProducts(res.data));
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    if (quantity <= 0) return setMessage('Quantity must be greater than 0');

    try {
      await axios.post('/api/restock', { product_id: productId, quantity_to_add: quantity });
      setMessage('Product restocked successfully');
    } catch (err) {
      setMessage('Error restocking product');
    }
  };

  return (
    <div>
      <h3>Restock Product</h3>
      <form onSubmit={handleSubmit} className="row g-3">
        <div className="col-md-5">
          <select onChange={e => setProductId(e.target.value)} className="form-select">
            <option>Select product</option>
            <option value="toys">Toys</option>
            <option value="cooler">Cooler</option>
            <option value="fan">Fan</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
        <div className="col-md-4">
          <input type="number" min="1" className="form-control" placeholder="Quantity to Add" onChange={e => setQuantity(e.target.value)} />
        </div>
        <div className="col-md-3">
          <button type="submit" className="btn btn-success">Restock</button>
        </div>
      </form>
      {message && <p className="mt-2 text-danger">{message}</p>}
    </div>
  );
}

export default RestockForm;