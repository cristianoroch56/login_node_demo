"use strict";

require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT;

const db = require("./db/db");
const logger = require("morgan");
const cookieParser = require("cookie-parser");

global.jwt = require("jsonwebtoken");

db.connection.then(console.log("success")).catch(e => console.log(e));

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Credentials", true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, access_token"
  );
  next();
});

app.use(logger('dev', {
  skip: function (req, res) { return req.originalUrl.includes("/static/"); }
}))

const api = require("./routes/indexRoute");
app.use("/api/v1/",api)

app.listen(PORT, () => console.log("Application running on port number ", PORT))