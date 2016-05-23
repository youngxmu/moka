var express = require('express');
var config = require("../../config");
var logger = require("../../lib/log.js").logger("indexRouter");

var router = express.Router();

router.get('/index', function (req, res, next) {
    res.render('admin/index');
});

module.exports = router;

