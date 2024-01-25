const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
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
    grid += '<h1>' + data.inv_make + ' ' + data.inv_model + '</h1>'
    grid += '<div id="vehicle-content">'
    grid += '<img src="' + data.inv_image 
    +'" alt="Image of '+ data.inv_make + ' ' + data.inv_model 
    +' on CSE Motors" />'
    grid += '<div id="vehicle-details">'
    grid += '<h2>' + data.inv_make + data.inv_model + 'Details </h2>'
    grid += '<ul class="vehicle-details-list">'
    grid += '<li><strong>Price: $</strong>' + new Intl.NumberFormat('en-US').format(data.inv_price) + '</li>'
    grid += '<li><strong>Description: </strong>' + data.inv_description +'</li>'
    grid += '<li><strong>Color: </strong>' + data.inv_color +'</li>'
    grid += '<li><strong>Miles: </strong>' + new Intl.NumberFormat('en-US').format(data.inv_price) +'</li>'
    grid += '</ul>'
    grid += '</div>'
    grid += '</div>'
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util