const express = require('express');
const mongodb = require('mongodb');
const indicative = require('indicative');
const error = require('./helpers').error;
const replaceId = require('./helpers').replaceId;
const getCurrentTime = require('./helpers').getCurrentTime;
const util = require('util');
const router = express.Router();
const ObjectID = mongodb.ObjectID;


router.get("/", function(req, res) {
    const db = req.app.locals.db;
    db.collection('orders').find().toArray().then(orders => {
        res.json(orders.map(order=> replaceId(order)));
    });
});

router.get('/:id', function(req, res) {
    const params = req.params;
    const db = req.app.locals.db;
    indicative.validate(params, { id: 'required|regex:^[0-9a-f]{24}$' })
        .then(() => {
            db.collection('orders').findOne({_id: new ObjectID(params.id)})
            .then(order => {
                if(order) {
                    replaceId(order);
                    res.json(order);
                } else {
                    error(req, res, 404, `Invalid order ID: ${params.id}`)
                }
            })
            .catch((err) => console.log(err));
        }).catch(err => error(req, res, 404, 
            `Invalid order ID: ${params.id}. Id should have 24 hexadecimal characters.`, err));
});


router.get('/caterer/:id', function(req, res) {
    const params = req.params;
    const db = req.app.locals.db;
    indicative.validate(params, { id: 'required|regex:^[0-9a-f]{24}$' })
        .then(() => {
            db.collection('orders').find({ catererId: params.id, status: { $in: [2, 3] } }).toArray()
            .then(orders => {
                res.json(orders.map(order => replaceId(order)));
            })
            .catch((err) => console.log(err));
        }).catch(err => error(req, res, 404, 
            `Invalid caterer ID: ${params.id}. Id should have 24 hexadecimal characters.`, err));
});

router.get('/user/:id', function(req, res) {
    const params = req.params;
    const db = req.app.locals.db;
    indicative.validate(params, { id: 'required|regex:^[0-9a-f]{24}$' })
        .then(() => {
            db.collection('orders').find({ userId: params.id}).toArray()
            .then(orders => {
                res.json(orders.map(order => replaceId(order)));
            })
            .catch((err) => console.log(err));
    }).catch(err => error(req, res, 404, 
            `Invalid user ID: ${params.id}. Id should have 24 hexadecimal characters.`, err));
});

router.post('/', (req, res) => {
    const db = req.app.locals.db;
    const order = req.body;
    indicative.validate(order, {
        userId: 'required|regex:^[0-9a-f]{24}$',
        description: 'required|max:256',
        price: 'required',
    })
    .then(order => {
        order.status = 0;
        order.time = getCurrentTime();
        console.log("Inserting order: ", order);
        db.collection('orders').insertOne(order).then(result => {
            if(result.result.ok && result.insertedCount === 1) {
                replaceId(order);
                const uri = req.baseUrl + '/' + order._id
                res.location(uri).status(201).json(order);
            }
        });
    }).catch(err => error(req, res, 400, 
        `Invalid order: ${util.inspect(err)}`, err));
});

router.put('/:id', (req, res) => {
    const db = req.app.locals.db;
    const params = req.params;
    const order = req.body;
    if(params.id !== order.id) {
        error(req, res, 404, `Order ID does not match: ${params.id} vs. ${order.id} `)
    }
    indicative.validate(order, 
        {   
            id: 'required|regex:^[0-9a-f]{24}$',
     })
    .then(order => {
        console.log("Inserting order: ", order);
        order._id = new ObjectID(order.id);
        delete (order.id);
        db.collection('orders').updateOne({ _id: order._id }, {"$set": order} )
        .then(result => {
            console.log("Order to insert: ", order);
            if(result.result.ok && result.modifiedCount === 1) {
                replaceId(order);
                res.status(200).json(order);
            }
        });
    }).catch(err => error(req, res, 400, 
        `Invalid order: ${util.inspect(err)}`, err));
});

router.put('/:id/:catererId', (req, res) => {
    const db = req.app.locals.db;
    const params = req.params;
    const order = req.body;
    if(params.id !== order.id) {
        error(req, res, 404, `Order ID does not match: ${params.id} vs. ${order.id} `)
    }
    indicative.validate(order, 
        {   
            id: 'required|regex:^[0-9a-f]{24}$',
            catererId: 'regex:^[0-9a-f]{24}$',
     })
    .then(order => {
        console.log("Inserting order: ", order);
        order._id = new ObjectID(order.id);
        delete (order.id);
        db.collection('orders').updateOne({ _id: order._id }, {"$set": order} )
        .then(result => {
            console.log("Order to insert: ", order);
            if(result.result.ok && result.modifiedCount === 1) {
                replaceId(order);
                res.status(200).json(order);
            }
        });
    }).catch(err => error(req, res, 400, 
        `Invalid order: ${util.inspect(err)}`, err));
});

module.exports = router;