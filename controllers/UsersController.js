const DataBaseModels = require('../models/models');
const passwordValidator = require('password-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtDecoder = require('jwt-decode');

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
//CREATE USER
module.exports.CreateUser = (req, res) => {
    console.log('USAO')
    const {email, password, first_name, last_name, username} = req.body;
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
                            last_name
                        })
                            .then(createdUser => {
                                if (!createdUser) {
                                    return res.status(400).json({
                                        message: 'User not created.'
                                    })
                                }

                                res.status(201).json(createdUser)
                            })

                    })
            })
        .catch(error => {
            return res.status(400).json(error.toString())
        })
};
//LOGIN USERS
module.exports.LoginUser = (req, res) => {
    const {username, password} = req.body;
    DataBaseModels.users.findOne({
        where: {
            username
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

//UPDATE USER

const TokenDecoder = (token) => {
    const decodedToken = jwtDecoder(token);
    return decodedToken.id
}
module.exports.UpdateUser = (req, res) => {
    const update = req.body;
    const token = req.headers.authorization.slice(6);
    const users_id = TokenDecoder(token);
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

//PASSWORD CHANGE
module.exports.ChangePassword = (req, res) => {
    const token = req.headers.authorization.slice(6);
    const {password} = req.body;
    const users_id = TokenDecoder(token);
    const validPassword = PasswordCheck(password);

    if (!validPassword) {
        return res.status(400).json({
            message: "Password don't fulfills rules."
        })
    }
    bcrypt.hash(password, 10)
        .then(hashedPassword => {
            DataBaseModels.users.update({
                password: hashedPassword
            }, {
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
        })
        .catch(
            error => {
                return res.status(400).json(error.toString())
            })
};

//GET SINGLE USER

module.exports.GetSingleUser = (req, res) => {
    const token = req.headers.authorization.slice(6);
    const users_id = TokenDecoder(token);
    DataBaseModels.users.findOne({
        where: {
            users_id
        }
    })
        .then(searchResult => {
            if(!searchResult){
                return res.status(404).json({
                    message:'User not found.'
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

//GET ALL USERS
module.exports.GetAllUsers=(req,res)=>{
    DataBaseModels.users.findAll()
        .then(searchResult => {
            if(!searchResult){
                return res.status(404).json({
                    message:'Users not found.'
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
