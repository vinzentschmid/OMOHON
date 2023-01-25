// creates and returns complete overview page with HTML and CSS reference
// TODO: manage which rows are shown
function getAllLocations(locations) {
    console.log("getAllLocations")
    console.log(locations);
    return `<!DOCTYPE html>
 <html>
    <head>
        <title>Locations Overview</title>
        <meta charset="utf-8">
        <link rel="stylesheet" href="/public/css/style.css" />
    </head>
     <body>
        <h1>Locations Overview</h1>
        <div id="add">
            <a href="/new"><img class="icon" src="public/images/new.png" alt="new location" title="New Location" /></a>
            <a href="/new"><span id="addText">Add Location</span></a>
        </div>
        
        <table>
            <tr class="headerTable">
                <th>street</th>
                <th>housenumber</th>
                <th>postalcode</th>
                <th>city</th>
                <th>country</th>
                <th>delete</th>
                <th>edit</th>
            </tr>
    
            ${locations.map(createRow).join('')}
    
        </table>
     </body>
 </html>`;
}
function createRow(location) {
    return `<tr>
                <td>${location.street}</td>
                <td>${location.housenumber}</td>
                <td>${location.postalcode}</td>
                <td>${location.city}</td>
                <td>${location.country}</td>
                <td><a href="/deleteLocation/${location.id}" onclick="return confirm('Are you sure you want to delete this location ?')"><img class="icon" src="/public/images/delete.png" alt="delete location" title="delete location"/></a></td>
                <td><a href="/edit/${location.id}"><img class="icon" src="/public/images/edit.png" alt="edit location" title="edit location"/></a></td>
            </tr>`;
}
module.exports = getAllLocations;
