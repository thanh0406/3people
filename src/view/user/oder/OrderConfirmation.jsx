// OrderConfirmation.jsx
import { useLocation, useNavigate } from 'react-router-dom';

const OrderConfirmation = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { orderId, selectedItems, totalPrice, status } = state || {};

  if (!state) {
    return <div>Không có thông tin đơn hàng</div>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Xác nhận đơn hàng</h2>
      <div style={{ marginBottom: '20px' }}>
        <p>Mã đơn hàng: {orderId}</p>
        <p>Trạng thái: {status === 'pending' ? 'Đang xử lý' : 'Hoàn tất'}</p>
        <p>Tổng tiền: {totalPrice.toLocaleString()} VND</p>
        <p>Phương thức thanh toán: Tiền mặt</p>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
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

      <div style={{ textAlign: 'center' }}>
        <div style={{ marginBottom: '20px' }}>
          {/* Icon shipper - bạn có thể thay bằng icon thực tế từ thư viện như react-icons */}
          <span style={{ fontSize: '40px' }}>🏍️</span>
          <p>Shipper sẽ giao hàng đến bạn trong thời gian sớm nhất!</p>
          <p>Vui lòng chuẩn bị tiền mặt để thanh toán khi nhận hàng.</p>
        </div>
        
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'blue',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Về trang chủ
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmation;