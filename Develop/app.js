// Dependencies
const express = require("express");
const path = require("path");
const fs = require("fs");

// Create express app and set port
const app = express();
const PORT = 3002;

// Middleware to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

const dbPath = path.join(__dirname, "/db/db.json");

// HTML Routes
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

// API Routes
app.get("/api/notes", function(req, res) {
    fs.readFile(dbPath, "utf8", (err, data) => {
        if (err) throw err;
        const json = JSON.parse(data);
        res.status(200).json(json);
    });
});

app.post("/api/notes", function(req, res) {
    const newNote = {
        id: Date.now(),
        title: req.body.title,
        text: req.body.text
    };

    const data = fs.readFileSync(dbPath, "utf8");
    let obj = JSON.parse(data);
    obj.push(newNote);
    let objString = JSON.stringify(obj, null, 2);
    
    fs.writeFile(dbPath, objString, "utf8", err => {
        if (err) throw err;
        console.log("Note has been added to db!");
    });
});

app.delete("/api/notes/:id", function(req, res) {
    const idToDelete = req.params.id;

    const data = fs.readFileSync(dbPath, "utf8");
    console.log(data);
    let obj = JSON.parse(data);
    let objWithoutDeletedID = obj.filter(note => { return note.id != idToDelete });
    let objString = JSON.stringify(objWithoutDeletedID, null, 2);

    fs.writeFile(dbPath, objString, "utf8", err => {
        if (err) throw err;
        console.log(`Note with id ${idToDelete} has been deleted.`);
    });
});

// Set server to listen
app.listen(PORT, () => {
    console.log("App listening to port " + PORT);
});