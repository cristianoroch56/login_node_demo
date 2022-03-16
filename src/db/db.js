"use strict";

const mongoose = require("mongoose");
mongoose.pluralize(null);

const uri = `mongodb://${process.env.DB_HOST}/${process.env.DB_NAME}`;

let connection = mongoose.connect(uri);

module.exports = {connection};