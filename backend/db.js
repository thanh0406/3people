import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('myapp', 'root', 'thanh02594', {
    host: 'localhost',
    dialect: 'mysql',
});



export default sequelize;
