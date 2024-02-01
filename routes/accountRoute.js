//Assignment 4 Learning Activity Log in page

const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")
const regValidate = require('../utilities/account-validation')

router.get("/login", utilities.handleErrors(accountController.buildLogin))
router.get("/register", utilities.handleErrors(accountController.buildRegister))
// Process the registration data
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  accountController.registerAccount
)
// Process the login attempt
router.post(
    "/login",
    regValidate.logInRules(),
    regValidate.checkLogInData,
    (req, res) => {
      res.status(200).send('login process')
    }
  )

module.exports = router