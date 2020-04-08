const DataBaseModels = require('../models/models');
//POST metod
module.exports.CreateComment = (req, res) => {
    const {comment_body, post_id, user_id} = req.body;
    DataBaseModels.comments.create({
        comment_body, post_id, user_id
    })
        .then(
            commetnCreated => {
                if (!commetnCreated) {
                    return res.status(400).json({
                        message: 'Comment not created.'
                    })
                }
                res.status(201).json(commetnCreated)
            }
        )
        .catch(
            error => {
                return res.status(400).json(error.toString())
            }
        )
};
//PUT metod
module.exports.UpdateComment = (req, res) => {
    const comment_id = req.params.id;
    DataBaseModels.comments.update(req.body, {
        where: {
            comment_id
        }
    })
        .then(
            updateComment => {
                if (!updateComment) {
                    return res.status(400).json({
                        message: 'Comment not updated.'
                    })

                }
                res.status(201).json(updateComment)
            }
        )
        .catch(
            error => {
                return res.status(400).json(error.toString())
            }
        )
};
//DELETE metod
module.exports.DeleteComment = (req, res) => {
    const comment_id = req.params.id;
    DataBaseModels.comments.destroy( {
        where: {
            comment_id
        }
    })
        .then(
            deletedComment => {
                if (!deletedComment) {
                    return res.status(400).json({
                        message: 'Comment not deleted.'
                    })
                }
                res.status(201).json(deletedComment)
            }
        )
        .catch(
            error => {
                return res.status(400).json(error.toString())
            }
        )
};
