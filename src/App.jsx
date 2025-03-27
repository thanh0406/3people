import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './view/account/login';
import Register from './view/account/Register';
import HomeAdmin from './view/admin/HomeAdmin';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Header from './view/user/header/Header';
import HeaderAdmin from './view/admin/HeaderAdmin/HeaderAdmin'
import CategoriesAdmin from './view/admin/menuAdmin/CategoriesAdmin';
import ProductAdmin from './view/admin/menuAdmin/ProductsAdmin';
import AccountAdmin from './view/admin/menuAdmin/AccountAdmin';
import Home from './view/user/Home';
import CategoryPage from './view/user/CategoryPage/CategoryPage';
import ProductDetail from './view/user/ProductDetail/ProductDetail';
import CartUser from './view/user/cart/CartUser';
import Checkout from './view/user/Checkout/Checkout';


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
        <Route path="/header-user" element={<><Header /><Home /></>} />
        <Route path="/categorypage/:id" element={<><Header /><CategoryPage/></>} />
        <Route path="/product/:id" element={<><Header /><ProductDetail/></>} />
        <Route path="/cartuser" element={<><Header /><CartUser/></>} />
        <Route path="/checkout" element={<Checkout/>} />
        
        
        

      </Routes>
    </Router>
  );
}

export default App;
