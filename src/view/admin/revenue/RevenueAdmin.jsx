import { useEffect, useState } from "react";
import axios from "axios";

const RevenueAdmin = () => {
  const [checkout, setCheckout] = useState([]);
  const [dailyRevenue, setDailyRevenue] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [bestSellerDaily, setBestSellerDaily] = useState(null);
  const [bestSellerMonthly, setBestSellerMonthly] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]); // Ngày mặc định là hôm nay
  const [selectedDateRevenue, setSelectedDateRevenue] = useState(0);
  const [selectedDateBestSeller, setSelectedDateBestSeller] = useState(null);

  useEffect(() => {
    fetchCheckout();
  }, [selectedDate]); // Khi ngày thay đổi, tự động cập nhật doanh thu

  const fetchCheckout = async () => {
    try {
      const res = await axios.get("http://localhost:3000/checkout");
      const orders = Array.isArray(res.data.data) ? res.data.data : [];
      setCheckout(orders);
      calculateRevenue(orders);
      findBestSellers(orders);
      calculateSelectedDateRevenue(orders); // Cập nhật doanh thu theo ngày đã chọn
    } catch (error) {
      console.error("Lỗi khi lấy đơn hàng:", error);
      setCheckout([]);
    }
  };

  const calculateRevenue = (orders) => {
    const today = new Date().toISOString().split("T")[0];
    const currentMonth = new Date().getMonth() + 1;

    let dailyTotal = 0;
    let monthlyTotal = 0;

    orders.forEach((order) => {
      const orderDate = new Date(order.created_at);
      const orderDateString = orderDate.toISOString().split("T")[0];
      const orderMonth = orderDate.getMonth() + 1;

      if (orderDateString === today) {
        dailyTotal += parseFloat(order.total_price);
      }
      if (orderMonth === currentMonth) {
        monthlyTotal += parseFloat(order.total_price);
      }
    });

    setDailyRevenue(dailyTotal);
    setMonthlyRevenue(monthlyTotal);
  };

  const findBestSellers = (orders) => {
    const today = new Date().toISOString().split("T")[0];
    const currentMonth = new Date().getMonth() + 1;

    let dailyProducts = {};
    let monthlyProducts = {};

    orders.forEach((order) => {
      const orderDate = new Date(order.created_at);
      const orderDateString = orderDate.toISOString().split("T")[0];
      const orderMonth = orderDate.getMonth() + 1;

      if (!dailyProducts[order.name]) dailyProducts[order.name] = 0;
      if (!monthlyProducts[order.name]) monthlyProducts[order.name] = 0;

      if (orderDateString === today) {
        dailyProducts[order.name] += order.quantity;
      }
      if (orderMonth === currentMonth) {
        monthlyProducts[order.name] += order.quantity;
      }
    });

    const topDaily = Object.entries(dailyProducts).sort((a, b) => b[1] - a[1])[0];
    const topMonthly = Object.entries(monthlyProducts).sort((a, b) => b[1] - a[1])[0];

    setBestSellerDaily(topDaily ? topDaily[0] : "Không có");
    setBestSellerMonthly(topMonthly ? topMonthly[0] : "Không có");
  };

  const calculateSelectedDateRevenue = (orders) => {
    let dateTotal = 0;
    let productsCount = {};

    orders.forEach((order) => {
      const orderDate = new Date(order.created_at).toISOString().split("T")[0];

      if (orderDate === selectedDate) {
        dateTotal += parseFloat(order.total_price);

        if (!productsCount[order.name]) {
          productsCount[order.name] = 0;
        }
        productsCount[order.name] += order.quantity;
      }
    });

    const topProduct = Object.entries(productsCount).sort((a, b) => b[1] - a[1])[0];

    setSelectedDateRevenue(dateTotal);
    setSelectedDateBestSeller(topProduct ? topProduct[0] : "Không có");
  };

  return (
    <div>
      <h2>Thống kê doanh thu</h2>
      <p>
        <strong>Doanh thu hôm nay:</strong> {dailyRevenue.toLocaleString()} VNĐ
      </p>
      <p>
        <strong>Doanh thu tháng này:</strong> {monthlyRevenue.toLocaleString()} VNĐ
      </p>

      <h2>Sản phẩm bán chạy</h2>
      <p>
        <strong>Hôm nay:</strong> {bestSellerDaily}
      </p>
      <p>
        <strong>Trong tháng:</strong> {bestSellerMonthly}
      </p>

      {/* Ô chọn ngày */}
      <h2>Xem doanh thu theo ngày</h2>
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
      />

      {/* Hiển thị doanh thu theo ngày được chọn */}
      <h2>Thống kê doanh thu ngày {selectedDate}</h2>
      <p><strong>Doanh thu:</strong> {selectedDateRevenue.toLocaleString()} VNĐ</p>
      <p><strong>Sản phẩm bán chạy:</strong> {selectedDateBestSeller}</p>
    </div>
  );
};

export default RevenueAdmin;
