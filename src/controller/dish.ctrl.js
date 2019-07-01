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
    db.collection('dishes').find().toArray().then(dishes => {
        res.json(dishes.map(dish => replaceId(dish)));
    });
});

router.get('/:id', function(req, res) {
    const params = req.params;
    const db = req.app.locals.db;
    indicative.validate(params, { id: 'required|regex:^[0-9a-f]{24}$' })
        .then(() => {
            db.collection('dishes').findOne({_id: new ObjectID(params.id)})
            .then(dish => {
                if(dish) {
                    replaceId(dish);
                    res.json(dish);
                } else {
                    error(req, res, 404, `Invalid dish ID: ${params.id}`)
                }
            })
            .catch((err) => console.log(err));
        }).catch(err => error(req, res, 404, 
            `Invalid dish ID: ${params.id}. Id should have 24 hexadecimal characters.`, err));
});

router.post('/', (req, res) => {
    const db = req.app.locals.db;
    const dish = req.body;
    indicative.validate(dish, {
        name: 'required|max:256',
        description: 'required|max:256',
        type: 'in:salad,pasta,pizza,dessert,drink',
        price: 'required|number',
    })
    .then(dish => {
        console.log("Inserting dish: ", dish);
        db.collection('dishes').insertOne(dish).then(result => {
            if(result.result.ok && result.insertedCount === 1) {
                replaceId(dish);
                const uri = req.baseUrl + '/' + dish._id
                res.location(uri).status(201).json(dish);
            }
        });
    }).catch(err => error(req, res, 400, 
        `Invalid dish: ${util.inspect(err)}`, err));
});

router.put('/:id', (req, res) => {
    const db = req.app.locals.db;
    const params = req.params;
    const dish = req.body;
    if(params.id !== dish.id) {
        error(req, res, 404, `Dish ID does not match: ${params.id} vs. ${order.id} `)
    }
    indicative.validate(dish, 
        {   
            id: 'required|regex:^[0-9a-f]{24}$',
            name: 'required|max:256',
            description: 'required|max:256',
            type: 'in:salad,pasta,pizza,dessert,drink',
            price: 'required|number',
     })
    .then(dish => {
        console.log("Inserting dish: ", dish);
        dish._id = new ObjectID(dish.id);
        delete (dish.id);
        db.collection('dishes').updateOne({ _id: dish._id }, {"$set": dish} )
        .then(result => {
            console.log("Dish to insert: ", dish);
            if(result.result.ok && result.modifiedCount === 1) {
                replaceId(dish);
                res.status(200).json(dish);
            }
        });
    }).catch(err => error(req, res, 400, 
        `Invalid dish: ${util.inspect(err)}`, err));
});

router.delete('/:id', function(req, res) {
    const params = req.params;
    const db = req.app.locals.db;
    indicative.validate(params, { id: 'required|regex:^[0-9a-f]{24}$' })
        .then(() => {
            db.collection('dishes').findOneAndDelete({_id: new ObjectID(params.id)})
            .then(({ value }) => {
                if(value) {
                    replaceId(value);
                    res.json(value);
                } else {
                    error(req, res, 404, `Invalid dish ID: ${params.id}`)
                }
            });
        }).catch(err => error(req, res, 404, 
            `Invalid dish ID: ${params.id}. Id should have 24 hexadecimal characters.`, err));
});

module.exports = router;