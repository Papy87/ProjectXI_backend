const models=require('./models')
module.exports = function(sequelize, DataTypes) {
    const comments = sequelize.define('comments', {

        comment_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        comment_body: {
            type: DataTypes.CHAR,
            allowNull: false
        },
        created_at:{
            type:"TIMESTAMP",
            defaultValue:sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull:false
        },
        post_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references:{
                model:'posts',
                key:'post_id'
            }
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references:{
                model:'users',
                key:'user_id'
            }
        }
    }, {
        tableName: 'comments'
    });
    comments.associate=function (models) {
        comments.belongsTo(models.posts, {foreignKey:'post_id', targetKey:'post_id'})
        
    }
    comments.sync()
    return comments
};
