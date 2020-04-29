const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

let transporter = nodemailer.createTransport({
    port: 587,
    service: 'gmail',
    host: 'host',
    secure: false,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.KEY_ID
    },
    tls: {
        rejectUnauthorized: false
    }
})

function sendResetLink(email, id, res) {
    let mailOptions = {
        from: '"Nele Bradonja" <nelebradonja@gmail.com>',
        to: email,
        subject: 'Forgote password link',
        text: `To reset your password, please click on this link: http://localhost:3000/reset/${id}`
    }

    transporter.sendMail(mailOptions, (err, data) => {
        if (err) {
            console.log('Greska', err)
        } else {
            res.status(200).json({message: 'Email sent.'})
            // console.log('Email sent')
        }
    })

}

function emailConfirmationLink(email, user, res) {
    jwt.sign(
        {
            id: user.users_id,
            username: user.username,
            first_name: user.first_name,
            last_name: user.last_name
        },
        process.env.DB_SECRET,
        {
            expiresIn: '24h',
        },
        (err, emailToken) => {
            const url = `http://localhost:3000/confirmation/${emailToken}`;
            transporter.sendMail({
                    from: '"Nele Bradonja" <nelebradonja@gmail.com>',
                    to: email,
                    subject: 'Confirm Email',
                    text: `Please click this email to confirm your email: ${url}`,
                }, (err, data) => {
                    if (err) {
                        console.log('Greska', err)
                    } else {
                        res.status(200).json({
                            message: 'Email sent.',
                        })

                    }
                }
            );
        },
    );


}

module.exports = {sendResetLink, emailConfirmationLink};
