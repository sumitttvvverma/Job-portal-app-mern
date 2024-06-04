const express = require('express');
const { registerController, loginController } = require('../controllers/userControllers');
const userAuth = require('../middlewares/authMiddleware');
const { updateController, getUserController } = require('../controllers/user2Controllers');

const router = express.Router();

//routes
//REGISTER || POST
router.route('/register').post(registerController)

//LOGIN || POST
router.route('/login').post(loginController)

//test auth
router.route('/auth').post(userAuth)

//GET USERS || GET
router.route('/getUser').post(userAuth,getUserController)

//UPDATE USER || PUT
router.route('/updateUser').put(userAuth,updateController)

module.exports=router;