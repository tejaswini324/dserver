// Importing 'express' package
const express = require('express');

// Importing 'express.Router' function
const router = express.Router();

// Importing 'body' and 'validationResult' objects from 'express-validator' package
const { body, validationResult } = require('express-validator');

// importing model file
const locationData = require('../models/location');
const restaurantData = require('../models/restaurant');

// importing controller file
const controller = require('../controllers/controller');
const auth = require('../controllers/auth');
const paymentController = require('../controllers/payment');


// Routing to 'controller' funcitons using 'express.Router' function
router.get('/location', controller.getLocations);
router.get('/mealtype', controller.getMealTypes);
router.get('/restaurantByLocation/:locationId', controller.getRestaurants);
router.post('/filterRestaurant', controller.filterRestaurant);
router.post('/signup', auth.registerUser);
router.post('/login', auth.loginUser);
router.get('/restaurantDetails/:restaurantId', controller.restaurantDetails);
router.get('/menu/:restaurantId', controller.menuDetails);
router.post('/payment', paymentController.payment);
router.post('/payment-callback', paymentController.callback);
router.post('/orderItems', controller.postOrders);
router.post('/userProfile', controller.getUserProfile);
router.post('/orderHistory', controller.getOrders);
router.get('/allRestaurants', controller.restaurantDataAll);
router.post('/updateUserProfile', auth.updateUser);
router.post('/reset-password', auth.resetPassword);
router.post('/forget-password', auth.forgetPassword);
router.post('/verify-user-before-payment', auth.verifyUserBeforePayment);

module.exports = router;
