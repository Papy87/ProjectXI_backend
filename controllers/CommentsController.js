const DataBaseModels = require('../models/models');
const jwt=require('jwt-decode');

/////////////////////////////////////////////////////////////////////POST COMMENT////////////////////////////////////////////////////////////////////
module.exports.CreateComment = (req, res) => {
    const token=jwt(req.headers.authorization.slice(7));
    const user_id=token.id;
    const {comment_body, post_id} = req.body;

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
                return res.status(400).json({message:error.toString()})
            }
        )
};
//////////////////////////////////////////////////////////////////////////UPDATE COMMENT/////////////////////////////////////////////////////////////////////////////////////
module.exports.UpdateComment = (req, res) => {
    const {comment_id, comment_body} = req.body;
    DataBaseModels.comments.update({comment_body}, {
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
                return res.status(400).json({message:error.toString()})
            }
        )
};
////////////////////////////////////////////////////////////////////////////////DELETE COMMENT////////////////////////////////////////////////////////////////////////////////
module.exports.DeleteComment = (req, res) => {
    const {comment_id} = req.body;

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
                return res.status(400).json({message:error.toString()})
            }
        )
};
