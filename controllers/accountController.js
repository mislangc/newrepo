const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  }
  
/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
      title: "Register",
      nav,
      errors: null,
    })
  }

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body
  
      // Hash the password before storing
      let hashedPassword
        try {
        // regular password and cost (salt is generated automatically)
        hashedPassword = await bcrypt.hashSync(account_password, 10)
      } catch (error) {
        req.flash("notice", 'Sorry, there was an error processing the registration.')
        res.status(500).render("account/register", {
          title: "Registration",
          nav,
          errors: null,
        })
    }

    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    )
  
    if (regResult) {
      req.flash(
        "notice",
        `Congratulations, you\'re registered ${account_firstname}. Please log in.`
      )
      res.status(201).render("account/login", {
        title: "Login",
        nav,
        errors: null,
      })
    } else {
      req.flash("notice", "Sorry, the registration failed.")
      res.status(501).render("account/register", {
        title: "Registration",
        nav,
        errors: null,
      })
    }
  }

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
   req.flash("notice", "Please check your credentials and try again.")
   res.status(400).render("account/login", {
    title: "Login",
    nav,
    errors: null,
    account_email,
   })
  return
  }
  try {
   if (await bcrypt.compare(account_password, accountData.account_password)) {
   delete accountData.account_password
   const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
   res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
   return res.redirect("/account/")
   } else {
    req.flash('notice', 'Incorrect password. Please try again.')
    res.status(400).render('account/login', {
      title: 'Login',
      nav,
      errors: null,
      account_email,
    })
  }
  } catch (error) {
   return new Error('Access Forbidden')
  }
 }


async function buildAccountManagement(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/management", {
    title: "Account Management",
    nav,
    errors: null,
  })
}

/* ***************************
 *  Build Account Update Page with Credentials from Database
 * ************************** */
async function buildUpdateAccountPage (req, res, next) {
  const account_id = parseInt(req.params.account_id)
  let nav = await utilities.getNav()
  const data = await accountModel.getAccountByAccountId(account_id)
  res.render("account/update", {
    title: "Edit Account", 
    nav,
    errors: null,
    account_id: data.acccount_id,
    account_firstname: data.account_firstname,
    account_lastname: data.account_lastname,
    account_email: data.account_email,
  })
}

async function updateAccountInfo(req, res) {
  let nav = await utilities.getNav()
console.log(res.locals)
  const {
    account_firstname,
    account_lastname,
    account_email,
  } = req.body

  //get account id via locals because req.body gets account id as blank or undefined
  const account_id = res.locals.accountData.account_id;

  const updateAccountInfoResult = await accountModel.updateAccountInfo(
    account_id,
    account_firstname,
    account_lastname,
    account_email,
  )
  let updatedAccessToken = ""
  if (updateAccountInfoResult) {
    const updatedAccountData = await accountModel.getAccountByAccountId(account_id)
    delete updatedAccountData.account_password
    updatedAccessToken = jwt.sign(updatedAccountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 });
    res.cookie("jwt", updatedAccessToken, { httpOnly: true, maxAge: 3600 * 1000 })
    console.log(res.locals)
    req.flash("notice", `Your account has been successfully updated!`)
    res.redirect(`/account/`)
  } else {
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("account/update", {
      title: "Edit " + Account,
      nav,
      errors: null,
      account_firstname,
      account_lastname,
      account_email,
    })
  }
}
async function changePassword(req, res) {
  let nav = await utilities.getNav()
  const { account_password, account_firstname, account_lastname, account_email } = req.body
  let hashedPassword
    try {
      // regular password and cost (salt is generated automatically)
      hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
      req.flash("notice", 'Sorry, there was an error processing the registration.')
      res.status(500).render("account/update", {
        title: "Edit Account",
        nav,
        errors: null,
      })
    }
  const account_id = res.locals.accountData.account_id;

  const changePasswordResult = await accountModel.changePassword(hashedPassword, account_id)

  if (changePasswordResult) {
    req.flash(
      "notice",
      `Changed password successfully!`
    )
    res.status(201).render("account/management", {
      title: "Account Management",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, changing password failed.")
    res.status(501).render(`account/update`, {
      title: "Edit Account",
      nav,
      errors: null,
      account_id,
      account_firstname,
      account_lastname,
      account_email,
    })
  }
}

async function logOut(req, res) {
  res.clearCookie('jwt');
  res.redirect('/');
}

module.exports = { 
  buildLogin, 
  buildRegister, 
  registerAccount, 
  accountLogin, 
  buildAccountManagement, 
  buildUpdateAccountPage,
  updateAccountInfo,
  changePassword,
  logOut }