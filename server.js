const express = require("express");
const app = express();
const path = require("path");
const db = require("./db");
const morgan = require("morgan");
const bodyParser = require("body-parser");

app.use(
	morgan(":method :url :status :res[content-length] - :response-time ms")
);

app.use(bodyParser.json());

app.get("/", (req, res, next) => {
	res.sendFile(path.join(__dirname, "index.html"));
});

//Additional routes here
//GET, POST, DELETE for /api/users

app.get("/api/users", (req, res, next) => {
	db.getUsers().then(response => res.send(response));
});

app.post("/api/users", (req, res, next) => {
	db.createUser(req.body.name).then(response => res.send(response));
});

app.delete("/api/users/:id", (req, res, next) => {
	console.log(req.params.id);
	db.destroyUser(req.param.id).then(() => res.sendStatus(200));
});

//GET, POST, DELETE for /api/things
app.get("/api/things", (req, res, next) => {
	db.getThings().then(response => res.send(response));
});

app.post("/api/things", (req, res, next) => {
	db.createThing(req.body.name).then(response => res.send(response));
});
app.delete("/api/things", (req, res, next) => {});
//GET, POST, DELETE for /api/user_things
app.get("/api/user_things", (req, res, next) => {});

app.post("/api/user_things", (req, res, next) => {});
app.delete("/api/user_things", (req, res, next) => {});

app.use((req, res, next) => {
	next({
		status: 404,
		message: `Page not found for ${req.method} ${req.url}`
	});
});

app.use((err, req, res, next) => {
	res.status(err.status || 500).send({
		message: err.message || JSON.stringify(err)
	});
});

const port = process.env.PORT || 3000;

db.sync().then(() => {
	app.listen(port, () => {
		console.log(`listening on port ${port}`);
	});
});
