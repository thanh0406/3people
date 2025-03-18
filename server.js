import express from 'express';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import User from './backend/User.js';
import Product from './backend/product/Product.js';
import Categories from './backend/product/Categories.js';
import jwt from "jsonwebtoken";



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
        const products = await Product.findAll(); 
        console.log(`Danh sách sản phẩm lấy thành công. Số lượng: ${products.length}`);
        res.json(products);
    } catch (error) {
        console.error('Lỗi lấy danh sách sản phẩm:', error.message);
        res.status(500).json({ error: 'Lỗi khi lấy danh sách sản phẩm', details: error.message });
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




app.listen(3000, () => {
    console.log('✅ chạy r đóa');
});
