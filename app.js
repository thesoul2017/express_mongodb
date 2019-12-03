const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const objectId = require("mongodb").ObjectID;

const app = express();
const jsonParser = express.json();

const uri = "mongodb+srv://root:1234@cluster0-m3cd3.mongodb.net/test?retryWrites=true&w=majority";
const mongoClient = new MongoClient(uri, { useUnifiedTopology: true });

let dbClient;

app.use(express.static(__dirname + "/public"));

mongoClient.connect(function (err, client) {
    if (err) return console.log(err);
    dbClient = client;
    app.locals.collection = client.db("heroes_list").collection("heroes");
    app.listen(3000, function () {
        console.log("Wait connect...");
    });
});

app.get("/api/heroes", function (req, res) {

    const collection = req.app.locals.collection;
    collection.find({}).toArray(function (err, heroes) {

        if (err) return console.log(err);
        res.send(heroes)
    });
});

app.get("/api/heroes/:id", function (req, res) {

    const id = new objectId(req.params.id);
    console.log("get");
    const collection = req.app.locals.collection;
    collection.findOne({ _id: id }, function (err, hero) {

        if (err) return console.log(err);
        res.send(hero);
    });
});

app.post("/api/heroes", jsonParser, function (req, res) {

    if (!req.body) return res.sendStatus(400);

    console.log("post");
    const heroName = req.body.name;
    const heroPower = req.body.power;
    const hero = { name: heroName, power: heroPower };

    const collection = req.app.locals.collection;
    collection.insertOne(hero, function (err, result) {

        if (err) return console.log(err);
        res.send(hero);
    });
});

app.put("/api/heroes", jsonParser, function (req, res) {

    if (!req.body) return res.sendStatus(400);
    const id = new objectId(req.body.id);
    console.log("put");
    const heroName = req.body.name;
    const heroPower = req.body.power;

    const collection = req.app.locals.collection;
    collection.findOneAndUpdate({ _id: id }, { $set: { power: heroPower, name: heroName } },
        { returnOriginal: false }, function (err, result) {

            if (err) return console.log(err);
            const hero = result.value;
            res.send(hero);
        });
});

app.delete("/api/heroes/:id", function (req, res) {

    const id = new objectId(req.params.id);
    const collection = req.app.locals.collection;
    console.log("delete " + id);
    collection.findOneAndDelete({ _id: id }, function (err, result) {

        if (err) return console.log(err);
        let hero = result.value;
        res.send(hero);
    });
});

process.on("SIGINT", () => {
    dbClient.close();
    process.exit();
});