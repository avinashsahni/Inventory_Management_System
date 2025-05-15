import React, { useEffect, useState } from 'react';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;


function SalesReport() {
  const [report, setReport] = useState(null);

  useEffect(() => {
    axios.get(`${API_URL}/api/reports/sales`).then(res => setReport(res.data));
  }, []);

  if (!report) return <p>Loading report...</p>;

  return (
    <div>
      <h3>Sales Report</h3>
      <ul>
        <li><strong>Total Sales:</strong> ${report.total_sales}</li>
        <li><strong>Total Discount:</strong> ${report.total_discount}</li>
        <li><strong>Top Selling Product:</strong> {report.top_selling_product?.name || 'N/A'}</li>
        <li><strong>Profit Margin:</strong> {report.profit_margin?.toFixed(2)}%</li>
      </ul>
    </div>
  );
}

export default SalesReport;