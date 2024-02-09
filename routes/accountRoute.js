//Assignment 4 Learning Activity Log in page

const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")
const regValidate = require('../utilities/account-validation')

router.get("/login", utilities.handleErrors(accountController.buildLogin))
router.get("/register", utilities.handleErrors(accountController.buildRegister))
router.get(
  "/", 
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountManagement))
router.get(
  "/update/:account_id", 
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildUpdateAccountPage))
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
  utilities.handleErrors(accountController.accountLogin)
  )
router.post(
  "/update",
  regValidate.updateAccountRules(),
  regValidate.checkUpdateAccountData,
  utilities.handleErrors(accountController.updateAccountInfo)
)

router.post(
  "/change",
  regValidate.updateAccountPasswordRules(),
  regValidate.checkUpdateAccountDataPass,
  utilities.handleErrors(accountController.changePassword)
)

router.get(
  "/logout",  
  utilities.checkLogin, 
  utilities.handleErrors(accountController.logOut)
)
module.exports = router