
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
            allowNull: false,
            unique: true
        },
        avatar_url:{
            type:DataTypes.CHAR,
            allowNull:true
        },
        cover_url:{
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
        },
        date_of_birth:{
            type:DataTypes.DATE
        },
        reset_id:{
            type:DataTypes.CHAR,
            allowNull:true
        },
        confirmed: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },

    }, {
        tableName: 'users'
    });
    users.sync()

    return users
};
