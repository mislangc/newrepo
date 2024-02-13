const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let invData = await invModel.getAllInventory()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    //Define new variable to hold the number of vehicle found in current running classification
    let classInventoryCount = 0
    //Go through every data in the list invData to find matching classification vehicles
    invData.forEach((inventory) => {
      //If they match, add 1 to count
      if (row.classification_id == inventory.classification_id && inventory.inv_approved == true) {
        classInventoryCount += 1;
      }
    })
    //If the current running classification is approved and has vehicles to display, then display it in the navigation bar.
    if (row.classification_approved == true && classInventoryCount != 0 ) {
      list += "<li>"
      list +=
        '<a href="/inv/type/' +
        row.classification_id +
        '" title="See our inventory of ' +
        row.classification_name +
        ' vehicles">' +
        row.classification_name +
        "</a>"
      list += "</li>"
    }
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
    let grid
    if(data.length > 0){
      grid = '<ul id="inv-display">'
      data.forEach(vehicle => { 
        if (vehicle.inv_approved == true) {
          grid += '<li>'
          grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
          + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
          + 'details"><img src="' + vehicle.inv_thumbnail 
          +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
          +' on CSE Motors" /></a>'
          grid += '<div class="namePrice">'
          grid += '<hr />'
          grid += '<h2>'
          grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
          + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
          + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
          grid += '</h2>'
          grid += '<span>$' 
          + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
          grid += '</div>'
          grid += '</li>'
        }
      })
      grid += '</ul>'
    } else { 
      grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
  }

/* ****************************************
 * Set up the view for the vehicle detail page
 **************************************** */
Util.buildInventoryDetailView = async function(vehicle){
  let grid
  let data = vehicle[0]
  if (data){
    grid = '<div id="vehicle-details-page">'
    grid += '<img src="' + data.inv_image 
    +'" alt="Image of '+ data.inv_make + ' ' + data.inv_model 
    +' on CSE Motors" />'
    grid += '<div id="vehicle-details">'
    grid += '<h2>' + data.inv_make + ' ' + data.inv_model + ' Details </h2>'
    grid += '<ul class="vehicle-details-list">'
    grid += '<li><strong>Price: $</strong>' + new Intl.NumberFormat('en-US').format(data.inv_price) + '</li>'
    grid += '<li><strong>Description: </strong>' + data.inv_description +'</li>'
    grid += '<li><strong>Color: </strong>' + data.inv_color +'</li>'
    grid += '<li><strong>Miles: </strong>' + new Intl.NumberFormat('en-US').format(data.inv_miles) +'</li>'
    grid += '</ul>'
    grid += '</div>'
    grid += '</div>'
  } else {
    grid += '<p class="notice"> Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

Util.buildManagementLinks = async function() {
  let links
  links = '<a class="management-links" href="../../inv/addclass"><h2>Add New Classification</h2></a>'
  links += '<a class="management-links" href="../../inv/addinv"><h2>Add New Vehicle</h2></a>'
  return links
}

Util.getDropDownClassification = async function (selectedClassificationId) {
  let data = await invModel.getClassifications()
  let select = '<select id="classification_id" name="classification_id">'
  data.rows.forEach((row) => {
    if (row.classification_approved == true) {
      select += '<option value="' + row.classification_id + '"'
      if (selectedClassificationId == row.classification_id) {
        select += ' selected' 
      }
      select += '>' + row.classification_name + '</option>'
    }
  })
  select += "</select>"
  return select
}
/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
 }

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

 /* ****************************************
 *  Check Account Type for Authorization
 * ************************************ */
 Util.checkAccountType = (req, res, next) => {
  if (res.locals.accountData.account_type == "Employee" || res.locals.accountData.account_type == "Admin") {
    next()
  } else {
    req.flash("notice", "You are not authorized.")
    return res.redirect("/account/login")
  }
 }

module.exports = Util