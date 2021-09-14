// const { response } = require('express');
const user = require('../models/user');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

exports.registerUser = async (req, res) => {
    const { userName, userEmail, userPhone, userAddress, userPassword } = req.body;
    const hashedPassword = await bcrypt.hash(userPassword, 10);
    const newUser = new user({
        name: userName,
        email: userEmail,
        phone: userPhone,
        address: userAddress,
        password: hashedPassword
    });
    user.findOne({ email: userEmail })
        .then(response => {
            response != null
                ? res.status(200).json({ message: 'Email already registered. Please login...' })
                : newUser.save()
                    .then(() => {
                        res.status(200).json({ message: 'You have registered successfully. Please login...' })
                    })
                    .catch(err => console.log(err));
        })
        .catch(err => console.log(err))
}

exports.loginUser = async (req, res) => {
    const { userEmail, userPassword } = req.body;
    user.findOne({ email: userEmail }).then(response => {
        if (!response) {
            return res.status(401).json({ message: 'Invalid credentials..' });
        } else {
            bcrypt.compare(userPassword, response.password).then(state => {
                state
                    ? res.status(200).json({ message: 'You\'ve logged in successfully..', userName: response.name })
                    : res.status(401).json({ message: 'Invalid credentials..' });
            }).catch()
        }
        // bcrypt.compare(userPassword, response.password).then(state => {
        //     state
        //         ? res.status(200).json({ message: 'You\'ve logged in successfully..', userName: response.name })
        //         : res.status(400).json({ message: 'Invalid credentials..' });
        // }).catch()
    }).catch(error=>console.log(error))
}

exports.updateUser = (req, res) => {
    const { userName, userPhone, userAddress, userEmail } = req.body;
    const updateUser = {
        name: userName,
        phone: userPhone,
        address: userAddress
    }
    user.updateOne({ email: userEmail }, { $set: updateUser }, function () {
        res.status(200).json({ message: 'Your profile has been updated successfully' })
    })
}

exports.resetPassword = async (req,res) => {
    const { userPassword, token } = req.body;
    const hashedPassword = await bcrypt.hash(userPassword, 10);
    user.findOne({ resetToken: token, expireToken: { $gt: Date.now() } })
        .then(response => {
            if (!response) {
                res.status(422).json({ message: 'Session expired. Please try again ... ' })
            }
            response.password = hashedPassword;
            response.save()
                .then(updatedUser => {
                    res.status(200).json({ message: 'Your password updated successfully. Please Login ... ' });
                    updatedUser.resetToken = undefined;
                    updatedUser.expireToken = undefined;
                    updatedUser.save();
                })
                .catch(err => console.log(err));
        }).catch(err => console.log(err));
}

exports.forgetPassword = (req, res) => {
    const { userEmail } = req.body;
    
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
        }
        const token = buffer.toString('hex');

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD,
                clientId: process.env.OAUTH_CLIENTID,
                clientSecret: process.env.OAUTH_CLIENT_SECRET,
                refreshToken: process.env.OAUTH_REFRESH_TOKEN
            }
        });

        user.findOne({ email: userEmail }).then(response => {
            if (!response) {
                res.status(422).json({ error: 'User doesn\'t exist' })
            }

            let mailOptions = {
                from: process.env.MAIL_USERNAME,
                to: userEmail,
                subject: 'Link for password reset',
                html: `
                <h3 style={color:#ce0505}>Hello ${response.name},</h3>
                <h3>Click this <a href='http://localhost:3000/update-password?token=${token}'>link</a> to reset your password</h3>`
            }

            response.resetToken = token;
            response.expireToken = Date.now() + 900000;
            response.save().then(result => {
                transporter.sendMail(mailOptions, (err, data) => {
                    if (err) {
                        console.log(err)
                    } else {
                        res.status(200).json({message:'We have sent password reset link to your email.\n This link valid for 15 minutes only.'})
                    }
                })
            }).catch(err => console.log(err))
        }).catch(err => console.log(err))
    })
}

exports.verifyUserBeforePayment = (req,res) =>{
    const { userEmail } = req.body;
    user.findOne({ email: userEmail }).then(response => {
        if (!response) {
            res.status(200).json({ message: 'proceed payment' });
        }
        res.status(200).json({ message: 'proceed login' });
    })
}
