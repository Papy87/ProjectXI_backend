require('dotenv').config();


module.exports = {

    development: {
        host: process.env.DB_HOST,
        dialect: "postgres",
        port: "5432",
        define: {
            timestamps: false
        },
        dialectOptions: {
            useUTC: false,
            //for reading from database
            // dateStrings: true,
            // typeCast: true
        },
        timezone: '+01:00' //for writing to database
    },

    test: {
        host: process.env.DB_HOST,
        dialect: "postgres",
        port: "5432",
        define: {
            timestamps: false
        },
        // dialectOptions: {
        //     useUTC: false, //for reading from database
        //     dateStrings: true,
        //     typeCast: true
        // },
        // timezone: '+01:00' //for writing to database
    },

    production: {
        database: process.env.DB_NAME,
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        host: process.env.DB_HOST,
        dialect: 'postgres'
    }
};
