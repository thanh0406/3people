// models/Orders.js
import { DataTypes } from 'sequelize';
import sequelize from '../db.js'; 
import Product from '../product/Product.js';
import User from '../User.js';

const Orders = sequelize.define('Orders', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users', 
            key: 'id'
        },
        onDelete: 'CASCADE',
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'products', 
            key: 'id'
        },
        onDelete: 'CASCADE',
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    ice: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    sugar: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    size: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    total_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('pending', 'completed', 'cancelled'),
        allowNull: false,
        defaultValue: 'pending',
    },
}, {
    tableName: 'orders', // Tên bảng trong cơ sở dữ liệu
    timestamps: true,
    createdAt: 'created_at', // Ánh xạ cột created_at trong SQL
    updatedAt: false, // Không sử dụng cột updated_at
});

// Quan hệ
Orders.belongsTo(Product, { foreignKey: 'product_id', onDelete: 'CASCADE' });
Orders.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });

export default Orders;