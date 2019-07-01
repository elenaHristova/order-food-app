const express = require('express')
const path  = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const app = express()
const port = 3001
const mongoPort = 27017

const usersRouter = require('./controller/users.ctrl');
const dishRouter = require('./controller/dish.ctrl');
const orderRouter = require('./controller/order.ctrl');
const MongoClient = require('mongodb').MongoClient;
const rootPath = path.normalize(__dirname);

app.set('app', path.join(rootPath, 'app'));
app.use(logger('dev'));
app.use(bodyParser.json({limit: '20mb'}));

app.use("/api/orders", orderRouter);
app.use("/api/users", usersRouter);
app.use("/api/dishes", dishRouter);

const dburl = 'mongodb://localhost:27017/order-food-app';

MongoClient.connect(dburl, { useNewUrlParser: true }).then( db => {
    // if (err) throw err;
    console.log("Database connected!");
    var dbo = db.db("order-food-app");
    app.locals.db = dbo;
    app.listen( port, err => {
        if(err) throw err;
        console.log(`Order food API is listening on port ${port}`);
    });
}).catch(err => { 
    console.error("Error: MongoDB not available. Check that it is started on port 27017.")
    throw err;
});

process.on('unhandledRejection', err => {
  throw err;
});