import React, { useEffect, useState } from 'react';
import axios from 'axios';

function LogsViewer() {
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/logs`)
      .then((res) => {
        if (Array.isArray(res.data)) {
          setLogs(res.data);
        } else {
          setLogs([]);
          setError('Invalid data format from server');
        }
      })
      .catch((err) => {
        console.error('Error fetching logs:', err);
        setError('Failed to fetch logs');
      });
  }, []);

  return (
    <div>
      <h3>Inventory Logs</h3>
      {error && <p className="text-danger">{error}</p>}
      {logs.length === 0 ? (
        <p>No logs available.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Quantity Changed</th>
              <th>Change Type</th>
              <th>Log Date</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td>{log.product_id}</td>
                <td>{log.quantity_changed}</td>
                <td>{log.change_type}</td>
                <td>{new Date(log.log_date).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default LogsViewer;
