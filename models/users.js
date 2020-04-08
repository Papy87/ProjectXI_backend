
module.exports = function(sequelize, DataTypes) {
    const users = sequelize.define('users', {

        users_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: DataTypes.CHAR,
            allowNull: false,
            unique:true
        },
        password: {
            type: DataTypes.CHAR,
            allowNull: false
        },
        email: {
            type: DataTypes.CHAR,
            allowNull: false
        },
        avatar_url:{
            type:DataTypes.CHAR,
            allowNull:true
        },
        first_name:{
            type:DataTypes.CHAR,
            allowNull:false
        },
        last_name:{
            type:DataTypes.CHAR,
            allowNull:false
        },
        last_name:{
            type:DataTypes.CHAR,
        }

    }, {
        tableName: 'users'
    });
    users.sync()

    return users
};
