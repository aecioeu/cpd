const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const config = require('../../../../config.json')
const { createPDF } = require('../../../config/pdf')
var request = require('request');
var pool = require("../../../config/pool-factory");
var {
  makeid,
  rand,
  delay,
  capitalizeFirstLetter,
} = require("../../../config/functions");
var db = require("../../../config/db");
var moment = require("moment"); // require
const { isLoggedIn } = require("../../../config/functions");
const { sendMsg } = require("../../../config/senderHelper");
const schedule = require("node-schedule");


var request = require('request');
require('dotenv').config()



router.get("/", isLoggedIn, function (req, res) {
  //res.send('Service home page');
  res.render("admin/laudos.ejs", { user: req.user });
});




module.exports = router;
