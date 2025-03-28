import { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const OrderAdmin = () => {
    const [orders, setOrders] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterDate, setFilterDate] = useState('');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await axios.get('http://localhost:3000/checkout');
            // API trả về: { success: true, data: orders }
            setOrders(Array.isArray(res.data.data) ? res.data.data : []);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setOrders([]);
        }
    };

    // Hàm cập nhật trạng thái đơn hàng thành "cancelled" với xác nhận
    const handleCancelOrder = async (id) => {
        const confirmCancel = window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này?');
        if (!confirmCancel) return;
        
        try {
            await axios.put(`http://localhost:3000/orders/${id}/cancel`);
            fetchOrders();
        } catch (error) {
            console.error('Error cancelling order:', error);
        }
    };

    // Hàm xóa đơn hàng với xác nhận
    const handleDeleteOrder = async (id) => {
        const confirmDelete = window.confirm('Bạn có chắc chắn muốn xóa đơn hàng này?');
        if (!confirmDelete) return;

        try {
            await axios.delete(`http://localhost:3000/orders/${id}`);
            fetchOrders();
        } catch (error) {
            console.error('Error deleting order:', error);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed':
                return <span title="Thành công" style={{ color: 'green' }}>✔️</span>;
            case 'pending':
                return <span title="Đang chờ xử lý" style={{ color: 'orange' }}>⌛</span>;
            case 'cancelled':
                return <span title="Đã hủy" style={{ color: 'red' }}>❌</span>;
            default:
                return status;
        }
    };

    const filteredOrders = orders.filter(order => {
        let matchesSearch = true;
        let matchesDate = true;
        if (searchQuery) {
            const searchLower = searchQuery.toLowerCase();
            matchesSearch = (order.User && order.User.name && order.User.name.toLowerCase().includes(searchLower)) ||
                            (order.name && order.name.toLowerCase().includes(searchLower));
        }
        if (filterDate) {
            const orderDate = new Date(order.created_at).toISOString().split('T')[0];
            matchesDate = orderDate === filterDate;
        }
        return matchesSearch && matchesDate;
    });

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">Quản lý Đơn hàng (Admin)</h2>

            <div className="mb-4 d-flex flex-column flex-md-row align-items-start gap-2">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Tìm kiếm theo tên đơn hàng..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <input
                    type="date"
                    className="form-control"
                    placeholder="Chọn ngày"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                />
            </div>

            <table className="table table-bordered table-striped">
                <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Người mua</th>
                        <th>Product ID</th>
                        <th>Tên sản phẩm</th>
                        <th>Giá</th>
                        <th>Số lượng</th>
                        <th>Tổng tiền</th>
                        <th>Trạng thái</th>
                        <th>Ngày tạo</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredOrders.map((order) => (
                        <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.User ? order.User.name : order.user_id}</td>
                            <td>{order.product_id}</td>
                            <td>{order.name}</td>
                            <td>{order.price}</td>
                            <td>{order.quantity}</td>
                            <td>{order.total_price}</td>
                            <td>{getStatusIcon(order.status)}</td>
                            <td>{new Date(order.created_at).toLocaleString()}</td>
                            <td>
                                {order.status !== 'cancelled' ? (
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => handleCancelOrder(order.id)}
                                    >
                                        🗑️ Hủy đơn hàng
                                    </button>
                                ) : (
                                    <button
                                        className="btn btn-secondary"
                                        onClick={() => handleDeleteOrder(order.id)}
                                    >
                                        🗑️ Xóa đơn hàng
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}    
                </tbody>
            </table>
        </div>
    );
};

export default OrderAdmin;
