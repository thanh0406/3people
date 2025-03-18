import PropTypes from 'prop-types';
import { useState } from 'react';
import { FaShoppingCart, FaSignInAlt, FaEnvelope } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = ({ user }) => {
    const [isLoggedIn] = useState(user ? true : false); // Kiểm tra nếu có thông tin người dùng thì đã đăng nhập
    const navigate = useNavigate();

    const handleLoginClick = () => {
      if (!isLoggedIn) {
        navigate('/login');
      } else {
        alert('Bạn đã đăng nhập!');
      }
    };

    return (
      <header className="header">
        <div className="logo">
          <img src="logo.png" alt="Logo" />
        </div>
        <div className="search">
          <input type="text" placeholder="Tìm kiếm..." />
        </div>
        <div className="user-actions">
          <button className="action-btn" onClick={handleLoginClick}>
            {isLoggedIn ? `Xin chào, ${user.email}` : <><FaSignInAlt size={20} /> Đăng nhập</>}
          </button>
          <button className="action-btn">
            <FaShoppingCart size={20} /> Giỏ hàng
          </button>
          <button className="action-btn">
            <FaEnvelope size={20} /> Email
          </button>
        </div>
      </header>
    );
};

// Khai báo PropTypes
Header.propTypes = {
  user: PropTypes.shape({
    email: PropTypes.string.isRequired, // Bắt buộc phải có email
  })
};

export default Header;
