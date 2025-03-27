// models/Cart.js
import { DataTypes } from 'sequelize';
import sequelize from '../db.js';
import Product from '../product/Product.js';
import User from '../User.js'; // Đảm bảo đường dẫn đúng

const Cart = sequelize.define('Cart', {
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
}, {
    tableName: 'cart',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
});

// Quan hệ
Cart.belongsTo(Product, { foreignKey: 'product_id', onDelete: 'CASCADE' });
Cart.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });

export default Cart;