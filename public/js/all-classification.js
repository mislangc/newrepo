'use strict' 
 
 
  let classListIdURL = "/inv/getClassification";
  fetch(classListIdURL) 
  .then(function (response) { 
   if (response.ok) { 
    return response.json(); 
   } 
   throw Error("Network response was not OK"); 
  }) 
  .then(function (data) { 
   console.log(data); 
   buildClassificationList(data); 
  }) 
  .catch(function (error) { 
   console.log('There was a problem: ', error.message) 
  }) 
 

 // Build inventory items into HTML table components and inject into DOM 
function buildClassificationList(data) { 
    //Check to see if there are unapproved classifications to show. If none, this section will not appear.
    let pendingClassifications = 0;
    data.forEach(function (classification) {
        if (classification.classification_approved == false) {
            pendingClassifications += 1;
        };
    });
    if (pendingClassifications != 0) {
        let classificationDisplay = document.getElementById("classificationDisplay"); 
        // Set up the table labels 
        let dataTable = '<thead>'; 
        dataTable += '<tr><th>Newly Added Classification</th><td>&nbsp;</td><td>&nbsp;</td></tr>'; 
        dataTable += '</thead>'; 
        // Set up the table body 
        dataTable += '<tbody>'; 
        // Iterate over all vehicles in the array and put each in a row 
        data.forEach(function (element) { 
            if (element.classification_approved == false) {
                console.log(element.classification_name); 
                dataTable += `<tr><td>${element.classification_name}</td>`; 
                dataTable += `<td><a href='/inv/approveClass/${element.classification_id}' title='Click to approve'>Approve</a></td>`; 
                dataTable += `<td><a href='/inv/rejectClass/${element.classification_id}' title='Click to reject'>Reject</a></td></tr>`; 
            }
        }) 
        dataTable += '</tbody>'; 
        // Display the contents in the Inventory Management view 
        classificationDisplay.innerHTML = dataTable; 
    }
}