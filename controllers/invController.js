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
  const { classification_name } = req.body

  const regResult = await invModel.registerNewClassification(
    classification_name,
  )
  nav = await utilities.getNav()
  if (regResult) {
    req.flash(
      "notice",
      `${classification_name} classification has officially been added!`
    )
    res.status(201).render("inventory/management", {
      title: "Vehicle Management",
      nav,
      links,
      errors: null,
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
    req.flash(
      "notice",
      `You registered ${inv_make} ${inv_model} successfully!`
    )
    res.status(201).render("inventory/management", {
      title: "Management",
      nav,
      links,
      errors: null,
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

module.exports = invCont