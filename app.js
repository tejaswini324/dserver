const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const appRouter = require('./router/index')

const port = process.env.PORT || 5000;
const host = '0.0.0.0';

const app = express();

app.use(cors());
app.options('*', cors());
app.use(express.json());
app.use('/', appRouter);


mongoose.connect('mongodb+srv://user00:GTJzQ5SGNlO43Tyi@edureka-fullstack-proje.nq1mx.mongodb.net/database0?retryWrites=true&w=majority', 
    { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    .then(
    app.listen(port, host)
).catch(err => console.log(err));

