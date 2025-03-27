import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [iceOption, setIceOption] = useState("Bình thường");
  const [sugarOption, setSugarOption] = useState("50%");
  const [sizeOption, setSizeOption] = useState("L");
  const navigate = useNavigate();

  const userId = localStorage.getItem('userId');
  console.log("localStorage",localStorage)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:3000/products/${id}`);
        if (!response.ok) throw new Error("Không thể lấy chi tiết sản phẩm");
        const data = await response.json();
        console.log("Chi tiết sản phẩm:", data);
        setProduct(data);
        setLoading(false);
      } catch (err) {
        console.error("Lỗi lấy sản phẩm:", err);
        setError(err.message);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;

    if (!userId) {
      alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!");
      navigate("/login");
      return;
    }

    const cartItem = {
      product_id: product.id,
      name: product.name,
      price: product.price,
      ice: iceOption,
      sugar: sugarOption,
      size: sizeOption,
      quantity: 1,
    };

    try {
      console.log('Dữ liệu gửi đi:', cartItem); // Debug dữ liệu
      const response = await fetch(`http://localhost:3000/api/cart/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cartItem),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Lỗi khi thêm vào giỏ hàng");
      }

      const result = await response.json();
      console.log("Đã thêm vào giỏ hàng:", result);
      alert("Sản phẩm đã được thêm vào giỏ hàng thành công!");
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Đã có lỗi xảy ra khi thêm vào giỏ hàng: " + error.message);
    }
  };

  if (loading) return <div className="container mt-4">Đang tải...</div>;
  if (error) return <div className="container mt-4 text-danger">Lỗi: {error}</div>;
  if (!product) return <div className="container mt-4">Không tìm thấy sản phẩm</div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Chi tiết sản phẩm</h2>
      <div className="row">
        <div className="col-md-6">
          {product.image_base64 ? (
            <img
              src={product.image_base64}
              alt={product.name}
              className="img-fluid"
              style={{ maxHeight: "400px", objectFit: "cover" }}
            />
          ) : (
            <div
              className="bg-secondary d-flex align-items-center justify-content-center"
              style={{ height: "400px" }}
            >
              <span className="text-white">Không có ảnh</span>
            </div>
          )}
        </div>
        <div className="col-md-6">
          <h3>{product.name}</h3>
          <p>{product.description}</p>
          <p className="fw-bold">{product.price} VND</p>

          <div className="mb-3">
            <label className="form-label">Tùy chọn đá:</label>
            <select
              className="form-select"
              value={iceOption}
              onChange={(e) => setIceOption(e.target.value)}
            >
              <option value="Ít đá">Ít đá</option>
              <option value="Nhiều đá">Nhiều đá</option>
              <option value="Bình thường">Bình thường</option>
              <option value="Không đá">Không đá</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Tùy chọn đường:</label>
            <select
              className="form-select"
              value={sugarOption}
              onChange={(e) => setSugarOption(e.target.value)}
            >
              <option value="0%">0% đường</option>
              <option value="30%">30%</option>
              <option value="50%">50%</option>
              <option value="70%">70%</option>
              <option value="100%">100%</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Size:</label>
            <select
              className="form-select"
              value={sizeOption}
              onChange={(e) => setSizeOption(e.target.value)}
            >
              <option value="L">L</option>
              <option value="XL">XL</option>
            </select>
          </div>

          <button className="btn btn-primary" onClick={handleAddToCart}>
            Thêm vào giỏ hàng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;