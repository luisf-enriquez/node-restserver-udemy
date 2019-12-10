require('./config/config');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//Los app. use son middlewares 
//Los del bodyParser permiten obtener datos de los formularios
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Middleware para las rutas
app.use('/', require('./routes/routes'));

//Conexión a base de datos

if (!process.env.URLDB) {

    process.env.URLDB = 'mongodb://localhost:27017/cafe'

}

mongoose.connect(process.env.URLDB, { useNewUrlParser: true }, (err, result) => {
    if (err) {
        return console.log(err);
    } else {
        console.log('Conectado a DB');
    }
});

//Puerto
app.listen(process.env.PORT, () => {
    console.log('Conectado en puerto', process.env.PORT);
})