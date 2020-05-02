const DataBaseModels = require('../models/models');
const jwtDecoder = require('jwt-decode');
const fs = require('fs');

////////////////////////////////////////////////////////////////////PRIVATE FUNCTION////////////////////////////////////////////////////////////////////////
const TokenDecoder = (token) => {
    const decodedToken = jwtDecoder(token);
    return decodedToken.id
}

///////////////////////////////////////////////////////////////////GET ALL POSTS///////////////////////////////////////////////////////////////////////////////////////
module.exports.GetAllPosts = (req, res) => {
    let offset = 0;
    let limit = 5;
    let where = {};
    if (req.query.page !== undefined && req.query.pageSize !== undefined) {
        offset = parseInt(req.query.page) * parseInt(req.query.pageSize);
        limit = parseInt(req.query.pageSize);
    }
    if (req.query.type !== undefined) {
        where = {
            type: req.query.type
        }
    }

    DataBaseModels.posts.findAndCountAll({
        where,
        include: [
            {model: DataBaseModels.comments}
        ],
        offset,
        limit
    })
        .then(
            searchResult => {
                if (!searchResult.rows.length) {
                    return res.status(404).json({
                        message: 'No Result.'
                    })
                }
                return res.status(200).json(searchResult)
            }
        ).catch(
        error => {
            return res.status(400).json(error.toString())
        }
    )
};
///////////////////////////////////////////////////////////////////GET SINGLE POST/////////////////////////////////////////////////////////////////////////////////////////
module.exports.GetSinglePostByID = (req, res) => {
    const post_id = req.params.id;
    DataBaseModels.posts.findOne({
        where: {
            post_id
        },
        include: [
            {model: DataBaseModels.comments}
        ]
    }).then(
        searchResult => {
            if (!searchResult) {
                return res.status(404).json({
                    message: 'No Result.'
                })
            }
            return res.status(200).json(searchResult)
        }
    )
        .catch(error => {
            return res.status(400).json(error.toString())
        })
};

//////////////////////////////////////////////////////////////////CREATE POST//////////////////////////////////////////////////////////////////////////////////////////////////////
module.exports.CreatePost = (req, res) => {
    const token = req.headers.authorization.slice(6);
    const user_id = TokenDecoder(token);
    let type = 'text';
    const {text} = req.body;
    let video_url = null;
    let images = [];
    let image_url = null;
    if (req.files.image_url !== undefined) {
        req.files.image_url.forEach(el => {
            images.push('' + el.path)
        })
        type = 'image'
    }
    if (req.files.video_url !== undefined) {
        video_url = '' + req.files.video_url[0].path;
        type = 'video'
    }
    image_url = images.toString()
    DataBaseModels.posts.create({
        type, user_id, text, image_url, video_url
    })
        .then(
            createResutl => {

                if (!createResutl) {
                    return res.status(404).json({
                        message: 'Post not created.'
                    })
                }
                return res.status(200).json(createResutl)
            }
        )
        .catch(error => {
            return res.status(400).json(error.toString())
        })
};


//////////////////////////////////////////////////////////////////UPDATE POST/////////////////////////////////////////////////////////////////////////////////
module.exports.UpdatePostByID = (req, res) => {
    const post_id = req.params.id;
    const update = req.body;
    let images = [];
    update.type = 'text';

    DataBaseModels.posts.findOne({
        where: {
            post_id
        }
    }).then(
        searchResult => {
            let videoFile = searchResult.dataValues.video_url;
            let imageFiles = searchResult.dataValues.image_url;
            if (req.files.video_url !== undefined) {
                if (videoFile !== null) {
                    fs.unlinkSync(videoFile);
                }
                update.video_url = '' + req.files.video_url[0].path;
                update.type = 'video';
            }
            if (req.files.image_url !== undefined) {
                if (imageFiles !== '') {
                    let imageArray = imageFiles.split(',');
                    imageArray.forEach(el => {
                        fs.unlinkSync(el)
                    });
                }
                req.files.image_url.forEach(el => {
                    images.push('' + el.path)
                });
                update.type = 'image'
            }
            update.image_url = images.toString();

            DataBaseModels.posts.update(update, {
                where: {
                    post_id
                }
            })
                .then(
                    updateResult => {

                        if (!updateResult) {
                            return res.status(404).json({
                                message: 'No Update.'
                            })
                        }
                        return res.status(200).json(updateResult)
                    }
                )
                .catch(error => {
                    return res.status(400).json(error.toString())
                })
        }
    ).catch(error => {
        console.log(error)
        return res.status(400).json(error.toString())
    })

};
//////////////////////////////////////////////////////////////LIKE AND DISLIKE/////////////////////////////////////////////////////////////////////////////////////////
module.exports.LikeAndDislike = (req, res) => {
    const {status, post_id} = req.body;
d;

    DataBaseModels.posts.findOne({
        where: {
            post_id
        }
    }).then(
        searchData => {
            if (!searchData) {
                return res.status(400).json({message: `No post wiht id ${post_id}`})
            }
            let like_count;
            if (status) {
                like_count = parseInt(searchData.dataValues.like_count + 1);
            } else if (!status) {
                like_count = parseInt(searchData.dataValues.like_count - 1);
            }
            DataBaseModels.posts.update({like_count},
                {
                    where: {
                        post_id
                    }
                }
            )
                .then(postUpdated => {
                        if (!postUpdated) {
                            return res.status(404).json({
                                message: 'Something went wrong.'
                            })
                        }
                        return res.status(200).json({
                            message: postUpdated
                        })
                    }
                )
                .catch(error => {
                    return res.status(400).json({message: error.toString()})
                })
        }
    ).catch(error => {
        return res.status(401).json(error.toString())
    })
}

/////////////////////////////////////////////////////////////////////////////DELETE POST///////////////////////////////////////////////////////////////////////////////
module.exports.DeletePostByID = (req, res) => {
    const {post_id} = req.body;

    DataBaseModels.comments.findAll({
        where: {
            post_id
        }
    })
        .then(
            srcComm => {
                if (!srcComm.length) {
                    DataBaseModels.posts.destroy({
                        where: {
                            post_id
                        }
                    })
                        .then(
                            deleteResult => {
                                if (!deleteResult) {
                                    return res.status(404).json({
                                        message: 'No Delete.'
                                    })
                                }
                                return res.status(200).json(deleteResult)
                            }
                        )
                        .catch(error => {
                            return res.status(400).json(error.toString())
                        })

                }
                DataBaseModels.comments.destroy({
                    where: {
                        post_id
                    }
                }).then(
                    destroyedPost => {
                        if (!destroyedPost) {
                            return res.status(404).json({
                                message: 'Comment not found.'
                            })
                        }
                        DataBaseModels.posts.destroy({
                            where: {
                                post_id
                            }
                        })
                            .then(
                                deleteResult => {

                                    if (!deleteResult) {
                                        return res.status(404).json({
                                            message: 'No Delete.'
                                        })
                                    }
                                    return res.status(200).json(deleteResult)
                                }
                            )
                            .catch(error => {
                                return res.status(400).json(error.toString())
                            })
                    }
                )
                    .catch(error => {
                        return res.status(400).json(error.toString())
                    })
            }
        )
        .catch(error => {
            return res.status(400).json(error.toString())
        })
};



