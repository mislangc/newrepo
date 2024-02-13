const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")
const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

invCont.buildVehicleDetailsPage = async function (req, res, next) {
  const inventory_id = req.params.inventoryId
  const data = await invModel.getInventoryByInventoryId(inventory_id)
  const grid = await utilities.buildInventoryDetailView(data)
  let nav = await utilities.getNav()
  const className = data[0].inv_year + ' ' + data[0].inv_make + ' ' + data[0].inv_model
  res.render("./inventory/inventoryDetails", {
    title: className,
    nav,
    grid,
  })
}

invCont.buildErrorPage = async function (req, res, next) {
  const inventory_id = req.params.inventoryId
  const data = await invModel.getInventoryByInventoryId(inventory_id)
  const grid = await utilities.buildInventoryDetailView(data)
  //let nav = await utilities.getNav()
  res.render("./inventory/inventoryDetails", {
    title: ' ',
    nav,
    grid,
  })
}

invCont.buildManagement = async function (req, res, next) {
  const links = await utilities.buildManagementLinks()
  let nav = await utilities.getNav()
  let classification_list = await utilities.getDropDownClassification()
  res.render("./inventory/management", {
    title: 'Vehicle Management',
    nav,
    links,
    classification_list,
  })
}

invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
  })
}

invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  let dropdown = await utilities.getDropDownClassification()
  res.render("inventory/add-inventory", {
    title: "Add New Vehicle",
    nav,
    errors: null,
    dropdown,
  })
}

invCont.registerNewClassification = async function (req, res) {
  let nav = await utilities.getNav()
  let links = await utilities.buildManagementLinks()
  let dropdown = await utilities.getDropDownClassification()
  const { classification_name } = req.body

  const regResult = await invModel.registerNewClassification(
    classification_name,
  )
  nav = await utilities.getNav()
  if (regResult) {
    if (res.locals.accountData.account_type == "Admin") {
      req.flash(
        "notice",
        `${classification_name} classification has been requested! Approve your own request in your Account Management.`
      )
    } else {
      req.flash(
        "notice",
        `${classification_name} classification has been requested! Wait for approval of Admin.`
      )
    }
   
    res.status(201).render("inventory/management", {
      title: "Vehicle Management",
      nav,
      links,
      errors: null,
      classification_list: dropdown
    })
  } else {
    req.flash("notice", "Sorry, add new classification failed.")
    res.status(501).render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: null,
    })
  }
}

invCont.registerNewVehicle = async function (req, res) {
  let nav = await utilities.getNav()
  let links = await utilities.buildManagementLinks()
  let dropdown = await utilities.getDropDownClassification()
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body

  const regResult = await invModel.registerNewVehicle(
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  )

  if (regResult) {
    if (res.locals.accountData.account_type == "Admin") {
      req.flash(
        "notice",
        `Your request for adding ${inv_make} ${inv_model} has been sent! Approve your own request in your Account Management.`
      )
    } else {
      req.flash(
        "notice",
        `Your request for adding ${inv_make} ${inv_model} has been sent! Wait for approval of Admin.`
      )
    }
    res.status(201).render("inventory/management", {
      title: "Management",
      nav,
      links,
      errors: null,
      classification_list: dropdown,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("inventory/addinv", {
      title: "Add New Vehicle",
      nav,
      errors: null,
      dropdown,
    })
  }
}

invCont.getAllClassificationJSON = async (req, res, next) => {
  const data = await invModel.getClassifications()
  const classData = data.rows
  if (classData) {
    return res.json(classData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Return All Inventory As JSON
 * ************************** */
invCont.getAllInventoryJSON = async (req, res, next) => {
  const invData = await invModel.getAllInventory()
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Edit / Modify Vehicle Data View
 * ************************** */
invCont.buildEditInventoryPage = async function (req, res, next) {
  const inv_id = parseInt(req.params.inventory_id)
  let nav = await utilities.getNav()
  const itemData = await (invModel.getInventoryByInventoryIdAsList(inv_id))
  let dropdown = await utilities.getDropDownClassification(itemData.classification_id)
  let name = itemData.inv_make + " " + itemData.inv_model
  res.render("inventory/edit-inventory", {
    title: "Edit " + name,
    nav,
    dropdown,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}

//Update current selected inventory. Change it's values then send UPDATE to the database
invCont.updateInventory = async function (req, res) {
  let nav = await utilities.getNav()
  let links = await utilities.buildManagementLinks()
  let dropdown = await utilities.getDropDownClassification()
  const { 
    inv_id,
    inv_make, 
    inv_model, 
    inv_year, 
    inv_description, 
    inv_image, 
    inv_thumbnail, 
    inv_price, 
    inv_miles, 
    inv_color, 
    classification_id 
  } = req.body

  const updateResult = await invModel.updateInventory(
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated!`)
    res.redirect("/inv/")
  } else {
    let dropdown = await utilities.getDropDownClassification(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      dropdown, // let's try this for now
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    })
  }
}

/* ***************************
 *  Delete Vehicle Data View
 * ************************** */
invCont.deleteView = async function (req, res, next) {
  let nav = await utilities.getNav()
  const inv_id = parseInt(req.params.inventory_id)
  console.log(inv_id)
  const itemData = await invModel.getInventoryByInventoryIdAsList(inv_id)
  let name = itemData.inv_make + " " + itemData.inv_model
  res.render("inventory/delete-confirm", {
    title: "Delete " + name,
    nav,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
  })
}

//Delete process for the delete view for the current selected inventory
invCont.deleteItem = async function (req, res, next) {
  let nav = await utilities.getNav()
  const inv_id = parseInt(req.body.inv_id)
  console.log(inv_id)
  const deleteResult = await invModel.deleteInventoryItem(inv_id)
  if (deleteResult) {
    req.flash("notice", `The deletion was successful.`)
    res.redirect('/inv/')
  } else {
    req.flash("notice", "Sorry, the delete process failed.")
    res.redirect(`/inv/delete/${inv_id}`)
  }
}

/* ***************************
 *  Reject Vehicle Data View
 * ************************** */
invCont.rejectView = async function (req, res, next) {
  let nav = await utilities.getNav()
  const inv_id = parseInt(req.params.inventory_id)
  console.log(inv_id)
  const itemData = await invModel.getInventoryByInventoryIdAsList(inv_id)
  let name = itemData.inv_make + " " + itemData.inv_model
  res.render("inventory/reject-confirm", {
    title: "Reject " + name,
    nav,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
  })
}

invCont.rejectItem = async function (req, res, next) {
  let nav = await utilities.getNav()
  const inv_id = parseInt(req.body.inv_id)
  console.log(inv_id)
  const deleteResult = await invModel.deleteInventoryItem(inv_id)
  if (deleteResult) {
    req.flash("notice", `Inventory has been rejected.`)
    res.redirect('/account/')
  } else {
    req.flash("notice", "Sorry, the rejection process failed.")
    res.redirect(`/inv/reject/${inv_id}`)
  }
}

invCont.approveClassView = async function (req, res, next) {
  let nav = await utilities.getNav()
  const classification_id = parseInt(req.params.classification_id)
  console.log(classification_id)
  const itemData = await invModel.getClassificationsByClassificationId(classification_id)
  console.log(itemData)
  res.render("inventory/approve-class-confirm", {
    title: "Approve " + itemData.classification_name,
    nav,
    errors: null,
    classification_id: itemData.classification_id,
    classification_name: itemData.classification_name,
  })
}

invCont.rejectClassView = async function (req, res, next) {
  let nav = await utilities.getNav()
  const classification_id = parseInt(req.params.classification_id)
  console.log(classification_id)
  const itemData = await invModel.getClassificationsByClassificationId(classification_id)
  console.log(itemData)
  res.render("inventory/reject-class-confirm", {
    title: "Reject " + itemData.classification_name,
    nav,
    errors: null,
    classification_id: itemData.classification_id,
    classification_name: itemData.classification_name,
  })
}

invCont.approveClass = async function (req, res, next) {
  let nav = await utilities.getNav()
  const classification_id = parseInt(req.body.classification_id)
  const classification_approved = true
  const account_id = res.locals.accountData.account_id
  //Get the date and time today when the approval happened
  const date = new Date();
  const month   = date.getUTCMonth() + 1; // months from 1-12
  const day     = date.getUTCDate();
  const year    = date.getUTCFullYear();
  const time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}.${date.getMilliseconds()}`
  const classification_approval_date = year + "/" + month + "/" + day + " " + time;

  const approveResult = await invModel.approveClassification(classification_id, classification_approved, account_id, classification_approval_date)
  console.log(approveResult)
  if (approveResult) {
    req.flash("notice", ` ${approveResult.classification_name} classification has been approved.`)
    res.redirect('/account/')
  } else {
    req.flash("notice", "Sorry, the approval process failed.")
    res.redirect(`/inv/approveClass/${classification_id}`)
  }
}

invCont.rejectClass = async function (req, res, next) {
  let nav = await utilities.getNav()
  const classification_id = parseInt(req.body.classification_id)
  const deleteResult = await invModel.deleteClassification(classification_id)
  if (deleteResult) {
    req.flash("notice", `Classification has been rejected.`)
    res.redirect('/account/')
  } else {
    req.flash("notice", "Sorry, the rejection process failed.")
    res.redirect(`/inv/rejectClass/${classification_id}`)
  }
}

/* ***************************
 *  Approve Vehicle Data View
 * ************************** */
invCont.approveView = async function (req, res, next) {
  let nav = await utilities.getNav()
  const inv_id = parseInt(req.params.inventory_id)
  const itemData = await invModel.getInventoryByInventoryIdAsList(inv_id)
  let name = itemData.inv_make + " " + itemData.inv_model
  res.render("inventory/approve-confirm", {
    title: "Approve " + name,
    nav,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
  })
}

invCont.approveItem = async function (req, res, next) {
  let nav = await utilities.getNav()
  const inv_id = parseInt(req.body.inv_id)
  const account_id = res.locals.accountData.account_id
  const inv_approved = true

  //Get date today
  const date = new Date();
  const month   = date.getUTCMonth() + 1; // months from 1-12
  const day     = date.getUTCDate();
  const year    = date.getUTCFullYear();
  const time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}.${date.getMilliseconds()}`
  const inv_approved_date = year + "/" + month + "/" + day + " " + time;

  //Get all values then pass to model
  const approveResult = await invModel.approveInventoryItem(inv_id, inv_approved, account_id, inv_approved_date)

  if (approveResult) {
    req.flash("notice", `${approveResult.inv_make} ${approveResult.inv_model}  has been approved.`)
    res.redirect('/account/')
  } else {
    req.flash("notice", "Sorry, the approval process failed.")
    res.redirect(`/inv/approve/${inv_id}`)
  }
}

module.exports = invCont