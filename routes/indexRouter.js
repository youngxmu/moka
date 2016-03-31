var express = require('express');
var config = require("../config");
var logger = require("../lib/log.js").logger("indexRouter");
var router = express.Router();

router.get('', function (req, res, next) {
    res.render('index');
});

module.exports = router;

