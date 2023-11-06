const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mysql = require('mysql2');

var path = require('path');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 4000;
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));

app.engine('hbs', exphbs.engine({extname: '.hbs'}));
app.set('view engine', 'hbs');

const routes = require('./server/routes/route');
app.use('/', routes);

app.listen(port, () => console.log(`Listening on port ${port}...`));