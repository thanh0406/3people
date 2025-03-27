import { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Dùng Link thay cho navigate
import "bootstrap/dist/css/bootstrap.min.css";

const Header = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true); // Thêm trạng thái loading
  const [error, setError] = useState(null); // Thêm trạng thái lỗi

  // Gọi API để lấy danh mục
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:3000/categories");
        if (!response.ok) throw new Error("Không thể lấy danh mục");
        const data = await response.json();
        setCategories(data);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi lấy danh mục:", error);
        setError(error.message);
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand" to="/">
          My Shop
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="categoryDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Categories
              </a>
              <ul className="dropdown-menu" aria-labelledby="categoryDropdown">
                {loading ? (
                  <li>
                    <span className="dropdown-item text-muted">Loading...</span>
                  </li>
                ) : error ? (
                  <li>
                    <span className="dropdown-item text-danger">Lỗi: {error}</span>
                  </li>
                ) : categories.length > 0 ? (
                  categories.map((category) => (
                    <li key={category.id}>
                      <Link
                        className="dropdown-item"
                        to={`/categorypage/${category.id}`} // Sửa thành /category/
                      >
                        {category.name}
                      </Link>
                    </li>
                  ))
                ) : (
                  <li>
                    <span className="dropdown-item text-muted">Không có danh mục</span>
                  </li>
                )}
              </ul>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/cartuser">
                Giỏ hàng
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;