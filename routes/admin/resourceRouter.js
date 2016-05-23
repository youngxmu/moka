var express = require('express');
var config = require("../../config");
var logger = require("../../lib/log.js").logger("resourceRouter");
var router = express.Router();

router.get('/list', function (req, res, next) {
    res.render('resource/list');
});

module.exports = router;

