const express = require('express');
const router = express.Router();


const {
    signup,
    login, 
    forgotPassword, 
    resetPassword, 
    getUserDetails,
} = require('../controllers/authController');




// To import jwt middleware to protect routes 
const verifyToken = require('../middleware/authMiddleware');


router.post("/signup", signup);
router.post("/login", login);

router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

//to login user details
router.get('/me', verifyToken, getUserDetails);

module.exports = router;

