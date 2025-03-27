import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CartUser = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const userId = localStorage.getItem('userId');

  const fetchCart = async () => {
    if (!userId) {
      setLoading(false);
      setCartItems([]);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/api/cart/${userId}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Không thể lấy giỏ hàng');
      }
      const data = await response.json();
      const items = data.cart ? data.cart : data;
      const itemsWithChecked = items.map(item => ({ ...item, checked: false }));
      setCartItems(itemsWithChecked);
    } catch (error) {
      console.error('Lỗi khi lấy giỏ hàng:', error.message);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [userId]);

  const totalPrice = cartItems
    .filter(item => item.checked)
    .reduce((total, item) => total + Number(item.price) * Number(item.quantity), 0);

  const increaseQuantity = async (id) => {
    const item = cartItems.find(item => item.id === id);
    const newQuantity = item.quantity + 1;

    try {
      const response = await fetch(`http://localhost:3000/api/cart/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Lỗi khi tăng số lượng');
      }

      const updatedData = await response.json();
      setCartItems(cartItems.map(item =>
        item.id === id ? { ...item, quantity: updatedData.item.quantity } : item
      ));
    } catch (error) {
      console.error('Lỗi khi tăng số lượng:', error.message);
    }
  };

  const decreaseQuantity = async (id) => {
    const item = cartItems.find(item => item.id === id);
    if (item.quantity <= 1) return;
    const newQuantity = item.quantity - 1;

    try {
      const response = await fetch(`http://localhost:3000/api/cart/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Lỗi khi giảm số lượng');
      }

      const updatedData = await response.json();
      setCartItems(cartItems.map(item =>
        item.id === id ? { ...item, quantity: updatedData.item.quantity } : item
      ));
    } catch (error) {
      console.error('Lỗi khi giảm số lượng:', error.message);
    }
  };

  const removeItem = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/cart/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Lỗi khi xóa sản phẩm');
      }

      setCartItems(cartItems.filter(item => item.id !== id));
    } catch (error) {
      console.error('Lỗi khi xóa sản phẩm:', error.message);
    }
  };

  const handleCheckboxChange = (id) => {
    setCartItems(cartItems.map(item =>
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const handleCheckout = () => {
    const selectedItems = cartItems.filter(item => item.checked);
    if (selectedItems.length === 0) {
      alert('Vui lòng chọn ít nhất một sản phẩm để thanh toán!');
      return;
    }

    // Chuyển hướng sang trang checkout và truyền dữ liệu
    navigate('/checkout', { state: { selectedItems, totalPrice } });
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Giỏ hàng của bạn</h2>

      {loading ? (
        <p>Đang tải giỏ hàng...</p>
      ) : cartItems.length === 0 ? (
        <p>Giỏ hàng trống</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Chọn</th>
              <th>Tên sản phẩm</th>
              <th>Giá</th>
              <th>Số lượng</th>
              <th>Tổng</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map(item => (
              <tr key={item.id} style={{ borderBottom: '1px solid #ddd' }}>
                <td>
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => handleCheckboxChange(item.id)}
                  />
                </td>
                <td>{item.name}</td>
                <td>{Number(item.price).toLocaleString()} VND</td>
                <td>
                  <button onClick={() => decreaseQuantity(item.id)}>-</button>
                  <span style={{ margin: '0 10px' }}>{item.quantity}</span>
                  <button onClick={() => increaseQuantity(item.id)}>+</button>
                </td>
                <td>{(Number(item.price) * Number(item.quantity)).toLocaleString()} VND</td>
                <td>
                  <button
                    onClick={() => removeItem(item.id)}
                    style={{ background: 'red', color: 'white', border: 'none', padding: '5px' }}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {!loading && cartItems.length > 0 && (
        <div style={{ marginTop: '20px', textAlign: 'right' }}>
          <h3>Tổng tiền: {totalPrice.toLocaleString()} VND</h3>
          <button
            onClick={handleCheckout}
            style={{
              background: 'green',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Thanh toán
          </button>
        </div>
      )}
    </div>
  );
};

export default CartUser;