import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './view/account/login';
import Register from './view/account/Register';
import Home from './view/Home';
import HomeAdmin from './view/admin/HomeAdmin';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Header from './view/header/Header';
import HeaderAdmin from './view/admin/HeaderAdmin/HeaderAdmin'
import CategoriesAdmin from './view/admin/menuAdmin/CategoriesAdmin';
import ProductAdmin from './view/admin/menuAdmin/ProductsAdmin';
import 'bootstrap/dist/css/bootstrap.min.css';
import AccountAdmin from './view/admin/menuAdmin/AccountAdmin';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<><Header /><Home /></>} />
        <Route path="/admin" element={<><HeaderAdmin /><HomeAdmin /></>} />
        <Route path="/categoriesAdmin" element={<><HeaderAdmin /><CategoriesAdmin /></>} />
        <Route path="/productAdmin" element={<><HeaderAdmin /><ProductAdmin /></>} />
        <Route path="/accountAdmin" element={<><HeaderAdmin /><AccountAdmin /></>} />
        

      </Routes>
    </Router>
  );
}

export default App;
