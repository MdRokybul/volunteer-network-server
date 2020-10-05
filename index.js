const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.94gfj.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());


client.connect(err => {
    const event = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_EVENT_COLLECTION}`);
    const volunteer = client.db(`${process.env.DB_VOLUNTEER_NAME}`).collection(`${process.env.DB_VOLUNTEER_COLLECTION}`);

    

    app.delete('/deleteVolunteer/:id', (req, res) => {
        console.log(req.params.id);
        volunteer.deleteOne({_id: ObjectId(req.params.id)})
        .then(result => {
            console.log(result);
        })
    })

    app.get('/eventlist', (req, res) => {
        event.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
    })
    app.get('/volunteer', (req, res) => {
        // console.log(req.query.email)
        volunteer.find({email: req.query.email})
        .toArray((err, documents) => {
            res.send(documents);
        })
    })

    app.post('/addEvent', (req, res) => {
        const events = req.body;
        event.insertOne(events)
        .then(result => {
            res.send(result.insertedCount > 0)
        })
    })

    app.get('/volunteerlist', (req, res) => {
        volunteer.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
    })
  
    app.post('/addVolunteer', (req, res) => {
        const user = req.body;
        volunteer.insertOne(user)
        .then(result => {
            res.send(result.insertedCount > 0)
        })
    })

});


app.listen(5000)