require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const db = require('./database');

db.connect((error) => {
  if (error) {
    console.log(error.message);
  } else {
    console.log('MYSQL Connected ...');
  }
});

global.publicDirectory = path.resolve(__dirname) + '/public/images/';

//exportation des routes
const articleRoutes = require('./routes/article');
const commentaireRoutes = require('./routes/commentaire');
const userRoutes = require('./routes/user');

const app = express();

app.use(bodyParser.json());
app.use(express.static('./public'));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  );
  next();
});

app.use('/api/article', articleRoutes);
app.use('/api/commentaire', commentaireRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;
