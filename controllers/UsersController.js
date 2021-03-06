const DataBaseModels = require('../models/models');
const passwordValidator = require('password-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtDecoder = require('jwt-decode');
const uuidv5 = require('uuid/v1');
const _ = require('lodash');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const {sendResetLink, emailConfirmationLink} = require('../auth/forgote_mail_auth');


/////////////////////////////////////////////////////////////////////////////PRIVATE FUNCTIONS////////////////////////////////////////////////////////////////////////////////////////////
const PasswordCheck = (password) => {
    const schema = new passwordValidator();
    schema.is().min(8);
    schema.is().max(100);
    schema.has().uppercase();
    schema.has().lowercase();
    schema.has().digits();
    //schema.has().symbols()
    if (!password) {
        return false
    }
    const validate = schema.validate(password);

    if (!validate) {
        return false
    }
    return true
};
const TokenDecoder = (token) => {
    const decodedToken = jwtDecoder(token);
    return decodedToken.id
}
//////////////////////////////////////////////////////////////////////////GET USER PROFILE//////////////////////////////////////////////////////////////////////////////

module.exports.GetUserProfile = (req, res) => {
    const token = req.headers.authorization.slice(6);
    const users_id = TokenDecoder(token);
    DataBaseModels.users.findOne({
        where: {
            users_id
        }
    })
        .then(searchResult => {
            if (!searchResult) {
                return res.status(404).json({
                    message: 'User not found.'
                })
            }
            res.status(200).json(searchResult)
        })
        .catch(
            error => {
                return res.status(400).json(error.toString())
            }
        )
};

///////////////////////////////////////////////////////////////////////////////////////GET SINGLE USER BY ID//////////////////////////////////////////////////////////////////////////
module.exports.GetUserById = (req, res) => {

    const users_id = req.params.id;
    DataBaseModels.users.findOne({
        where: {
            users_id
        }
    })
        .then(searchResult => {
            if (!searchResult) {
                return res.status(404).json({
                    message: 'User not found.'
                })
            }
            res.status(200).json(searchResult)
        })
        .catch(
            error => {
                return res.status(400).json(error.toString())
            }
        )

}

//////////////////////////////////////////////////////////////////////////////////////GET ALL USERS//////////////////////////////////////////////////////////////////////////////
module.exports.GetAllUsers = (req, res) => {
    let where = {};
    if (req.query.search) {
        let tokens = req.query.search.split(' ')
        let searchTokensArray = []
        tokens.forEach((token) => {
            let tokenObject = {

                [Op.iLike]: '%' + token.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/Đ/g, "D").replace(/đ/g, "d") + '%'
            }
            searchTokensArray.push(tokenObject)
        });

        where = {
            [Op.or]: [
                {
                    first_name: Sequelize.where(Sequelize.fn('unaccent', Sequelize.col('first_name')), {[Op.and]: [...searchTokensArray]})
                },
                {
                    last_name: Sequelize.where(Sequelize.fn('unaccent', Sequelize.col('last_name')), {[Op.and]: [...searchTokensArray]})
                },
                {
                    username: Sequelize.where(Sequelize.fn('unaccent', Sequelize.col('username')), {[Op.and]: [...searchTokensArray]})
                }
            ]
        }
    }
    DataBaseModels.users.findAndCountAll({where})
        .then(searchResult => {
            if (!searchResult) {
                return res.status(404).json({
                    message: 'Users not found.'
                })
            }
            res.status(200).json(searchResult)
        })
        .catch(
            error => {
                return res.status(400).json(error.toString())
            }
        )
}



////////////////////////////////////////////////////////////////////////CREATE USER//////////////////////////////////////////////////////////////////////////////////
module.exports.CreateUser = (req, res) => {
    const {email, password, first_name, last_name, username, date_of_birth} = req.body;
    const validate = PasswordCheck(password);
    if (!validate) {
        return res.status(400).json({
            message: "Password don't fulfills rules."
        })
    }
    DataBaseModels.users.findOne({
        where: {
            username
        }
    })
        .then(
            user => {
                if (user) {
                    return res.status(400).json({
                        message: "Username must be unique, please chouse another name."
                    })
                }
                bcrypt.hash(password, 10)
                    .then(hash => {
                        DataBaseModels.users.create({
                            email,
                            username,
                            password: hash,
                            first_name,
                            last_name,
                            date_of_birth
                        })
                            .then(createdUser => {
                                if (!createdUser) {
                                    return res.status(400).json({
                                        message: 'User not created.'
                                    })
                                }


                                emailConfirmationLink(email,)
                                // res.status(201).json(createdUser)
                            })

                    })
            })
        .catch(error => {
            return res.status(400).json(error.toString())
        })
};


//////////////////////////////////////////////////////////////////LOGIN USER WITHOUT CONFIRMED////////////////////////////////////////////////////////////////////////////
module.exports.LoginUser = (req, res) => {
    const {username, password} = req.body;

    DataBaseModels.users.findOne({
        where: {
            username,
        }
    }).then(
        user => {
            if (!user) {
                return res.status(404).json({
                    message: 'Korisnik ne postoji ili nije aktivan.'
                })
            }
            bcrypt.compare(password, user.password)
                .then(result => {
                    if (!result) {
                        return res.status(404).json({
                            message: 'Proverite svoju šifru'
                        })
                    }
                    let jwtBearerToken = jwt.sign({
                        id: user.users_id,
                        username: user.username,
                        first_name: user.first_name,
                        last_name: user.last_name
                    }, process.env.DB_SECRET, {expiresIn: '24h'})

                    return res.status(200).json({
                        message: 'Login Succsess',
                        token: jwtBearerToken
                    })
                })
                .catch(
                    e => {
                        res.status(400).json({
                            message: e.toString()
                        })
                    })
        })
        .catch(
            e => {
                res.status(400).json({
                    message: e.toString()
                })
            })
};



//////////////////////////////////////////////////////////////////UPDATE USER WITH MULTER//////////////////////////////////////////////////////////////////////////////////
module.exports.UpdateUser = async (req, res) => {
    let update = req.body;
    const token = req.headers.authorization.slice(6);
    const users_id = TokenDecoder(token);
    const files = req.files;
    let avatar_url = null;
    let cover_url = null


    if (update.password !== undefined) {
        const validate = PasswordCheck(update.password);
        if (!validate) {
            return res.status(400).json({
                message: "Password don't fulfills rules."
            })
        }
        update.password = await bcrypt.hash(update.password, 10)
    }

    if (files.avatar_url !== undefined) {
        avatar_url = 'http://localhost:3000/' + files.avatar_url[0].path;
        update = {...update, avatar_url}
    }
    if (files.cover_url !== undefined) {
        cover_url = 'http://localhost:3000/' + files.cover_url[0].path;
        update = {...update, cover_url}
    }


    DataBaseModels.users.update(update, {
        where: {
            users_id
        }
    })
        .then(
            userUpdated => {
                if (!userUpdated) {
                    return res.status(400).json({
                        message: 'User not updated'
                    })
                }
                return res.status(200).json(userUpdated)
            }
        )
        .catch(
            error => {
                return res.status(400).json(error.toString())
            }
        )
};
////////////////////////////////////////////////////////////FORGOT PASSWORD EMAIL//////////////////////////////////////////////////////////////////////////
module.exports.ForgotPassword = (req, res) => {

    const email = req.body.email;
    const reset_id = uuidv5();
    DataBaseModels.users.findOne({
        where: {email}
    })
        .then(
            searchResult => {
                if (!searchResult) {
                    return res.status(200).json({message: `There is not user with this ${email}.`})
                }

                DataBaseModels.users.update({reset_id}, {
                    where: {
                        email
                    },
                })
                    .then(dataUpdated => {
                            if (!dataUpdated) {
                                return res.status(404).json()
                            }
                            sendResetLink(email, reset_id, res)
                        }
                    )
                    .catch(error => {
                        return res.status(400).json({message: error.toString()})
                    })
            }
        )
        .catch(error => {
            return res.status(400).json({message: error.toString()})
        })
}
//////////////////////////////////////////////////////////////////////////////////RESET PASWORD////////////////////////////////////////////////////////////////////////////////////
module.exports.ResetPassword = (req, res) => {
    let reset_id = req.params.id;
    const {password} = req.body;
    const validPassword = PasswordCheck(password);
    if (!validPassword) {
        return res.status(400).json({
            message: "Password don't fulfills rules."
        })
    }
    bcrypt.hash(password, 10)
        .then(hashedPassword => {
            DataBaseModels.users.update({
                password: hashedPassword,
                reset_id: null
            }, {
                where: {
                    reset_id
                }
            })
                .then(
                    userUpdated => {
                        if (userUpdated[0] === 0) {
                            return res.status(400).json({
                                message: 'User not updated'
                            })
                        }
                        return res.status(200).json(userUpdated)
                    }
                )
        })
        .catch(
            error => {
                return res.status(400).json(error.toString())
            })

}
////////////////////////////////////////////////////////////////// EMAIL CONFIRMATION//////////////////////////////////////////////////////////////////////
module.exports.EmailConfirmation = (req, res) => {
    const {id} = jwtDecoder(req.params.token);
    const update = {
        confirmed: true
    }
    DataBaseModels.users.update(update, {where: {users_id: id}})
        .then(
            userUpdated => {
                if (userUpdated[0] === 0) {
                    return res.status(400).json({
                        message: 'User not updated'
                    })
                }
                return res.status(200).json({message: 'Email confirmed'})
            }
        )
        .catch(error => {
            return res.status(400).json(error.toString())
        })

}

/////////////////////////////////////////////////////////LOGIN USERS WITH CONFIRMED////////////////////////////////////////////////////////////////////////////////////////////////
// module.exports.LoginUser = (req, res) => {
//     const {username, password} = req.body;
//
//     DataBaseModels.users.findOne({
//         where: {
//             username,
//         }
//     }).then(
//         user => {
//             console.log(user)
//             if (!user) {
//                 return res.status(404).json({
//                     message: 'Korisnik ne postoji ili nije aktivan.'
//                 })
//             }
//             if (!user.confirmed) {
//                 return res.status(406).json({message: 'Please confirm your email.'})
//             }
//             bcrypt.compare(password, user.password)
//                 .then(result => {
//                     if (!result) {
//                         return res.status(404).json({
//                             message: 'Proverite svoju šifru'
//                         })
//                     }
//                     let jwtBearerToken = jwt.sign({
//                         id: user.users_id,
//                         username: user.username,
//                         first_name: user.first_name,
//                         last_name: user.last_name
//                     }, process.env.DB_SECRET, {expiresIn: '24h'})
//
//                     return res.status(200).json({
//                         message: 'Login Succsess',
//                         token: jwtBearerToken
//                     })
//                 })
//                 .catch(
//                     e => {
//                         res.status(400).json({
//                             message: e.toString()
//                         })
//                     })
//         })
//         .catch(
//             e => {
//                 res.status(400).json({
//                     message: e.toString()
//                 })
//             })
// };


///////////////////////////////////////////////////////////////////UPDATE USER WITHOUT MULTER/////////////////////////////////////////////////////////////////////////////

// module.exports.UpdateUser = (req, res) => {
//     const update = req.body;
//     const token = req.headers.authorization.slice(6);
//     const users_id = TokenDecoder(token);
//     DataBaseModels.users.update(update, {
//         where: {
//             users_id
//         }
//     })
//         .then(
//             userUpdated => {
//                 if (!userUpdated) {
//                     return res.status(400).json({
//                         message: 'User not updated'
//                     })
//                 }
//                 return res.status(200).json(userUpdated)
//             }
//         )
//         .catch(
//             error => {
//                 return res.status(400).json(error.toString())
//             }
//         )
// };


//////////////////////////////////////////////////////////CREATE USER WITH CONFORMATION EMAIL LINK///////////////////////////////////////////////////////////
//
// module.exports.CreateUser = async (req, res) => {
//     const {email, password, first_name, last_name, username, date_of_birth} = req.body;
//     const validate = PasswordCheck(password);
//     if (!validate) {
//         return res.status(400).json({
//             message: "Password don't fulfills rules."
//         })
//     }
//     const user = await DataBaseModels.users.findOne({
//         where: {
//             username
//         }
//     })
//     if (user) {
//         return res.status(400).json({
//             message: "Username must be unique, please chouse another name."
//         })
//     }
//     const hashedPassword = await bcrypt.hash(password, 12);
//     const userCreated = await DataBaseModels.users.create({
//         email,
//         username,
//         password: hashedPassword,
//         first_name,
//         last_name,
//         date_of_birth
//     })
//     if (!userCreated) {
//         return res.status(400).json({
//             message: 'User not created.'
//         })
//     }
//
//     emailConfirmationLink(email, userCreated, res)
// }
