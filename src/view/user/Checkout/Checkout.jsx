// Checkout.jsx
import { useLocation, useNavigate } from 'react-router-dom';

const Checkout = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { selectedItems, totalPrice } = state || { selectedItems: [], totalPrice: 0 };

  const handleConfirmPayment = async () => {
    const userId = localStorage.getItem('userId');

    if (!userId) {
      alert('Vui lòng đăng nhập để thanh toán!');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          selectedItems,
          totalPrice,
          paymentMethod: 'cash',
          status: 'pending',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Lỗi khi thanh toán');
      }

      const orderData = await response.json();
      const orderId = orderData.orderId;

      // Chuyển sang trang xác nhận đơn hàng với thông tin
      navigate('/oderconfirmation', {
        state: {
          orderId,
          selectedItems,
          totalPrice,
          status: 'pending'
        }
      });

      // Timeout để cập nhật trạng thái sau 15 phút
      setTimeout(async () => {
        await updateOrderStatus(orderId, 'completed');
      }, 15 * 60 * 1000);

    } catch (error) {
      console.error('Lỗi khi thanh toán:', error.message);
      alert('Thanh toán thất bại. Vui lòng thử lại!');
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const response = await fetch(`http://localhost:3000/checkout/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Lỗi khi cập nhật trạng thái đơn hàng');
      }
    } catch (error) {
      console.error('Lỗi:', error.message);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Thanh toán</h2>

      {selectedItems.length === 0 ? (
        <p>Không có sản phẩm nào để thanh toán.</p>
      ) : (
        <>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>Tên sản phẩm</th>
                <th>Giá</th>
                <th>Số lượng</th>
                <th>Tổng</th>
              </tr>
            </thead>
            <tbody>
              {selectedItems.map(item => (
                <tr key={item.id} style={{ borderBottom: '1px solid #ddd' }}>
                  <td>{item.name}</td>
                  <td>{Number(item.price).toLocaleString()} VND</td>
                  <td>{item.quantity}</td>
                  <td>{(Number(item.price) * Number(item.quantity)).toLocaleString()} VND</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: '20px', textAlign: 'right' }}>
            <h3>Tổng tiền: {totalPrice.toLocaleString()} VND</h3>
            <button
              onClick={handleConfirmPayment}
              style={{
                background: 'blue',
                color: 'white',
                padding: '10px 20px',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Xác nhận thanh toán
            </button>
            <button
              onClick={() => navigate('/cart')}
              style={{
                background: 'gray',
                color: 'white',
                padding: '10px 20px',
                border: 'none',
                cursor: 'pointer',
                marginLeft: '10px',
              }}
            >
              Quay lại giỏ hàng
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Checkout;