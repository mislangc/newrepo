const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

async function getClassificationsByClassificationId(classification_id){
  try {
    const data = await pool.query(
      `SELECT * FROM public.classification
      WHERE classification_id = $1`,
      [classification_id]
    )
    return data.rows[0]
  } catch (error) {
  console.error("getclassificationbyclassificationid error " + error)
  }
}
/* ***************************
 *  Get all inventory items
 * ************************** */
async function getAllInventory() {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id `
    )
    return data.rows
  } catch (error) {
    console.error("getallinventory error " + error)
  }
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
    try {
      const data = await pool.query(
        `SELECT * FROM public.inventory AS i 
        JOIN public.classification AS c 
        ON i.classification_id = c.classification_id 
        WHERE i.classification_id = $1`,
        [classification_id]
      )
      return data.rows
    } catch (error) {
      console.error("getclassificationsbyid error " + error)
    }
  }

async function getInventoryByInventoryId(inventory_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE inv_id = $1`,
      [inventory_id]
    )
    return data.rows
  } catch (error) {
  console.error("getinventorybyinventoryid error " + error)
  }
}

/*
Duplicate functions of get inv by inv id for return as list
*/
async function getInventoryByInventoryIdAsList(inventory_id) {
  console.log(inventory_id)
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE inv_id = $1`,
      [inventory_id]
    )
    return data.rows[0]
  } catch (error) {
  console.error("getinventorybyinventoryidaslist error " + error)
  }
}


async function registerNewClassification(classification_name){
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
    return await pool.query(sql, [classification_name])
  } catch (error) {
    return error.message
  }
}

async function checkExistingClassification(classification_name){
  try {
    const sql = "SELECT * FROM classification WHERE classification_name = $1"
    const email = await pool.query(sql, [classification_name])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}
//Register new inventory and add it to the database
async function registerNewVehicle(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id){
  try {
    const sql = "INSERT INTO inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *"
    return await pool.query(sql, [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id])
  } catch (error) {
    return error.message
  }
}

//Update / change value inventory to the database
async function updateInventory(inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id){
  try {
    const sql = "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
    const data = await pool.query(sql, [
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
      inv_id
    ])
    return data.rows[0] 
  } catch (error) {
    console.error("model error: " + error)
  }
}

// Delete the selected vehicle in the database
async function deleteInventoryItem(inv_id) {
  try {
    const sql = 'DELETE FROM inventory WHERE inv_id = $1';
    const data = await pool.query(sql, [inv_id])
    return data
  } catch (error) {
    new Error("Delete Inventory Error")
  }
}

//Delete the selected classification in the database
async function deleteClassification(classification_id) {
  try {
    const sql = 'DELETE FROM classification WHERE classification_id = $1';
    const data = await pool.query(sql, [classification_id])
    return data
  } catch (error) {
    new Error("Delete Classification Error")
  }
}

//Approve and update inventory to the database
async function approveInventoryItem(inv_id, inv_approved, account_id, inv_approved_date){
  try {
    const sql = "UPDATE public.inventory SET inv_approved = $1, account_id = $2, inv_approved_date = $3 WHERE inv_id = $4 RETURNING *"
    const data = await pool.query(sql, [
      inv_approved,
      account_id,
      inv_approved_date,
      inv_id
    ])
    return data.rows[0] 
  } catch (error) {
    console.error("approve inventory model error: " + error)
  }
}

//Approve and update classification to the database
async function approveClassification(classification_id, classification_approved, account_id, classification_approval_date){
  try {
    const sql = "UPDATE public.classification SET classification_approved = $1, account_id = $2, classification_approval_date = $3 WHERE classification_id = $4 RETURNING *"
    const data = await pool.query(sql, [
      classification_approved,
      account_id,
      classification_approval_date,
      classification_id,
    ])
    return data.rows[0] 
  } catch (error) {
    console.error("approve classification model error: " + error)
  }
}

module.exports = {
  getClassifications,
  getClassificationsByClassificationId,
  deleteClassification, 
  getInventoryByClassificationId, 
  getInventoryByInventoryId, 
  registerNewClassification, 
  checkExistingClassification, 
  registerNewVehicle, 
  getInventoryByInventoryIdAsList,
  updateInventory,
  deleteInventoryItem,
  getAllInventory,
  approveInventoryItem,
  approveClassification,
};