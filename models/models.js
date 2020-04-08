const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const configJson = require('../configuration/configuration');
const dotenv = require('dotenv');

dotenv.config();

const basename = path.basename(__filename);
const env = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';

const config = configJson[env];




const dataBase = {};

let sequelize;
if (config.environment === 'production') {
    sequelize = new Sequelize(
        process.env[config.use_env_variable], config
    );
    sequelize = new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASS, {
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            dialect: 'postgres',
            dialectOption: {
                ssl: true,
                native: true
            },
            logging: true
        }
    );
} else {
    sequelize = new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USERNAME,
        process.env.DB_PASSWORD, config
    );
}

fs
    .readdirSync(__dirname)
    .filter((file) => {
        return (file.indexOf('.') !== 0) &&
            (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach((file) => {
        const model = sequelize.import(path.join(__dirname, file));
        dataBase[model.name] = model;
    });

Object.keys(dataBase).forEach((modelName) => {

    if (dataBase[modelName].associate) {

        dataBase[modelName].associate(dataBase);
    }
});


dataBase.sequelize = sequelize;
dataBase.Sequelize = Sequelize;
module.exports =dataBase;
