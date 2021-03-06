/* eslint-disable prefer-destructuring */
/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
import {
  app,
  BrowserWindow,
  Menu,
  dialog,
  ipcMain
} from 'electron';
const settings = require('electron-settings');
app.allowRendererProcessReuse = true;
const path = require('path')
const fs = require("fs");
const probe = require('probe-image-size');

/**
 * Set `__static` path to static files in production
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = path.join(__dirname, '/static').replace(/\\/g, '\\\\') // eslint-disable-line
}

let mainWindow;
let testWindow;
const winURL = process.env.NODE_ENV === 'development' ?
  'http://localhost:9080' :
  `file://${__dirname}/index.html`;

const isMac = process.platform === 'darwin';

// Parse Map
function parseMap (map) {
  let parsed;
  try {
    parsed = JSON.parse(map);
  } catch(e) {
    console.log(e);
  }
  return parsed;
}


// Init
function init() {

  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    title: 'NotEditor - New Map',
    useContentSize: true,
    width: 1000,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  mainWindow.loadURL(winURL);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  /**
   * Parse Settings
   */

  // Get local settings config
  ipcMain.on('requestSettings', (event, k) => {
    // Get App path
    const basePath = app.getAppPath();
    mainWindow.webContents.send('updatePath', basePath);

    if (settings.has('modelsPath')) {
      mainWindow.webContents.send('updateSetting', {
        key: 'modelsPath',
        value: settings.get('modelsPath')
      });
    }
    if (settings.has('texturesPath')) {
      mainWindow.webContents.send('updateSetting', {
        key: 'texturesPath',
        value: settings.get('texturesPath')
      });
    }
  });

  // Directory setting changed
  ipcMain.on('updateSetting', (event, k) => {
    const dir = dialog.showOpenDialogSync(mainWindow, {
      properties: ['openDirectory']
    });
    if (dir && dir.length) {
      mainWindow.webContents.send('updateSetting', {
        key: k,
        value: dir[0]
      });
      settings.set(k, dir[0]);
    }
  });

  // Update Textures
  ipcMain.on('getTextures', (event, dir) => {
    if (!fs.existsSync(dir)){
      console.log("Invalid directory");
      return;
    }
    const files = fs.readdir(dir, (err, files) => {
      if (err) {
        console.log(err);
      }
      const results = [];
      files.forEach((file) => {
        if (file.indexOf('.png') >= 0) {
          const d = fs.readFileSync(path.join(dir, file));
          const img = probe.sync(d);
          const b = Buffer.from(d, 'binary').toString('base64');
          const s = `data:image/png;base64,${b}`;
          results.push({
            name: file.replace('.png',''),
            data: s,
            meta: img 
          });
        }
      });
      mainWindow.webContents.send('updateTextures', results);
    });
  });

  // Update Models
  ipcMain.on('getModels', (event, dir) => {
    if (!fs.existsSync(dir)){
      console.log("Invalid directory");
      return;
    }
    const files = fs.readdir(dir, (err, files) => {
      if (err) {
        console.log(err);
      }
      const results = [];
      files.forEach((file) => {
        if (file.indexOf('.obj') >= 0) {
          const result = {
            name: file.replace('.obj',''),
            data: null,
            material: null
          }
          const d = fs.readFileSync(path.join(dir, file));
          const b = Buffer.from(d, 'binary').toString('base64');
          const s = `data:text/plain;base64,${b}`;
          const mtl = file;
          mtl.replace('.obj','.mtl');
          const mtlPath = path.join(dir, mtl);
          if (fs.existsSync(mtlPath)){
            const m = fs.readFileSync(mtlPath);
            const mb = Buffer.from(m, 'binary').toString('base64');
            const ms = `data:text/plain;base64,${mb}`;
            result.material = ms;
          }
          result.data = s;
          results.push(result);
        }
      });
      mainWindow.webContents.send('updateModels', results);
    });
  });

  let lastLoaded = null;
  ipcMain.on('saveMap', (event, map) => {
    if (map) {
      const parse = parseMap(map);
      const result = dialog.showSaveDialogSync(mainWindow, {
        title: 'Save Map',
        defaultPath: lastLoaded || `/${parse.title}.json`,
        buttonLabel: 'Save Map'
      });
      if (result && result.length) {
        fs.writeFile(result, map, (err, r) => {
          if (err) throw err;
        });
        if (!lastLoaded) {
          lastLoaded = result;
        }
      }
    } else {
      console.log('No map data.')
    }
  });

  ipcMain.on('testReady', (event, data) => {
    if (data) {
      testWindow.webContents.send('mapData',data);
    } else {
      console.log('No map data.')
    }
  });


  /**
   * Menu Options
   */

  const template = [
    // { role: 'appMenu' }
    ...(isMac ? [{
      label: app.name,
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideothers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    }] : []),
    {
      label: 'File',
      submenu: [{
          role: '',
          label: 'New Map',
          click: () => {
            mainWindow.webContents.send('newMap', true);
            lastLoaded = false;
          }
        },
        {
          role: '',
          label: 'Load Map',
          click: () => {
            const result = dialog.showOpenDialogSync(mainWindow, {
              properties: ['openFile']
            });
            if (result && result.length) {
              fs.readFile(result[0], (err, data) => {
                if (err) throw err;
                mainWindow.webContents.send('loadMap', parseMap(data));
                lastLoaded = result[0];
              });
            }
          }
        },
        { type: 'separator' },
        {
          role: '',
          label: 'Save Map',
          click: () => {
            mainWindow.webContents.send('requestSave');
          }
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [{
          role: '',
          label: 'Undo',
          click: () => {
            mainWindow.webContents.send('undo', true);
          }
        },
        {
          role: '',
          label: 'Redo',
          click: () => {
            mainWindow.webContents.send('redo', true);
          }
        },
        { type: 'separator' },
        {
          role: '',
          label: 'Copy',
          click: () => {
          // copy
          }
        }
      ]
    },
    {
      label: 'Physics',
      submenu: [{
          role: '',
          label: 'Start Test',
          enabled: true,
          click: (item) => {
            item.enabled = false;
            const modalPath = process.env.NODE_ENV === 'development'
            ? 'http://localhost:9080/#/test'
            : `file://${__dirname}/index.html#test`
            testWindow = new BrowserWindow({
              title: 'NotEditor - Test',
              useContentSize: true,
              width: 800,
              height: 600,
              webPreferences: {
                nodeIntegration: true
              }
            });
            testWindow.webContents.once('dom-ready', () => {
              mainWindow.webContents.send('startTest');
            });
            testWindow.on('close', () => { testWindow = null; item.enabled = true;});
            testWindow.loadURL(modalPath);
          }
        }]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

}

/**
 * App Events
*/

app.on('ready', init);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    init();
  }
});