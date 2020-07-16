const express = require('express');
const app = express();

// sqlite3 db_query functions
const db_query = require('./db/db.js');

// sets the default folder for views (stores all html content)
// __dirname shows current full path
app.set('views', __dirname + '/views');

// sets default engine to html, utilizing ejs for dynamic page
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// these are static files used for CSS or JQUERY or JS
app.use('/bootstrap-js', express.static(__dirname + '/bootstrap-4.5.0-dist/js'));
app.use('/bootstrap-css', express.static(__dirname + '/bootstrap-4.5.0-dist/css'));
app.use('/jquery', express.static(__dirname + '/js/jquery/'));
app.use('/jquery-ui', express.static(__dirname + '/js/jquery/jquery-ui-1.12.1'));
app.use('/css', express.static(__dirname + '/css'));

// default homepage
app.get('/', async(req, res) => {
    // returns from db.js a list of device with info in them
    var get_devices = await db_query.getAll(`${__dirname}/db/equipment_loan.db`);

    res.render('index.html', {
        name: 'Jimmy Truong',
        device_id: get_devices
    })
})

app.get('/addDevice', (req, res) => {
    res.render('device_form.html', {
        type: 'Add Device',
        submit_type: 'Submit'
    })
})

// app.post('/addDevice/:id/:zone/:model/:fname/:lname/:onboarding', (req, res) => {
app.post('/addDevice/:id', async(req, res) => {
    // console.log('params');
    // console.log(req.params);
    // console.log('query');
    // console.log(req.query);

    // parse converts string to json
    var deviceData = JSON.parse(req.query.dataDevice);

    // add device to db (customized function)
    var runQuery = await db_query.addDevice(
        deviceData.id,
        deviceData.date,
        deviceData.zone,
        deviceData.model,
        deviceData.description,
        deviceData.fname,
        deviceData.lname,
        deviceData.onboarding
    )
    
    if (runQuery == true) {
        console.log("Device Information added")
        res.sendStatus(200);
    } else {
        res.sendStatus(500);
    }
    
})

app.get('/editDevice', (req, res) => {
    res.render('device_form.html', {
        type: 'Edit Device',
        submit_type: 'Update'
    })
})

// app.post('/editDevice/:id/:zone/:model/:fname/:lname/:onboarding', (req, res) => {
app.post('/editDevice/:id/', async(req, res) => {
    // console.log('params');
    // console.log(req.params);
    // console.log('query');
    // console.log(req.query);

    // placeholder
    var statusUpdate = true

    // convert string to object
    var newData = JSON.parse(req.query.dataDevice);

    var checkQuery = await db_query.checkDevice(newData.id);

    if (checkQuery == true) {
        var qu = await db_query.updateDevice(
            newData.id,
            newData.date,
            newData.zone,
            newData.model,
            newData.description,
            newData.fname,
            newData.lname,
            newData.onboarding
        )
        console.log(qu)
    } else {
        console.log(`Device ID ${newData.id} not found in database APP.JS`)
        statusUpdate = false
    }

    if (statusUpdate == true) {
        res.sendStatus(200);
    } else {
        res.sendStatus(501);
    }
})

app.post('/deleteDevice/', async(req, res) => {
    // console.log('query')
    // console.log(req.query)

    // must parse because its a string
    var id = JSON.parse(req.query.id)
    // console.log(id[0])

    for (i = 0; i < id[0].length; i++) {
        var checkQuery = await db_query.checkDevice(id[0][i]);
        // console.log(checkQuery)
        if (checkQuery == false) {
            res.sendStatus(500);
        } else {
            await db_query.deleteDevice(id[0][i]);
     
            console.log(`${id[0][i]} deleted from database`);
        }
    }

    res.sendStatus(200);
})

app.listen(3000, function() {
    console.log('server is now running!');
})