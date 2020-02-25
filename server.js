const express = require("express");
const app = express();
const path = require("path");
const db = require("./db");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const { uuid, fromString } = require("uuidv5");

app.use(
	morgan(":method :url :status :res[content-length] - :response-time ms")
);

app.use(bodyParser.json());
app.use("/assets", express.static("assets"));

app.get("/", (req, res, next) => {
	res.sendFile(path.join(__dirname, "index.html"));
});

//Additional routes here
//GET, POST, DELETE for /api/users

app.get("/api/users", async (req, res, next) => {
	await db
		.getUsers()
		.then(response => {
			res.send(response);
		})
		.catch(next);
});

app.post("/api/users", (req, res, next) => {
	db.createUser(req.body.name).then(response => res.send(response));
});

app.delete("/api/users/:id", (req, res, next) => {
	db.destroyUser(req.param.id).then(() => res.sendStatus(200));
});

//GET, POST, DELETE for /api/things
app.get("/api/things", async (req, res, next) => {
	await db.getThings().then(response => res.send(response));
});

app.post("/api/things", (req, res, next) => {
	db.createThing(req.body.name).then(response => res.send(response));
});
app.delete("/api/things/:id", (req, res, next) => {
	db.destroyThing(req.param.id).then(() => res.sendStatus(200));
});
//GET, POST, DELETE for /api/user_things
app.get("/api/user_things", (req, res, next) => {
	db.getUserThings().then(response => res.send(response));
});

app.post("/api/user_things", (req, res, next) => {
	console.log(req.body);
	db.createUserThing(req.body.userId, req.body.thingId).then(response =>
		res.send(response)
	);
});

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
