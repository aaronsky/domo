var _ = require('lodash');

var models = require('../models');
var Domo = models.Domo;

var makerPage = function(req, res) {
    Domo.Model.findByOwner(req.session.account._id, function(err, docs) {
        if (err) {
            console.error(err);
            return res.status(400).json({ error: 'Something horrible has happened' });
        }
        res.render('app', { csrfToken: req.csrfToken(), domos: docs });
    });
};

var makeDomo = function(req, res) {
    if (!req.body.name || !req.body.age) {
        return res.status(400).json({ error: 'Both name and age are required!' });
    }
    var domoData = {
        name: req.body.name,
        age: req.body.age,
        owner: req.session.account._id
    };
    var newDomo = new Domo.Model(domoData);
    newDomo.save(function(err) {
        if (err) {
            console.error(err);
            return res.status(400).json({ error: 'Something horrible has happened' });
        }
        res.json({ redirect: '/maker' });
    })
};

module.exports.makerPage = makerPage;
module.exports.make = makeDomo;