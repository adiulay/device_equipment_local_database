const { app, BrowserWindow, Menu, screen, dialog } = require('electron')
const server = require('./app.js')
const file_function = require('./db/file_function.js')
const fs = require('fs')

app.on('ready', function() {
    // grabs screen display
    const { width, height } = screen.getPrimaryDisplay().size

    mainWindow = new BrowserWindow({
        title: "NRC Device Equipment",
        nodeIntegration: true,
        width: width/1.2,
        height: height/1.2
    });
    // mainWindow.maximize();
    mainWindow.loadURL('http://localhost:3000');
    // mainWindow.focus();

    //menu template!
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    Menu.setApplicationMenu(mainMenu)
});

// opens the device option window
function newWindow(keyword, title) {
    addWindow = new BrowserWindow({
        autoHideMenuBar: true,
        title: title,
        width: 600,
        height: 650,
        nodeIntegration: true
    });

    addWindow.loadURL(`http://localhost:3000/${keyword}`);
    addWindow.focus();

    // get rid of memory to save space
    addWindow.on('close', function(){
        addWindow = null;

        // reloads main window, nifty!
        mainWindow.reload();
    });
}

// standard template to add/edit/delete
const mainMenuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Save As...',
                click: async function click() {
                    var options = {
                        filters: [
                            {
                                name: 'CSV', extensions: ['csv']
                            }
                        ]
                    }

                    var temp_path = await dialog.showSaveDialog(options)

                    var field_list = ['ID', 'date', 'model', 'description', 'fname', 'lname', 'onboarding'];

                    var save_file = await file_function.toCSV(`${__dirname}/db/equipment_loan.db`, field_list, temp_path['filePath']);

                    // TODO show dialog here
                    console.log(save_file)
                }
            }
        ]
    },
    {
        label: 'Add Device',
        click(){newWindow('addDevice', 'Add Device');}
    },
    {
        label: 'Edit Device',
        click(){newWindow('editDevice', 'Edit Device')}
    },
    {
        label: 'Options',
        submenu: [
            { role: 'toggledevtools' },
            { role: 'reload' },
            { role: 'quit' },
        ]
    }
];