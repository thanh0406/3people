import sequelize from "../db.js";
import Product from "./Product.js";
import Categories from "./Categories.js";

Categories.hasMany(Product, { foreignKey: 'category_id', onDelete: 'CASCADE' });
Product.belongsTo(Categories, { foreignKey: 'category_id', onDelete: 'CASCADE' });

export { sequelize, Categories, Product };
