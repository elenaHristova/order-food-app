const express = require('express');
const mongodb = require('mongodb');
const indicative = require('indicative');
const error = require('./helpers').error;
const replaceId = require('./helpers').replaceId;
const getCurrentTime = require('./helpers').getCurrentTime;
const util = require('util');
const router = express.Router();
const ObjectID = mongodb.ObjectID;


router.get('/caterers', function(req, res) {
    const db = req.app.locals.db;
    db.collection('users').find({ role: 'caterer' }).toArray().then(caterers => {
        res.json(caterers.map(caterer => replaceId(caterer)));                  
    }).catch((err) => console.log(err));
});


router.get('/special', function(req, res) {
    const db = req.app.locals.db;
    db.collection('users').find({ role: { $in: ['caterer', 'personel', 'admin'] } }).toArray().then(caterers => {
        res.json(caterers.map(caterer => replaceId(caterer)));                  
    }).catch((err) => console.log(err));
});

router.get("/", function(req, res) {
    const db = req.app.locals.db;
    db.collection('users').find().toArray().then(users => {
        res.json(users.map(a => replaceId(a)));
    });
});

router.post("/login", function(req, res) {
    const userData = req.body;
    const db = req.app.locals.db;
    db.collection('users').findOne({ username: userData.username, password: userData.password}).then(user => {
        res.json(user);
    });
});

router.get('/:id', function(req, res) {
    const params = req.params;
    const db = req.app.locals.db;
    indicative.validate(params, { id: 'required|regex:^[0-9a-f]{24}$' })
        .then(() => {
            db.collection('users').findOne({_id: new ObjectID(params.id)})
            .then(user => {
                if(user) {
                    replaceId(user);
                    res.json(user);
                } else {
                    error(req, res, 404, `Invalid user ID: ${params.id}`)
                }
            })
            .catch((err) => console.log(err));
        }).catch(err => error(req, res, 404, 
            `Invalid user ID: ${params.id}. Id should have 24 hexadecimal characters.`, err));
});

router.post('/', (req, res) => {
    const db = req.app.locals.db;
    const user = req.body;
    indicative.validate(user, 
        { 
            name: 'required|string',
            username: 'required|string|max:15',
            password: "required",
            gender: 'in:male,female',
            role: 'in:user,admin,personel,caterer',
     })
    .then(user => {
        console.log("Inserting user: ", user);
        db.collection('users').findOne({username: user.username})
            .then(user => {
                if(user) {
                    replaceId(user);
                    res.json({ error: "A user with this username already exists!" });
                } else {
                    user = req.body;
                    db.collection('users').insertOne(user).then(result => {
                        if(result.result.ok && result.insertedCount === 1) {
                            replaceId(user);
                            const uri = req.baseUrl + '/' + user._id
                            res.location(uri).status(201).json(user);
                        }
                    });  
                }
            })
            .catch((err) => console.log(err));   
    }).catch(err => error(req, res, 400, 
        `Invalid user: ${util.inspect(err)}`, err));
});

router.put('/:id', (req, res) => {
    const db = req.app.locals.db;
    const params = req.params;
    const user = req.body;
    if(params.id !== user.id) {
        error(req, res, 404, `User ID does not match: ${params.id} vs. ${user.id} `)
    }
    indicative.validate(user, 
        {   
            id: 'required|regex:^[0-9a-f]{24}$',
            name: 'required|string',
            username: 'required|string|max:15',
            password: "required",
            gender: 'in:male,female',
            role: 'in:user,admin,personel,caterer',
        }
    )
    .then(user => {
        console.log("Inserting user: ", user);
        user._id = new ObjectID(user.id);
        delete (user.id);
        db.collection('users').updateOne({ _id: user._id }, {"$set": user} )
        .then(result => {
            console.log("User to insert: ", user);
            if(result.result.ok && result.modifiedCount === 1) {
                replaceId(user);
                res.status(200).json(user);
            }
        });
    }).catch(err => error(req, res, 400, 
        `Invalid user: ${util.inspect(err)}`, err));
});

router.delete('/:id', function(req, res) {
    const params = req.params;
    const db = req.app.locals.db;
    indicative.validate(params, { id: 'required|regex:^[0-9a-f]{24}$' })
        .then(() => {
            db.collection('orders').remove( 
                { userId: params.id}
            );
            db.collection('users').findOneAndDelete({_id: new ObjectID(params.id)})
            .then(({ value }) => {
                if(value) {
                    replaceId(value);
                    res.json(value);
                } else {
                    error(req, res, 404, `Invalid user ID: ${params.id}`)
                }
            });
        }).catch(err => error(req, res, 404, 
            `Invalid user ID: ${params.id}. Id should have 24 hexadecimal characters.`, err));
});

module.exports = router;