const express = require("express")
const formidable = require("formidable");
const db = require('./database')
const {getWaterEntriesList, getAllLocations} = require("./views/overview");
const router = express.Router();
const form = new formidable.IncomingForm();
const getDetailLocation = require("./views/details");
const path = require("path");
const {getLocationByID} = require("./database");
const {getWaterEntryForm} = require("./views/form")

router.use("/static", express.static('public'));

router.get("/", (req, res) => {
    res.redirect('/waterEntries')
});

// ---------------------------- //
//         Watertracking        //
// ---------------------------- //
router.get("/editWaterEntry/:id", (req, res) => {
    db.getWaterEntryByID(req.params.id).then(
        liquid => {
            res.send(getWaterEntryForm(liquid))
        },
        error => {
            console.log("ERROR")
        }
    )

});
router.get("/removeWaterEntry/:id", (req, res) => {
    db.removeWaterEntry(req.params.id).then(
        liquids => {
            res.redirect('/waterEntries')
        },
        error => {
            console.log("ERROR")
        }
    )
});
router.get("/newWaterEntry", (req, res) => {
    res.send(getWaterEntryForm())
});
router.post("/addWaterEntry", (req, res) => {
    const form = new formidable.IncomingForm();
    const requiredFields = ["type", "ml"];
    form.on('field', function (name, value) {

        if (requiredFields.indexOf(name) > -1 && !value) {
            form._error('Required field is empty!');
        }

        if (name === "type") {
            const regex = /^[a-zA-Z\s]+$/;
            if (regex.test(value) === false) {
                form._error('Only text allowed!');
            }
        }

        if (name === "ml") {
            if (value > 500) {
                form._error('Please select 500ml or lower!');
            }
        }
    });

    form.parse(req, (err, liquid, files) => {

        if (err) {
            res.send('getError(err)')
            return
        }

        console.log()
        db.addWaterEntry(liquid).then(
            liquid => {
                res.writeHead(302, {
                    location: '/waterentries', 'content-type':
                        'text/plain'
                });
                res.end('302 Redirecting to /waterentries');
            },
            error => res.send("error")
        );
    });

});
router.get("/waterentries", (req, res) => {
    db.getAllWaterEntries().then(
        liquids => {
            res.send(getWaterEntriesList(liquids))
        },
        error => {
            console.log("ERROR")
        }
    )
});

// ---------------------------- //
//         Locations            //
// ---------------------------- //
router.get("/locations", (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    db.getAllLocations().then(
        locations => {
            res.status(200).send(getAllLocations(locations));
        },
        error => {
            console.log("Error", error);
        }
    );
});
router.get("/newLocation", (req, res) => {
});
router.get("/addLocation", (req, res) => {
    db.addLocation(location);
});
router.get("/editLocation:id", (req, res) => {
    //TODO implement updateLocation
});
router.get("/deleteLocation/:id", (req, res) => {
    const id = parseInt(req.params.id, 10);
    db.removeLocation(id).then(
        location => {
            res.writeHead(302, {location: '/locations', 'content-type': 'text/plain'});
            res.end('302 Redirecting to /locations');
        },
        error => {
            console.log("Error Remove", error);
        }
    );
});
router.get("/detailLocation/:id", (req, res) => {
    const id = parseInt(req.params.id, 10);
    db.getLocationByID(id).then(
        location => {
            res.status(200).send(getDetailLocation(location));
        },
        error => res.send("error")
    );
});
router.get("/public/images/:image", (req, res) => {
    const image = req.params.image;
    res.sendFile(path.join(__dirname, 'public/images/' + image));
});
router.get("/public/css/:stylesheet", (req, res) => {
    const stylesheet = req.params.stylesheet;
    res.sendFile(path.join(__dirname, 'public', 'css', stylesheet));
});
router.get("/search", (req, res) => {
    const query = req.query.q;
    db.searchLocations(query).then(
        locations => {
            res.status(200).send(getAllLocations(locations));
        },
        error => {
            console.log("Error", error);
        }
    );
});


module.exports = router;