var express = require('express');
var socket = require("socket.io");
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
var io = socket();
app.io = io;
var users = [];

io.on("connection", function (socket) {
    console.log("A user connected");
    socket.on('login', function (data) {
        console.log('connected user' + socket.id + ' ' + data.user);
        users.push(data.user);
        socket.user = data.user;
    });
    socket.on('connect-user', function (data) {
        console.log('connect to other user' + socket.id + ' ' + data.user);
    });
    socket.on('send-ice', function (data) {
        console.log('ice from' + socket.id + ' ' + data.ice);
    });
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
