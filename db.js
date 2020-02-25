const pg = require("pg")
const uuid = require("uuid/v4")
const client = new pg.Client(
  process.env.DATABASE_URL || "postgres://localhost/acme_db"
)

client.connect()

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

  `

  await client.query(SQL)
}

//Additional methods here for reading, creating, destroying

const getUsers = () => {}

const createUser = async name => {
  const SQL = `INSERT INTO users(name) VALUES ($1)
  returning *;
  `
  const response = await client.query(SQL, [name])
  return response.rows[0]
}

const destroyUser = () => {}

const getThings = () => {}

const createThing = async name => {
  const SQL = `INSERT INTO things(name) VALUES ($1)
returning *;
`
  const response = await client.query(SQL, [name])
  return response.rows[0]
}

const destroyThing = () => {}

module.exports = {
  sync,
  createUser,
  createThing
}
