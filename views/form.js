const createSidebar = require('./sidebar');

function getWaterEntryForm(liquid, locations, types) {
    if (liquid === undefined) {
        liquid = {
            id: '',
            ml: 0,
            type: ''
        };
    }
    let header = "Add New Water Entry";
    if (liquid.id) {
        header = "Edit Water Entry";
    }

    return `<!DOCTYPE html>
<html>
 <head> 
 <title>${header}</title>
  <link rel="stylesheet" href="/public/css/style.css" />
 <meta charset="utf-8">
 <script defer>
 document.addEventListener('DOMContentLoaded', function() {
  const data = ${JSON.stringify(locations)};
 const select = document.getElementById('location');
 const liquid = ${JSON.stringify(liquid)};
 const typeList = ${JSON.stringify(types)};
 
 const selectOption = document.createElement('option');
 selectOption.textContent = liquid.locations_id === undefined ? 'Select Location':'No Location';
 select.appendChild(selectOption);
 data.forEach(location => { 
      const option = document.createElement('option');
      option.value = location.id;
      option.textContent = location.street + ' ' + location.housenumber + ' ' + location.postalcode + ' ' + location.city + ' ' + location.country;
      select.appendChild(option);
     if(liquid.locations_id === location.id){
          option.selected = true;
      }
 });
 const option = document.createElement('option');
 option.value = 'submit';
 option.id = 'submitOption';
 option.textContent = 'Create New';
 option.classList.add('submitOption');
 select.appendChild(option);
 
  select.addEventListener("change", function() {
    if (select.value === "submit") {
      window.location = "/newLocation";
    }
  });
 const liquid_choice = document.getElementById('liquid-list');
  for(let i = 0; i < typeList.length; i++) {
    const option = document.createElement('option');
    option.value = typeList[i].type;
    option.textContent = typeList[i].type;
    liquid_choice.appendChild(option);
  }
});
</script>
 </head>
 <body>

 <h1>${header}</h1>
 ${createSidebar()}
 <div class="main">
     <form class="waterEntryForm" action="/addWaterEntry" method="POST">
     <input type="hidden" id="id" name="id" value="${liquid.id}" />
     <div class="form-group">
    
     <label class="form-label" for="liquid-choice">What did you drink?:</label>
     <input list="liquid-list" id="liquid-choice" name="type"
    class="form-control" value="` + liquid.type + `" required pattern="[A-Za-zÄÖÜäöü\\s]+">
     <datalist id="liquid-list">
     </datalist>
     </div>
     <div class="form-group">
     <label class="form-label"  for="amount" >How many drinks did you drink?:</label>
     <input type="number" min="1"  id="amount" name="amount" value="` + liquid.amount + `"  required>
     </div>
     <div class="form-group border">
     <div>How much did you drink?</div>
         <div class="form-check">
         <input type="radio" id="amount300ml" name="ml" value="300"
        class="form-check-input" ` + (!liquid.ml || liquid.ml === 300 ? 'checked' : '') + ` >
         <label class="form-label" for="amount300ml" >Glass 300ml</label>
         </div>
         <div class="form-check">
         <input type="radio" id="amount500ml" name="ml" value="500" class="form-check-input" ` + (liquid.ml === 500 ? 'checked' : '') + `>
         <label class="form-check-label" for="amount500ml">Jug 500ml</label>
         </div>
     </div>
     <div class="form-group">
  <label class="form-label" for="location">Where did you drink?</label>
  <select name="location" id="location" value="${liquid.locations_id}"></select>
</div>
     <button class="save" type="submit">SAVE</button>
    
     </form>
 </div>

 </form>
 </body>
</html>`;
}

function getNewLocationForm(location, error, waterEntryID) {
    if (location === undefined) {
        location = {
            id: '',
            latitude: '',
            longitude: '',
            street: '',
            housenumber: '',
            postalcode: '',
            city: '',
            country: ''
        };
    }
    let header = "Add New Location";

    if (location.id) {
        header = "Edit Location";
    }
    return `<!DOCTYPE html>
<html>
 <head> 
 <title>${header}</title>
 <meta charset="utf-8">
 <link rel="stylesheet" href="/public/css/style.css" />
  <script>
  document.addEventListener('DOMContentLoaded', function() {
       const deleteButton = document.querySelector('.delete');
       const form = document.getElementById('form');
       if(${location.image !== null} && ${location.image !== undefined} && ${location.image !== ''} ){
        let byteCharacters = atob('${location.image}');
        let byteArrays = [];
    
         for (let offset = 0; offset < byteCharacters.length; offset += 512) {
            let slice = byteCharacters.slice(offset, offset + 512);
            let byteNumbers = new Array(slice.length);
    
            for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
            }
    
            let byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
       }
       const file = new File(byteArrays, "*.png", { type: "image/png" });
       const dataTransfer = new DataTransfer();
       dataTransfer.items.add(file);
       form.image.files = dataTransfer.files;
    }
    deleteButton.addEventListener('click', () => {
      document.getElementById("imageEdit").style.display = 'none';
      deleteButton.style.display = 'none';
      const dataTransfer = new DataTransfer();
      form.image.files = dataTransfer.files;
    });

    document.getElementById("image").addEventListener("change", function(event) {
    const reader = new FileReader();
    reader.onload = function(e) {
      document.getElementById("imageEdit").src = e.target.result;
      document.getElementById("imageEdit").style.display = "block";
      deleteButton.style.display = 'block';
    };
    reader.readAsDataURL(event.target.files[0]);
    });
       
    const location = ${JSON.stringify(location)};

    fetch("/public/data/countries.csv")
      .then(response => response.text())
      .then(text => {
        const countries = text.split('\\n');
        const country = location.country === undefined ? '' : location.country;
        const select = document.getElementById('country');
        const option = document.createElement('option');
        option.value = country;
        option.text = country;
        select.appendChild(option);
        countries.forEach(country => {
          const option = document.createElement('option');
          option.value = country;
          option.text = country;
          select.appendChild(option);
        });
      });
  });
  
 
</script>
 </head>
 <body>
 <h1>${header}</h1>
 
${createSidebar()}
    <div class="main">
 <form id="form" class="locationEntryForm" action="/addLocation/${waterEntryID}" method="POST" enctype="multipart/form-data">
 <input type="hidden" id="id" name="id" value="${location.id}">
 ${error ? `<div class="error">${error}</div>` : ''}
 
 <div>
   <div class="form-group">
 <label class="form-label" for="street">Street:</label>
     <input type="text" id="street" name="street" value="${location.street}" required pattern="^[a-zA-ZßöäüÖÄÜ.-\\s]+$"></div>
 
    <div class="form-group">
 <label class="form-label" for="housenumber">Housenumber:</label>
 <input type="text" id="housenumber" name="housenumber" value="${location.housenumber}" required pattern="^[a-z0-9\\s]+$"></div>
 
     <div class="form-group">
 <label class="form-label" for="postalcode">Postal Code:</label>
 <input type="text" id="postalcode" name="postalcode" value="${location.postalcode}" required pattern="\\s?[\\d]+\\s?"></div>
 
     <div class="form-group">
 <label class="form-label" for="city">City:</label>
 <input type="text" id="city" name="city" value="${location.city}" required pattern="^[a-zA-ZßöäüÖÄÜ.-\\s]+$"></div>
 
      <div class="form-group">
 <label class="form-label" for="country">Country:</label>
 <select id="country" name="country" required></select>
 
<!-- <input type="text" id="country" name="country" value="${location.country}" required pattern="^[a-zA-ZßöäüÖÄÜ\\s]+$"></div>-->
 
  <div class="form-group">
   <img class="imageEdit" id="imageEdit" src="data:image/png;base64,${location.image === undefined || location.image === '' ? '' : location.image}" style="display: ${location.image === undefined || location.image === '' ? 'none' : 'block'}" }><button  style="display: ${location.image === undefined || location.image === '' ? 'none' : 'block'}" class="delete" type="button">DELETE</button>
   <input type="file" id="image" name="image" accept="image/png, image/jpeg">
    </div>
   <button class="save" type="submit">SAVE</button>

 </form>
 </div>
 </body>
</html>`;
}

module.exports = {getWaterEntryForm, getNewLocationForm};