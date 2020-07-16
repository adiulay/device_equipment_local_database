const fs = require('fs')
const db_query = require('./db.js');
const { parse } = require('json2csv');

// db_query.getAll(`${__dirname}/equipment_loan.db`).then(re => {
//     console.log(re);
// })

const toCSV = async(path_file, fields, filename) => {

    try {
        // grabs query from database
        var my_data = await db_query.getAll(path_file);

        // provides name for fields
        var opts = { fields };

        // parse to csv
        var csv = parse(my_data, opts);

        // write it as csv in designated path
        fs.writeFile(filename, csv, (error) => {
            if (error) {
                console.log('error from writeFile')
                // console.log(error)

                if (error.code == 'EBUSY') {
                    console.log(`File currently opened in ${filename}`)
                    return false
                }
            }
        })

        return true

    } catch (e) {
        console.log('Error has occurred')
        console.log(e)

        return false
    }

}

// var field_list = ['ID', 'date', 'model', 'description', 'fname', 'lname', 'onboarding'];

// toCSV(`${__dirname}/equipment_loan.db`, field_list, 'life').then(re => {
//     console.log(re)
// })

module.exports = {
    toCSV
}