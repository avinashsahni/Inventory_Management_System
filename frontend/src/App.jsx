import ProductList from './components/ProductList';
import SaleForm from './components/SaleForm';
import RestockForm from './components/RestockForm';
import SalesReport from './components/SalesReport';
import LogsViewer from './components/LogsViewer';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'

function App() {
  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Inventory Management System</h1>
      <ProductList />
      <hr />
      <SaleForm />
      <hr />
      <RestockForm />
      <hr />
      <SalesReport />
      <hr />
      <LogsViewer />
    </div>
  );
}

export default App;