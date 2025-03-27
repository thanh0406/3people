import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom"; // Thêm Link
import "bootstrap/dist/css/bootstrap.min.css";

const CategoryPage = () => {
  const { id } = useParams(); // Lấy categoryId từ URL
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`http://localhost:3000/products?categoryId=${id}`);
        if (!response.ok) throw new Error("Không thể lấy sản phẩm");
        const data = await response.json();
        console.log("Dữ liệu sản phẩm:", data);
        setProducts(data);
        setLoading(false);
      } catch (err) {
        console.error("Lỗi lấy sản phẩm:", err);
        setError(err.message);
        setLoading(false);
      }
    };
    fetchProducts();
  }, [id]);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Danh mục sản phẩm</h2>
      {loading ? (
        <p>Đang tải sản phẩm...</p>
      ) : error ? (
        <p className="text-danger">Lỗi: {error}</p>
      ) : products.length > 0 ? (
        <div className="row">
          {products.map((product) => (
            <div key={product.id} className="col-md-4 col-sm-6 mb-4">
              <div className="card h-100 shadow-sm">
                {product.image_base64 ? (
                  <img
                    src={product.image_base64}
                    alt={product.name}
                    className="card-img-top"
                    style={{ maxHeight: "200px", objectFit: "cover" }}
                  />
                ) : (
                  <div
                    className="card-img-top bg-secondary d-flex align-items-center justify-content-center"
                    style={{ height: "200px" }}
                  >
                    <span className="text-white">Không có ảnh</span>
                  </div>
                )}
                <div className="card-body">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text">{product.description}</p>
                  <p className="card-text fw-bold">{product.price} VND</p>
                  <Link
                    to={`/product/${product.id}`} // Điều hướng sang trang chi tiết
                    className="btn btn-primary"
                  >
                    Thêm vào giỏ hàng
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>Không có sản phẩm nào trong danh mục này.</p>
      )}
    </div>
  );
};

export default CategoryPage;