import { DataTypes } from 'sequelize';
import sequelize from '../db.js';
import Categories from './Categories.js';

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    image_base64: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'categories',
            key: 'id'
        },
        onDelete: 'CASCADE',
    },
}, {
    tableName: 'products',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

Product.belongsTo(Categories, { foreignKey: 'category_id', onDelete: 'CASCADE' });

export default Product;
