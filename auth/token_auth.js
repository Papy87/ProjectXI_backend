const jwt = require('jsonwebtoken');

const tokentAuth = (req, res, next) => {
    const token = req.headers.authorization;
    if (token) {
        let slicedToken = token.slice(7);
        jwt.verify(slicedToken, process.env.DB_SECRET, (err, decode) => {
            if (err) {
                return res.json({
                    messge: 'Invalid token'
                })
            }

            // req.verify_token = slicedToken;
            next()
        })

    } else {
        res.status(400).json({
            message: 'Please provide token'
        })
    }

}
module.exports = tokentAuth

