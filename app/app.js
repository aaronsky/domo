var path = require('path');
var express = require('express');
var compression = require('compression');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var url = require('url');
var csrf = require('csurf');

var dbURL = process.env.MONGOLAB_URI || "mongodb://localhost/DomoMaker";

var db = mongoose.connect(dbURL, function(err) {
    if (err) {
        console.error('Could not connect to database', err);
        throw err;
    }
});

var redisURL = {
    hostname: 'localhost',
    port: 6379
};

var redisPASS;
if (process.env.REDISCLOUD_URL) {
    redisURL = url.parse(process.env.REDISCLOUD_URL);
    redisPASS = redisURL.auth.split(':')[1];
}

var router = require('./routes/router');
var port = process.env.PORT || process.env.NODE_PORT || 3000;

var app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(compression());
app.use(bodyParser.urlencoded({extended:true}));
app.use(session({
    key: 'sessionid',
    store: new RedisStore({
        host: redisURL.hostname,
        port: redisURL.port,
        pass: redisPASS
    }),
    secret: 'Domo Arigato',
    resave: true,
    saveUninitialized: true,
    cookie: {
        httpOnly: true
    }
}));
app.set('view engine', 'jade');
app.set('views', path.join(__dirname, 'views'));
app.use(favicon(path.join(__dirname, 'public', 'favicon.png')));
app.disable('x-powered-by');
app.use(cookieParser());

app.use(csrf());
app.use(function (err, req, res, next) {
    if (err.code !== 'EBADCSRFTOKEN')
        return next(err);
    return;
})

router(app);

app.listen(port, function (err) {
    if (err) {
        console.error(err);
        throw err;
    }
    console.log('Listening on port ' + port);
})