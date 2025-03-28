import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaHome, FaThList, FaBox, FaUser, FaShoppingCart, FaDollarSign} from 'react-icons/fa';
import { FaSignOutAlt } from 'react-icons/fa';

const HeaderAdmin = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");

        navigate("/login");
    };

    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">
                <a className="navbar-brand d-flex align-items-center" href="/admin">
                    <h3 className="mb-0">Web Admin</h3>
                </a>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <button className="btn btn-outline-dark mx-1" onClick={() => navigate('/admin')}>
                                <FaHome className="me-1" /> Trang chủ
                            </button>
                        </li>
                        <li className="nav-item">
                            <button className="btn btn-outline-dark mx-1" onClick={() => navigate('/categoriesAdmin')}>
                                <FaThList className="me-1" /> Danh mục
                            </button>
                        </li>
                        <li className="nav-item">
                            <button className="btn btn-outline-dark mx-1" onClick={() => navigate('/productAdmin')}>
                                <FaBox className="me-1" /> Sản phẩm
                            </button>
                        </li>
                        <li className="nav-item">
                            <button className="btn btn-outline-dark mx-1" onClick={() => navigate('/accountAdmin')}>
                                <FaUser className="me-1" /> Tài khoản
                            </button>
                        </li>
                        <li className="nav-item">
                            <button className="btn btn-outline-dark mx-1" onClick={() => navigate('/oderadmin')}>
                                <FaShoppingCart className="me-1" /> Đơn hàng
                            </button>
                        </li>
                        <li className="nav-item">
                            <button className="btn btn-outline-dark mx-1" onClick={() => navigate('/revenueadmin')}>
                                <FaDollarSign className="me-1" /> Doanh thu
                            </button>
                        </li>
                    </ul>
                    <form className="d-flex">
                        <button className="btn btn-danger d-flex align-items-center" onClick={handleLogout}>
                            <FaSignOutAlt className="me-1" /> Đăng xuất
                        </button>
                    </form>
                </div>
            </div>
        </nav>
    );
};

export default HeaderAdmin;