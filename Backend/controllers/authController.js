const User = require('../models/User');
const bcrypt = require("bcryptjs");  
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;



const nodemailer = require('nodemailer');
const { v4: uuidv4} = require('uuid');

exports.signup = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        });


        await newUser.save(); 


        return res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Signup Error:', error);
        return res.status(500).json({message: 'Server Error'});
    }   
};

exports.login = async (req, res) => {
    const {email, password} = req.body;

    try {
        const user = await User.findOne({email});

        if (!user) {
            return res.status(400).json({message: 'Invalid email or password'});
        }

        const isMatch  = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(400).json({message: 'Invalid email or password'});
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email},
            JWT_SECRET,
            {expiresIn: '1h'}
        );

        return res.status(200).json({
            message: 'Login successful',
            token: token,
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
            },
        });

    } catch (error) {
        console.error('Login Error:', error);
        return res.status(500).json({message: 'Server Error'});
    }
};


exports.forgotPassword = async (req, res) => {
    const {email} = req.body;

    try {
        const user = await User.findOne({email});  
        if(!user) {
            return res.status(404).json({message: 'User not found'});
        }

        const token = uuidv4();
        user.resetToken = token;
        user.resetTokenExpiry = Date.now() + 5 * 60 * 1000;
        await user.save();

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const resetLink = `${process.env.BASE_URL}/reset-password/${token}`;

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Password Reset Link',
            html: `<p>Click the link to reset your password (valid for 5 minutes) </p>
                   <a href="${resetLink}">${resetLink}</a>`,
        });
        return res.status(200).json({message: 'Reset Password link send to your email'});
    } catch (error) {
            console.error('Forgot Password Error:', error);
            return res.status(500).json({message: 'Server Error'});
        }
};

exports.resetPassword = async (req, res) => {
    const {token} = req.params;
    const {newPassword, confirmPassword} = req.body;

    try {
        if (newPassword !== confirmPassword) {
            return res.status(400).json({message: 'Passwords do not match'});
        }

        const user = await User.findOne({
            resetToken: token, 
            resetTokenExpiry: {$gt: Date.now()}
        });

        if (!user) {
            return res.status(400).json({message: 'Invalid or expired token'});
        }

        //Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashedPassword;

        user.resetToken = null;
        user.resetTokenExpiry = null;
        await user.save();

        return res.status(500).json({message: 'Password has been reset successfully'});
    } catch (error) {
        console.error('Reset Password Error:', error);
        return res.status(500).json({message: 'Server Error'});
    }
        
};

exports.getUserDetails = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        if(!user) {
            return res.status(404).json({message: 'User not found'});
        }
        return res.status(200).json({user});
    } catch (error) {
        console.error('Get User Details Error:', error);
        return res.status(500).json({message: 'Server Error'});
    }
};