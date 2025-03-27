import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Checkout = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { selectedItems, totalPrice } = state || { selectedItems: [], totalPrice: 0 };
  const [paymentMethod, setPaymentMethod] = useState('cash'); // Mặc định là tiền mặt
  const [showQRCode, setShowQRCode] = useState(false); // Hiển thị mã QR khi thanh toán ngân hàng

  const handleConfirmPayment = async () => {
    const userId = localStorage.getItem('userId');

    if (!userId) {
      alert('Vui lòng đăng nhập để thanh toán!');
      return;
    }

    try {
      // Gửi yêu cầu tới endpoint POST /checkout
      const response = await fetch('http://localhost:3000/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          selectedItems,
          totalPrice,
          paymentMethod, // Gửi phương thức thanh toán lên server
          status: 'pending', // Trạng thái ban đầu là pending
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Lỗi khi thanh toán');
      }

      const orderData = await response.json(); // Nhận dữ liệu đơn hàng từ server
      const orderId = orderData.orderId; // Giả sử server trả về orderId

      if (paymentMethod === 'bank') {
        // Chuyển sang trạng thái hiển thị mã QR
        setShowQRCode(true);

        // Giả lập quét mã QR thành công sau 5 giây (cho mục đích demo)
        setTimeout(async () => {
          await updateOrderStatus(orderId, 'completed');
          alert(`Thanh toán bằng ngân hàng thành công! Tổng tiền: ${totalPrice.toLocaleString()} VND`);
          navigate('/cart');
        }, 15 * 60 * 1000); // 15 phút
      } else if (paymentMethod === 'cash') {
        // Thanh toán bằng tiền mặt, tự động hoàn tất sau 15 phút
        setTimeout(async () => {
          await updateOrderStatus(orderId, 'completed');
          alert(`Thanh toán bằng tiền mặt thành công! Tổng tiền: ${totalPrice.toLocaleString()} VND`);
          navigate('/cart');
        }, 15 * 60 * 1000); // 15 phút

        alert('Đơn hàng đã được ghi nhận. Vui lòng chuẩn bị tiền mặt!');
        navigate('/cart');
      }
    } catch (error) {
      console.error('Lỗi khi thanh toán:', error.message);
      alert('Thanh toán thất bại. Vui lòng thử lại!');
    }
  };

  // Hàm cập nhật trạng thái đơn hàng
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

  if (showQRCode) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Quét mã QR để thanh toán</h2>
        {/* Thay bằng URL thực tế của mã QR từ ngân hàng */}
        <img src="https://via.placeholder.com/200x200?text=QR+Code" alt="QR Code" />
        <p>Vui lòng quét mã QR bằng ứng dụng ngân hàng của bạn.</p>
        <p>Trạng thái sẽ tự động cập nhật sau 15 phút khi thanh toán thành công.</p>
      </div>
    );
  }

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

          <div style={{ marginTop: '20px' }}>
            <h3>Chọn phương thức thanh toán:</h3>
            <label style={{ marginRight: '20px' }}>
              <input
                type="radio"
                value="cash"
                checked={paymentMethod === 'cash'}
                onChange={() => setPaymentMethod('cash')}
              />
              Tiền mặt
            </label>
            <label>
              <input
                type="radio"
                value="bank"
                checked={paymentMethod === 'bank'}
                onChange={() => setPaymentMethod('bank')}
              />
              Ngân hàng (QR Code)
            </label>
          </div>

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