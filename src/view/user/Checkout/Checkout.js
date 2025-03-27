import { useLocation, useNavigate } from 'react-router-dom';

const Checkout = () => {
  const { state } = useLocation(); // Lấy dữ liệu từ CartUser
  const navigate = useNavigate();
  const { selectedItems, totalPrice } = state || { selectedItems: [], totalPrice: 0 };

  const handleConfirmPayment = async () => {
    try {
      // Giả lập API thanh toán
      alert(`Thanh toán thành công! Tổng tiền: ${totalPrice.toLocaleString()} VND`);

      // Xóa giỏ hàng sau khi thanh toán (có thể gọi API clearCart ở đây)
      const userId = localStorage.getItem('userId');
      if (userId) {
        const response = await fetch(`http://localhost:3000/api/cart/clear/${userId}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
          throw new Error('Lỗi khi xóa giỏ hàng');
        }
      }

      // Quay lại trang giỏ hàng
      navigate('/cart');
    } catch (error) {
      console.error('Lỗi khi thanh toán:', error.message);
      alert('Thanh toán thất bại. Vui lòng thử lại!');
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