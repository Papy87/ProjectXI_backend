const DataBaseModels = require('../models/models');

//GET metode
module.exports.GetAllPosts = (req, res) => {
    DataBaseModels.posts.findAndCountAll()
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

module.exports.GetSinglePostByID = (req, res) => {
    const post_id = req.params.id;
    DataBaseModels.posts.findOne({
        where: {
            post_id
        }
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

module.exports.GetAllPostComments=(req,res)=>{
    const post_id=req.params.id;
    DataBaseModels.posts.findOne({
        where:{
            post_id
        },
        include:[
            {model:DataBaseModels.comments}
        ]
    })
        .then(
            searchResult=>{
                if(!searchResult){
                    return res.status(400).json({
                        message:'No results.'
                    })
                }
                res.status(200).json(searchResult)
            }
        )
        .catch(error => {
            return res.status(400).json(error.toString())
        })
};

//PUT metode
module.exports.UpdatePostByID = (req, res) => {
    const post_id = req.params.id;
    DataBaseModels.posts.update(req.body, {
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
};

//DELETE metode
module.exports.DeletePostByID = (req, res) => {
    const post_id = req.params.id;
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
};
//POST metode
module.exports.CreatePost = (req, res) => {
    const {type, user_id, text, image_url, video_url} = req.body;
    DataBaseModels.posts.create({
        type,user_id,text,image_url,video_url
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



