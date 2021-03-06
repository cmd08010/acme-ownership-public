const pg = require("pg");
const uuid = require("uuid/v4");
const client = new pg.Client(
	process.env.DATABASE_URL || "postgres://localhost/acme_db"
);

client.connect();

const sync = async () => {
	//create tables and seed some data

	const SQL = `
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
  DROP TABLE IF EXISTS user_things;
  DROP TABLE IF EXISTS users;
  DROP TABLE IF EXISTS things;
  CREATE TABLE users
  (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR NOT NULL
  );
  CREATE TABLE things
  (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR NOT NULL
  );

  CREATE TABLE user_things
  (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    userId UUID REFERENCES users(id),
    thingId UUID REFERENCES things(id)
  );

  INSERT INTO users (name) VALUES ('Test');
  INSERT INTO things (name) VALUES ('cat');
  INSERT INTO user_things 
            (userId, 
             thingId) 
VALUES      ((SELECT id 
              FROM   users 
              WHERE  name = 'Test'), 
             (SELECT id 
              FROM   things 
              WHERE  name = 'cat')); ;

  `;

	await client.query(SQL);
};

//Additional methods here for reading, creating, destroying

const getUsers = async () => {
	const SQL = `SELECT * FROM users;`;
	const response = await client.query(SQL);
	return response.rows;
};

const createUser = async name => {
	const SQL = `INSERT INTO users(name) VALUES ($1)
  returning *
  `;
	const response = await client.query(SQL, [name]);
	return response.rows[0];
};

const destroyUser = async id => {
	const SQL = `DELETE FROM users WHERE id = $1;`;
	await client.query(SQL, [id]);
};

const getThings = async () => {
	const SQL = `SELECT * FROM things;`;
	const response = await client.query(SQL);
	return response.rows;
};

const createThing = async name => {
	const SQL = `INSERT INTO things(name) VALUES ($1)
returning *
`;
	const response = await client.query(SQL, [name]);
	return response.rows[0];
};

const destroyThing = async id => {
	const SQL = `DELETE FROM things WHERE id = $1;`;
	await client.query(SQL, [id]);
};

const getUserThings = async () => {
	const SQL = "SELECT * FROM user_things";
	const response = await client.query(SQL);
	return response.rows;
};

const createUserThing = async (userId, thingId) => {
	console.log(userId, thingId);
	const SQL = `INSERT INTO user_things 
  (userId, 
   thingId) 
  VALUES  ($1,$2)
    returning *;`;
	const response = await client.query(SQL, [userId, thingId]);
	return response.rows[0];
};

module.exports = {
	sync,
	createUser,
	createThing,
	getUsers,
	getThings,
	getUserThings,
	destroyThing,
	destroyUser,
	createUserThing
};
