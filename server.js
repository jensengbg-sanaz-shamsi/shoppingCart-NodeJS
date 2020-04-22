const lowdb = require('lowdb');
const express = require('express');
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('database.json')
const db = lowdb(adapter)
const app = express();
const routs = require('./modules/route');
routs(app , db);


app.listen(3000);
console.log('Server Started!!!');
