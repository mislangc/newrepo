// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidate = require('../utilities/inventory-validation')

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildVehicleDetailsPage));
router.get("/error", utilities.handleErrors(invController.buildErrorPage));
router.get("/", utilities.handleErrors(invController.buildManagement));
router.get("/addclass", utilities.handleErrors(invController.buildAddClassification));
router.get("/addinv", utilities.handleErrors(invController.buildAddInventory));
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))
router.get("/edit/:inventory_id", utilities.handleErrors(invController.buildEditInventoryPage))
// POST
router.post(
    "/addclass",
    invValidate.addClassificationRules(),
    invValidate.checkAddClassificationData,
    invController.registerNewClassification
  )

router.post(
    "/addinv",
    invValidate.addVehicleRules(),
    invValidate.checkAddVehicleData,
    invController.registerNewVehicle
  )

//Post route for the edit inventory page
router.post(
    "/update/", 
    invValidate.addVehicleRules(),
    invValidate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory)
  )

module.exports = router;