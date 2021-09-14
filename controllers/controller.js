const locationData = require('../models/location');
const mealtypeData = require('../models/mealtype');
const restaurantData = require('../models/restaurant');
const menuData = require('../models/menuItem');
const orderData = require('../models/orders');
const user = require('../models/user');


exports.getLocations = (req, res) => {
    locationData.find()
        .then(response => {
            res.status(200).json({ 'message': 'Location data fetched successfully', 'location': response });
        })
        .catch(err => console.log(err));
}

exports.getMealTypes = (req, res) => {
    mealtypeData.find().sort({mealtype_id:1})
        .then(response => {
            res.status(200).json({ 'message': 'Mealtypes data fetched successfully', 'mealtype': response });
        })
        .catch(err => console.log(err));
}

exports.getRestaurants = (req, res) => {
    const locationId = req.params.locationId
    restaurantData.find({area:locationId})
        .then(response => {
            res.status(200).json({ 'message': 'Restaurants data fetched successfully', 'restaurant': response });
        })
        .catch(err => console.log(err));
}

exports.filterRestaurant = (req, res) => {
    let { mealtype, locationId, cuisine, lCost, hCost, sort, page } = req.body;
    let payload = {};
    page = page ? page : 1;
    sort = sort ? sort : 1;
    // if (cuisine) {
    //     cuisine = cuisine.length == 0 ? 0 : cuisine;
    // }

    if (mealtype) {
        payload = {
            'type.mealtype': mealtype
        }
    }
    if (mealtype && locationId) {
        payload = {
            'type.mealtype': mealtype,
            area: locationId
        }
    }
    if (mealtype && cuisine) {
        payload = {
            'type.mealtype': mealtype,
            'Cuisine.cuisine': { $in: cuisine }
        }
    }
    if (mealtype && lCost && hCost) {
        payload = {
            'type.mealtype': mealtype,
            cost:{$lte: hCost, $gte:lCost}
        }
    }
    if (mealtype && locationId && cuisine) {
        payload = {
            'type.mealtype': mealtype,
            area: locationId,
            'Cuisine.cuisine': { $in: cuisine }
        }
    }
    if (mealtype && cuisine && lCost && hCost) {
        payload = {
            'type.mealtype': mealtype,
            'Cuisine.cuisine': { $in: cuisine },
            cost:{$lte: hCost, $gte:lCost}
        }
    }
    if (mealtype && locationId && lCost && hCost) {
        payload = {
            'type.mealtype': mealtype,
            cost: { $lte: hCost, $gte: lCost },
            area: locationId
        }
    }
    if (mealtype && locationId && cuisine && lCost && hCost) {
        payload = {
            'type.mealtype': mealtype,
            area: locationId,
            'Cuisine.cuisine': { $in: cuisine },
            cost:{$lte: hCost, $gte:lCost}
        }
    }

    restaurantData.find(payload).sort({cost:sort})
        .then(response => {
            // Pagination
            const itemsPerPage = 3;
            let startIndex = (page - 1) * itemsPerPage;
            let endIndex = page * itemsPerPage;
            let totalCount = response.length;
            let pageCount = [];
            for (let i = 1; i <= Math.ceil(totalCount / itemsPerPage); i++){
                pageCount.push(i);
            }
            const filteredResponse = response.slice(startIndex, endIndex);
            // Final result
            res.status(200).json({
                'message': 'Restaurant data fetched successfully',
                'restaurant': filteredResponse,
                'pageCount': pageCount,
                'totalCount': totalCount
            });
        })
        .catch(err => console.log(err));
}

exports.restaurantDetails = (req, res) => {
    const restaurantId = req.params.restaurantId;
    restaurantData.findById(restaurantId)
        .then(response => {
            res.status(200).json({ 'message': 'Restaurant details fetched successfully', 'details': response });
        })
        .catch(err => console.log(err));
}

exports.menuDetails = (req, res) => {
    const restaurantId = req.params.restaurantId;
    menuData.find({ restaurantId })
        .then(response => {
            res.status(200).json({ 'message': 'Menu details fetched successfully', 'menuItems': response });
        })
        .catch(err => console.log(err));
    
}

exports.postOrders = (req, res) => {
    const { userEmail, userName, userAddress, orderedItems, orderId } = req.body;
    const newOrder = new orderData({
        userEmail: userEmail,
        userName: userName,
        userAddress: userAddress,
        orderedItems: orderedItems,
        orderId: orderId
    })
    newOrder.save().then(message => console.log('Order posted')).catch(error => console.log(error));
}

exports.getUserProfile = (req, res) => {
    const { userEmail } = req.body;
    user.find({ email:userEmail })
        .then(response => {
            res.status(200).json({ 'message': 'User profile fetched successfully', 'profile': response })
        }).catch(err => console.log(err));
}

exports.getOrders = (req, res) => {
    let { userEmail, page } = req.body;
    page = page ? page : 1;
    orderData.find({ userEmail }).sort({'transactionData.TXNDATE':-1})
        .then(response => {
            // Pagination
            const itemsPerPage = 4;
            let startIndex = (page - 1) * itemsPerPage;
            let endIndex = page * itemsPerPage;
            let totalCount = response.length;
            let pageCount = [];
            for (let i = 1; i <= Math.ceil(totalCount / itemsPerPage); i++){
                pageCount.push(i);
            }
            const filteredResponse = response.slice(startIndex, endIndex);
            res.status(200).json({
                'message': 'User orders fetched successfully',
                'orders': filteredResponse,
                'pageCount': pageCount,
                'totalCount': totalCount
            })
        }).catch(err => console.log(err));
}

exports.restaurantDataAll = (req, res) => {
    restaurantData.find({})
        .then(response => {
            res.status(200).json({ 'message': 'Restaurant details fetched successfully', 'restaurants': response });
        })
        .catch(err => console.log(err));
}