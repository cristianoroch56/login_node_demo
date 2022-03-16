"use strict";

const api = require('express').Router();

const unAuthenticate = require("./unauthenticatedRoute")
api.use("/auth", unAuthenticate);

module.exports = api;