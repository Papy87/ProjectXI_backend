module.exports = function (sequelize, DataTypes) {
    const posts = sequelize.define('posts', {

        post_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        text: {
            type: DataTypes.CHAR,
            allowNull: true
        },
       image_url: {
            type: DataTypes.CHAR,
            allowNull: true
        },
        video_url: {
            type: DataTypes.CHAR,
            allowNull: true
        },
        type: {
            type: DataTypes.CHAR,
            allowNull: false
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'user_id'
            }
        }
    }, {
        tableName: 'posts'
    });
    posts.associate=function (models) {
        posts.hasMany(models.comments, {foreignKey:'post_id', targetKey:'post_id'})

    }
    posts.sync()

    return posts
};
