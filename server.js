import express from 'express';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import User from './backend/User.js';
import Product from './backend/product/Product.js';
import Categories from './backend/product/Categories.js';
import jwt from "jsonwebtoken";
import Cart from './backend/Cart/Cart.js';
import Orders from './backend/checkout/Orders.js';


const app = express();
app.use(cors());
app.use(express.json());


app.get('/users', async (req, res) => {
    try {
        console.log('📌 Đang lấy danh sách người dùng...');
        
        const users = await User.findAll({
            attributes: ['id', 'name', 'email', 'role', 'isLocked', 'createdAt', 'updatedAt'],
            where: { role: 'user' } 
        });

        res.json(users);
    } catch (error) {
        console.error('Lỗi khi lấy danh sách người dùng:', error);
        res.status(500).json({ error: 'Lỗi lấy danh sách người dùng', });
    }
});



app.post('/lock-user', async (req, res) => {
    const { email } = req.body;

    try {

        const user = await User.findOne({ where: { email, role: 'user' } });

        if (!user) {
            return res.status(404).json({ error: 'Người dùng không tồn tại hoặc không thể khóa' });
        }

        user.isLocked = true;
        await user.save();

        res.json({ message: 'Tài khoản đã bị khóa', user: { email: user.email, isLocked: user.isLocked } });
    } catch (error) {
        console.error('Lỗi tài khoản:', error);
        res.status(500).json({ error: 'Lỗi khóa tài khoản' });
    }
});




app.post('/register', async (req, res) => {
    const { email, password, role, name } = req.body;

    try {

        const hashedPassword = await bcrypt.hash(password, 10);

        const userRole = role === 'admin' ? 'admin' : 'user';

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role: userRole,
        });

        res.json({ message: 'Đăng ký thành công!', user: newUser });
    } catch (error) {
        console.error('❌ Lỗi đăng ký:', error);
        res.status(500).json({ error: 'Lỗi đăng ký' });
    }
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: "Người dùng không tồn tại" });
        }

        if (user.isLocked) {
            return res.status(403).json({ error: "Tài khoản đã bị khóa, vui lòng liên hệ admin!" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Mật khẩu không đúng" });
        }

        // ✅ Tạo token với thông tin id, name, role
        const token = jwt.sign(
            { id: user.id, name: user.name, role: user.role },
            "secret_key", // 🔹 Thay bằng SECRET_KEY thực tế
            { expiresIn: "2h" } // Token hết hạn sau 2 giờ
        );

        res.json({
            message: "Đăng nhập thành công!",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            token, // Gửi token về client
        });
    } catch (error) {
        console.error("Lỗi đăng nhập:", error);
        res.status(500).json({ error: "Lỗi đăng nhập" });
    }
});


app.get('/categories', async (req, res) => {

    try {
        const categories = await Categories.findAll({
            attributes: ['id', 'name', 'description'], 
            raw: true 
        });

        res.json(categories);
    } catch (error) {
        console.error('Lỗi lấy danh mục:', error);
        res.status(500).json({ error: 'Lỗi lấy danh mục' });
    }
});

app.post('/categories', async (req, res) => {
    try {
        const { name, description } = req.body;
        const existingCategory = await Categories.findOne({ where: { name } }); 
        if (existingCategory) {
            return res.status(400).json({ error: 'Danh mục này đã tồn tại' });
        }

        const newCategory = await Categories.create({ name, description }); 

        res.status(201).json(newCategory);
    } catch (error) {
        console.error('Lỗi thêm danh mục:', error);
        res.status(500).json({ error: 'Lỗi khi thêm danh mục' });
    }
});

app.put('/categories/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        const category = await Categories.findByPk(id); 
        if (!category) {
            return res.status(404).json({ error: 'Danh mục không tìm thấy' });
        }

        const existingCategory = await Categories.findOne({ where: { name } }); 
        if (existingCategory && existingCategory.id !== parseInt(id)) {
            return res.status(400).json({ error: 'Tên danh mục đã tồn tại' });
        }

        category.name = name;
        category.description = description;

        await category.save();

        res.status(200).json(category);
    } catch (error) {
        console.error('Lỗi sửa danh mục:', error);
        res.status(500).json({ error: 'Lỗi khi sửa danh mục' });
    }
});

app.delete('/categories/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const category = await Categories.findByPk(id); 
        if (!category) {
            return res.status(404).json({ error: 'Danh mục không tìm thấy' });
        }

        await category.destroy();

        res.status(200).json({ message: 'Danh mục đã được xóa' });
    } catch (error) {
        console.error('Lỗi xóa danh mục:', error);
        res.status(500).json({ error: 'Lỗi khi xóa danh mục' });
    }
});

app.get('/products', async (req, res) => {
    try {
        const { categoryId } = req.query; // Lấy categoryId từ query string
        let products;

        if (categoryId) {
            products = await Product.findAll({
                where: { category_id: categoryId }, // Lọc theo category_id
                attributes: ['id', 'name', 'price', 'description', 'image_base64'],
                raw: true
            });
            console.log(`Lấy sản phẩm cho danh mục ${categoryId}. Số lượng: ${products.length}`);
        } else {
            products = await Product.findAll({
                attributes: ['id', 'name', 'price', 'description', 'image_base64'],
                raw: true
            });
            console.log(`Lấy tất cả sản phẩm. Số lượng: ${products.length}`);
        }

        res.json(products);
    } catch (error) {
        console.error('Lỗi lấy danh sách sản phẩm:', error.message);
        res.status(500).json({ error: 'Lỗi khi lấy danh sách sản phẩm', details: error.message });
    }
});
app.get('/products/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const product = await Product.findOne({
        where: { id },
        attributes: ['id', 'name', 'price', 'description', 'image_base64'],
        raw: true,
      });
      if (!product) {
        return res.status(404).json({ error: 'Không tìm thấy sản phẩm' });
      }
      res.json(product);
    } catch (error) {
      console.error('Lỗi lấy chi tiết sản phẩm:', error.message);
      res.status(500).json({ error: 'Lỗi khi lấy chi tiết sản phẩm' });
    }
  });
app.post('/products', async (req, res) => {
    console.log('Yêu cầu thêm sản phẩm đã được nhận');
    const { name, description, price, image_base64, category_id } = req.body;
    
    if (!name || !price || !category_id) {
        return res.status(400).json({ error: 'Thiếu thông tin sản phẩm (name, price, category_id là bắt buộc)' });
    }
    
    try {
        const newProduct = await Product.create({ name, description, price, image_base64, category_id });
        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Lỗi thêm sản phẩm:', error.message);
        res.status(500).json({ error: 'Lỗi khi thêm sản phẩm', details: error.message });
    }
});

app.put('/products/:id', async (req, res) => {
    const { name, description, price, image_base64, category_id } = req.body;
    
    if (!name || !price || !category_id) {
        return res.status(400).json({ error: 'Thiếu thông tin cập nhật (name, price, category_id là bắt buộc)' });
    }
    
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Sản phẩm không tồn tại' });
        }
        await product.update({ name, description, price, image_base64, category_id });
        res.json(product);
    } catch (error) {
        console.error('Lỗi cập nhật sản phẩm:', error.message);
        res.status(500).json({ error: 'Lỗi khi cập nhật sản phẩm', details: error.message });
    }
});

app.delete('/products/:id', async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Sản phẩm không tồn tại' });
        }
        await product.destroy();
        res.json({ message: `Sản phẩm ID: ${req.params.id} đã bị xóa` });
    } catch (error) {
        console.error('Lỗi xóa sản phẩm:', error.message);
        res.status(500).json({ error: 'Lỗi khi xóa sản phẩm', details: error.message });
    }
});

app.get('/api/cart/:userId', async (req, res) => {
    try {
      const userId = req.params.userId;
      const cartItems = await Cart.findAll({
        where: { user_id: userId },
        include: ['Product'] // Bao gồm thông tin sản phẩm nếu cần
      });
      
      if (cartItems.length === 0) {
        return res.json({ message: 'Giỏ hàng trống', cart: [] });
      }
      
      res.json(cartItems);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Lỗi khi lấy giỏ hàng' });
    }
  });
  
  // Thêm sản phẩm vào giỏ hàng của user
  app.post('/api/cart/:userId', async (req, res) => {
    try {
      const userId = req.params.userId;
      const { product_id, name, price, ice, sugar, size, quantity } = req.body;
  
      // Kiểm tra các trường bắt buộc
      if (!product_id || !name || !price) {
        return res.status(400).json({
          message: 'Thiếu các trường bắt buộc: product_id, name, hoặc price',
        });
      }
  
      // Chuyển đổi kiểu dữ liệu nếu cần
      const parsedUserId = Number(userId);
      const parsedProductId = Number(product_id);
      const parsedPrice = Number(price);
      const parsedQuantity = quantity ? Number(quantity) : 1;
  
      // Kiểm tra dữ liệu hợp lệ
      if (isNaN(parsedUserId) || isNaN(parsedProductId) || isNaN(parsedPrice)) {
        return res.status(400).json({
          message: 'user_id, product_id, hoặc price phải là số',
        });
      }
  
      if (parsedQuantity < 1) {
        return res.status(400).json({
          message: 'quantity phải lớn hơn hoặc bằng 1',
        });
      }
  
      // Tạo mới cart item
      const newCartItem = await Cart.create({
        user_id: parsedUserId,
        product_id: parsedProductId,
        name,
        price: parsedPrice,
        ice: ice || null, // Cho phép null nếu không có giá trị
        sugar: sugar || null,
        size: size || null,
        quantity: parsedQuantity,
      });
  
      res.status(201).json({
        message: 'Đã thêm vào giỏ hàng',
        item: newCartItem,
      });
    } catch (error) {
      console.error('Lỗi chi tiết:', error.message); // In lỗi chi tiết ra console
      res.status(400).json({
        message: 'Lỗi khi thêm vào giỏ hàng',
        error: error.message, // Trả về thông tin lỗi cụ thể
      });
    }
  });
  // Cập nhật sản phẩm trong giỏ hàng
  app.put('/api/cart/:id', async (req, res) => {
    try {
      const cartItem = await Cart.findByPk(req.params.id);
      
      if (!cartItem) {
        return res.status(404).json({ message: 'Không tìm thấy sản phẩm trong giỏ hàng' });
      }
  
      const {
        product_id,
        name,
        price,
        ice,
        sugar,
        size,
        quantity
      } = req.body;
  
      await cartItem.update({
        product_id: product_id || cartItem.product_id,
        name: name || cartItem.name,
        price: price || cartItem.price,
        ice: ice || cartItem.ice,
        sugar: sugar || cartItem.sugar,
        size: size || cartItem.size,
        quantity: quantity || cartItem.quantity
      });
  
      res.json({
        message: 'Đã cập nhật giỏ hàng',
        item: cartItem
      });
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: 'Lỗi khi cập nhật giỏ hàng' });
    }
  });
  
  // Xóa sản phẩm khỏi giỏ hàng
  app.delete('/api/cart/:id', async (req, res) => {
    try {
      const cartItem = await Cart.findByPk(req.params.id);
      
      if (!cartItem) {
        return res.status(404).json({ message: 'Không tìm thấy sản phẩm trong giỏ hàng' });
      }
  
      await cartItem.destroy();
      res.json({ message: 'Đã xóa sản phẩm khỏi giỏ hàng' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Lỗi khi xóa sản phẩm' });
    }
  });
  
  // Xóa toàn bộ giỏ hàng của user
  app.delete('/api/cart/clear/:userId', async (req, res) => {
    try {
      const userId = req.params.userId;
      await Cart.destroy({
        where: { user_id: userId }
      });
      res.json({ message: 'Đã xóa toàn bộ giỏ hàng' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Lỗi khi xóa giỏ hàng' });
    }
  });

  app.get('checkout/:userId', async (req, res) => {
    const { userId } = req.params;
  
    try {
      const orders = await Orders.findAll({
        where: { user_id: userId },
        order: [['created_at', 'DESC']], // Sắp xếp theo thời gian tạo, mới nhất trước
      });
  
      if (!orders || orders.length === 0) {
        return res.status(404).json({ message: 'Không tìm thấy đơn hàng nào cho người dùng này' });
      }
  
      res.status(200).json(orders);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách đơn hàng:', error);
      res.status(500).json({ message: 'Lỗi server khi lấy danh sách đơn hàng' });
    }
  });
  
  // POST: Tạo đơn hàng từ giỏ hàng (thanh toán)
  app.post('/checkout', async (req, res) => {
    const { userId, selectedItems, totalPrice } = req.body;
  
    if (!userId || !selectedItems || !totalPrice) {
      return res.status(400).json({ message: 'Thiếu thông tin cần thiết: userId, selectedItems, totalPrice' });
    }
  
    try {
      // Tạo các bản ghi trong bảng orders từ selectedItems
      const orderPromises = selectedItems.map(item =>
        Orders.create({
          user_id: userId,
          product_id: item.product_id,
          name: item.name,
          price: item.price,
          ice: item.ice,
          sugar: item.sugar,
          size: item.size,
          quantity: item.quantity,
          total_price: totalPrice,
          status: 'completed', // Giả lập thanh toán thành công
        })
      );
  
      await Promise.all(orderPromises);
  
      // Xóa các sản phẩm đã thanh toán khỏi giỏ hàng
      const productIds = selectedItems.map(item => item.product_id);
      await Cart.destroy({
        where: {
          user_id: userId,
          product_id: productIds,
        },
      });
  
      res.status(201).json({ message: 'Thanh toán thành công' });
    } catch (error) {
      console.error('Lỗi khi tạo đơn hàng:', error);
      res.status(500).json({ message: 'Lỗi server khi tạo đơn hàng' });
    }
  });
  
  // PUT: Cập nhật trạng thái đơn hàng (ví dụ: từ 'pending' sang 'completed')
  app.put('/checkout/:userId', async (req, res) => {
    const { userId } = req.params; // Lấy userId từ params thay vì id
    const { status } = req.body;
  
    // Kiểm tra trạng thái hợp lệ
    if (!status || !['pending', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Trạng thái không hợp lệ. Chỉ chấp nhận: pending, completed, cancelled' });
    }
  
    try {
      // Tìm tất cả đơn hàng của userId
      const orders = await Orders.findAll({
        where: { user_id: userId },
      });
  
      // Nếu không tìm thấy đơn hàng nào
      if (!orders || orders.length === 0) {
        return res.status(404).json({ message: 'Không tìm thấy đơn hàng nào cho người dùng này' });
      }
  
      // Cập nhật trạng thái cho tất cả đơn hàng
      await Orders.update(
        { status }, // Dữ liệu cần cập nhật
        { where: { user_id: userId } } // Điều kiện cập nhật
      );
  
      // Lấy lại danh sách đơn hàng đã cập nhật để trả về (tùy chọn)
      const updatedOrders = await Orders.findAll({
        where: { user_id: userId },
      });
  
      res.status(200).json({
        message: 'Cập nhật trạng thái đơn hàng thành công',
        orders: updatedOrders,
      });
    } catch (error) {
      console.error('Lỗi khi cập nhật đơn hàng:', error);
      res.status(500).json({ message: 'Lỗi server khi cập nhật đơn hàng' });
    }
  });



  
app.listen(3000, () => {
    console.log('✅ chạy r đóa');
});
