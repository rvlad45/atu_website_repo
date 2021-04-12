const fs = require('fs');
// JSON data
const runData = require('./database.js');
const data = require('./data.json');
// Build paths
const { buildPathHtml } = require('./buildPaths');

/**
 * Take an object which has the following model
 * @param {Object} item 
 * @model
 * {
 *   "invoiceId": `Number`,
 *   "createdDate": `String`,
 *   "dueDate": `String`,
 *   "address": `String`,
 *   "companyName": `String`,
 *   "invoiceName": `String`,
 *   "price": `Number`,
 * }
 * 
 * @returns {String}
 */
const createRow = (item) => `
  <tr>
    <td>${item.Serial_Num}</td>
    <td>${item.Name}</td>
    <td>${item.Make}</td>
    <td>${item.Model}</td>
  </tr>
`;

/**
 * @description Generates an `html` table with all the table rows
 * @param {String} rows
 * @returns {String}
 */
const createTable = (rows) => `
  <table>
    <tr>
        <th>Serial_Num</td>
        <th>Name</td>
        <th>Make</td>
        <th>Model</td>
    </tr>
    ${rows}
  </table>
`;

/**
 * @description Generate an `html` page with a populated table
 * @param {String} table
 * @returns {String}
 */
const createHtml = (table) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <title>ITS Equipment - Inventory</title>
  <meta charset="utf-8">
  <link href="style.css" rel="stylesheet">
  <link rel="icon" type="image/png" href="media/Belltower_logo.PNG"/>
  <meta name="description" content="This is the equipment available for rent.">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="script" href="/data.js">
</head>
<body>
  <div id="wrapper"> 
    <nav>
      <a href="index.html">Home</a>
      <a href="items.html">Inventory</a>
      <a href="cart.html">Cart</a>
      <a href="checkout.html">Checkout</a>
    </nav>
    <h1>Inventory</h1>
    <main>
      <h2>All Equipment Available for Rent:</h2>
      <!-- Table format !!TESTING!! -->
      ${table}
    </main>
    <footer>
      <a href="https://www.atu.edu/"><img src="media/ATU_logo.PNG" width="80" height="40" alt="ATU Logo"></a><br><br>
      <a>Copyright &copy; 2021 Arkansas Tech University - All Rights Reserved - Website Accessibility</a>
    </footer>
  </div>
</body>
</html>
`;

/**
 * @description this method takes in a path as a string & returns true/false
 * as to if the specified file path exists in the system or not.
 * @param {String} filePath 
 * @returns {Boolean}
 */
const doesFileExist = (filePath) => {
	try {
		fs.statSync(filePath); // get information of the specified file path.
		return true;
	} catch (error) {
		return false;
	}
};

try {
	/* Check if the file for `html` build exists in system or not */
	if (doesFileExist(buildPathHtml)) {
		console.log('Deleting old build file');
		/* If the file exists delete the file from system */
		fs.unlinkSync(buildPathHtml);
	}
	/* generate rows */
	const rows = data.map(createRow).join('');
	/* generate table */
	const table = createTable(rows);
	/* generate html */
	const html = createHtml(table);
	/* write the generated html to file */
	fs.writeFileSync(buildPathHtml, html);
	console.log('Succesfully created an HTML table');
} catch (error) {
	console.log('Error generating table', error);
}