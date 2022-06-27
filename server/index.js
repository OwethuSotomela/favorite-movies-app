const PgPromise = require("pg-promise")
const express = require('express');
const cors = require('cors');

require('dotenv').config()

const API = require('./api');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"))

app.use(cors());

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://owethusotomela:owethusotomela@localhost:5432/faveMovies';
const pgp = PgPromise({});

const config = {
    connectionString: DATABASE_URL
};

// we normally only have a DATABAE_URL when we are on the Heroku server
if (process.env.DATABASE_URL) {
    config.ssl = { rejectUnauthorized: false };
}

const db = pgp(config);

API(app, db);

const PORT = process.env.PORT || 5000;
app.listen(PORT, function () {
    console.log(`App started on port ${PORT}`);
});