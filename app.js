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
    socket.on('disconnect', function () {
        delete users[socket.user];
        console.log(users);
        io.emit('user-disconnected',socket.user);
    });
    console.log("A user connected");
    socket.on('login', function (data) {
        console.log('connected user' + socket.id + ' ' + data.user);
        users[data.user] = socket.id;
        console.log(users);
        socket.user = data.user;
    });
    socket.on('send-ice', function (data) {
        console.log('ice' + socket.id + 'remote user' + JSON.stringify(data.to));
        io.to(users[data.to]).emit('receive-ice', data.ice);
    });
    socket.on('send-peer-ice', function (data) {
        console.log('ice from remote' + socket.id + 'remote user' + JSON.stringify(data.to));
        io.to(users[data.to]).emit('receive-peer-ice', data.ice);
    });
    socket.on('send-offer', function (data) {
        console.log('ice' + socket.id + 'remote user' + JSON.stringify(data.to));
        io.to(users[data.to]).emit('receive-offer', { offer: data.offer, from: data.from });
    });
    socket.on('send-answer', function (data) {
        console.log('answer' + socket.id + 'remote user' + JSON.stringify(data.to));
        io.to(users[data.to]).emit('receive-answer', data.answer);
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
