'use strict' 
 
 
  let classIdURL = "/inv/getInventory";
  fetch(classIdURL) 
  .then(function (response) { 
   if (response.ok) { 
    return response.json(); 
   } 
   throw Error("Network response was not OK"); 
  }) 
  .then(function (data) { 
   console.log(data); 
   buildInventoryList(data); 
  }) 
  .catch(function (error) { 
   console.log('There was a problem: ', error.message) 
  }) 
 

 // Build inventory items into HTML table components and inject into DOM 
function buildInventoryList(data) { 
    let pendingItem = 0;
    data.forEach(function (inventory) {
        if (inventory.inv_approved == false) {
            pendingItem += 1;
        };
    });
    if (pendingItem != 0) {
        let inventoryDisplay = document.getElementById("inventoryDisplay"); 
        // Set up the table labels 
        let dataTable = '<thead>'; 
        dataTable += '<tr><th>Newly Added Vehicles</th><td>Classification</td><td>&nbsp;</td><td>&nbsp;</td></tr>'; 
        dataTable += '</thead>'; 
        // Set up the table body 
        dataTable += '<tbody>'; 
        // Iterate over all vehicles in the array and put each in a row 
        data.forEach(function (element) { 
            if (element.inv_approved == false) {
                console.log(element.inv_id + ", " + element.inv_model); 
                dataTable += `<tr><td>${element.inv_make} ${element.inv_model}</td>`; 
                dataTable += `<td>${element.classification_name}</td>`; 
                dataTable += `<td><a href='/inv/approve/${element.inv_id}' title='Click to approve'>Approve</a></td>`; 
                dataTable += `<td><a href='/inv/reject/${element.inv_id}' title='Click to reject'>Reject</a></td></tr>`; 
            }
        }) 
        dataTable += '</tbody>'; 
        // Display the contents in the Inventory Management view 
        inventoryDisplay.innerHTML = dataTable; 
    }
}