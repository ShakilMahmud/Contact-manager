const router = require("express").Router()
const { registration, login, currentUser } = require("../controllers/userController")
const validateToken = require("../middleware/validateTokenHandler")


router.route('/registration').post(registration)
router.route('/login').post(login)
router.route('/user_status/').post(validateToken,currentUser)


module.exports = router