const Sequelize = require("sequelize");
const mySQL = {};
const config = require('../../config.json');
const sequelize = new Sequelize(config.mysql.database, config.mysql.username, config.mysql.password, {
    host: config.mysql.host,
    dialect: 'mysql',
    logging: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    timezone: '+03:00'
});

sequelize
    .authenticate()
    .then(() => {
        console.log(config.mysql.successMessage);
    })
    .catch(error => {
        console.error(config.mysql.errorMessage + error)
    });

mySQL.sequelize = sequelize;
mySQL.Sequelize = Sequelize;

module.exports = mySQL;