import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const Categories = sequelize.define('categories', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,  
        autoIncrement: true,  
        allowNull: false,  
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    description: {
        type: DataTypes.TEXT, 
        allowNull: true,
    }
}, {
    tableName: 'categories',
    timestamps: false, 
});

export default Categories;
