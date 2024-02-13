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

router.use(utilities.checkLogin)
router.use(utilities.checkAccountType)

router.get("/", utilities.handleErrors(invController.buildManagement));
router.get("/addclass", utilities.handleErrors(invController.buildAddClassification));
router.get("/addinv", utilities.handleErrors(invController.buildAddInventory));
router.get("/getClassification", utilities.handleErrors(invController.getAllClassificationJSON))
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))
router.get("/getInventory", utilities.handleErrors(invController.getAllInventoryJSON))
router.get("/edit/:inventory_id", utilities.handleErrors(invController.buildEditInventoryPage))
//Week 5 Team Activity Delete Route
router.get("/delete/:inventory_id", utilities.handleErrors(invController.deleteView))
//Approve requested inventory then update database
router.get("/approve/:inventory_id", utilities.handleErrors(invController.approveView))
//Approve Class then update database
router.get("/approveClass/:classification_id", utilities.handleErrors(invController.approveClassView))
//Delete item if rejected
router.get("/reject/:inventory_id", utilities.handleErrors(invController.rejectView))
//Delete Class if rejected
router.get("/rejectClass/:classification_id", utilities.handleErrors(invController.rejectClassView))
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

//Post route for delete page
router.post(
  "/delete", 
  invController.deleteItem)

router.post(
  "/approve", 
  invController.approveItem)

router.post(
  "/approveClass", 
  invController.approveClass)

router.post(
  "/reject", 
  invController.rejectItem)

router.post(
  "/rejectClass", 
  invController.rejectClass)

module.exports = router;