var sqlite3 = require('sqlite-async');

const getAll = async (file_path) => {
    try {
        // opens file
        var db = await sqlite3.open(file_path);
        // var db = await sqlite3.open('./db/equipment_loan.db');
        // var db = await sqlite3.open('equipment_loan.db');

        // runs query to get all rows to a list (all dat data)
        var query = await db.all("SELECT * FROM devices");

        var query_result = query;

        // close db (not sure if its good idea to close it everytime or not...)
        db.close();

        return query_result
        // OUTPUT
        // [
        //     {
        //       ID: 'test-id',
        //       date: 'test-date',
        //       zone: 'test-zone',
        //       model: 'test-type',
        //       description: 'test-descript',
        //       fname: 'test-fname',
        //       lname: 'test-lname',
        //       onboarding: 'test-onboarding'
        //     }
        // ]

        // THE PROMISE THING THAT I DONT WANT
        // return await db.then(db => {
        //     db.all("SELECT * FROM devices").then(async (result) => {
        //     //    return await (result);
        //     console.log(result)
        //     return result
        //     })
        // })
    } catch (err) {
        return(`ERROR SEE BELOW\n${err}`);
    }
}

// getAll().then(result => {
//     console.log(result);
// });

const addDevice = async(ID, date, zone, model, description, fname, lname, onboarding) => {
    try {
        // opens file
        var db = await sqlite3.open('./db/equipment_loan.db');
        // var db = await sqlite3.open('equipment_loan.db');

        var list_params = [ID, date, zone, model, description, fname, lname, onboarding];

        // don't want any nulls between ID and date | 100% sure it won't run cause jquery does the rest
        if (ID == null || date == null) {
            db.close();
            return 'ID and date cannot be left empty'
        }

        // runs query to add device info to database
        await db.run(
            "INSERT INTO devices (ID, date, zone, model, description, fname, lname, onboarding) VALUES (?, ?, ?, ?, ?, ?, ?, ?);",
            list_params
            );

        // close db (not sure if its good idea to close it everytime or not...)
        db.close();

        // console.log(`Device ID ${ID} added.`)
        return true
    } catch (err) {
        if (err.code === 'SQLITE_CONSTRAINT') {
            console.log(`Unique ID <${ID}> has already been established. ${err.code}`)
            return false
        }
    }
}
// var test_param = ['test3-id', 'test3-date', 'test3-type', 'test3-model', 'test3-desc', 'test3-fname', 'test3-lname', 'test4-onboarding'];
// // function(...arg) <-- this is a god send, inserts list/array as argument
// addDevice(...test_param).then(result => {
//     console.log(result);
// })

const checkDevice = async(ID) => {
    try {
        // opens file
        var db = await sqlite3.open('./db/equipment_loan.db');
        // var db = await sqlite3.open('equipment_loan.db');

        // runs query to check device exist in database (based on ID)
        var check_device = await db.get(`SELECT ID FROM devices WHERE ID = ?;`, [ID]);

        db.close()

        if (check_device == undefined) {
            return false
        }

        if (check_device.ID == ID) {
            return true
        }

    } catch (err) {
        console.log('err jimmy')
        console.log(err)
        return false
    }
}

// checkDevice('test3-id').then(result => {
//     console.log(result);
// }).catch(err => {
//     console.log(err);
// })

const deleteDevice = async(ID) => {
    try {
        // opens file
        var db = await sqlite3.open('./db/equipment_loan.db');
        // var db = await sqlite3.open('equipment_loan.db'); //for debug

        if (typeof ID == 'object') {
            for (i = 0; i < ID.length; i++) {
                await db.get('DELETE FROM devices WHERE ID = ?;', [ID[i]]);
            }
        } else {
            // runs query to delete device regardless it is in database (based on ID)
            await db.get(`DELETE FROM devices WHERE ID = ?;`, [ID]);
        }

        db.close()

        return true
    } catch (err) {
        console.log('err jimmy')
        console.log(err)
        return false
    }
}

// var test_list = []
// var test_two = ['argh', 'iphone', 'huh']
// var test_string = 'YOSH'

// test_two.pop('argh');

// console.log(test_two)
// requires to check the database itself
// deleteDevice(test_string).then(result => {
//     console.log(result)
// }).catch(err => {
//     console.log(err)
// })

const updateDevice = async(ID, date, zone, model, description, fname, lname, onboarding) => {
    try {
        // opens file
        var db = await sqlite3.open('./db/equipment_loan.db');
        // var db = await sqlite3.open('equipment_loan.db');

        var list_params = [date, zone, model, description, fname, lname, onboarding, ID];

        // query to update the device information
        var update_query = await db.run(
            `UPDATE devices SET date = ?, zone = ?, model = ?, description = ?, fname = ?, lname = ?, onboarding = ? WHERE ID = ?;`,
            list_params
        )

        db.close()
        
        // OUTPUT 0 usually means the ID does not exist in the database
        if (update_query.changes == 0) {
            return `No change in ID: ${ID}`
        } else {
            return `Device Information updated`
        }

    } catch (err) {
        console.log('ERROR JIMMY')
        console.log(err)
        console.log('ERROR JIMMY')
        return err
    }
}

// var test_param = ['tests3-id', 'test3-date', 'test3-type', 'test3-model', 'test3-desc', 'test3-fname', 'test3-lname', 'test4-onboarding'];
// updateDevice(...test_param).then(result => {
//     console.log(result)
// }).catch(err => {
//     console.log(err)
// })

module.exports = {
    getAll,
    addDevice,
    updateDevice,
    checkDevice,
    deleteDevice
}