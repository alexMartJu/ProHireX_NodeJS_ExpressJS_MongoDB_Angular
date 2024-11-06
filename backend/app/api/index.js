const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require("dotenv");

// create express app
const app = express();
dotenv.config();

// Habilita CORS para todas las rutas
const corsOptions = {
  origin: process.env.CORSURL, 
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
app.use(bodyParser.json())

// Configuring the database
const dbConfig = require('../config/database.config.js');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(dbConfig.url, {
	useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

require('../routes/category.routes')(app);
require('../routes/job.routes')(app);
require('../routes/carousel.routes')(app);
require('../routes/auth.routes')(app);
require('../routes/profile.routes')(app);
require('../routes/comments.routes')(app);
require('../routes/application.routes')(app);

app.listen(process.env.PORT, () => {
  console.log(`Servidor Express en el puerto ${process.env.PORT}`);
});
