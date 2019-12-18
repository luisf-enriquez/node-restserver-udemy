require('./config/config');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

//Los app. use son middlewares 
//Los del bodyParser permiten obtener datos de los formularios
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Middleware para las rutas (con el index se hace una configuración global)

//app.use('/', require('./routes/routes'));
//app.use('/', require('./routes/login'));
app.use('/', require('./routes/index'));

//habilitar la carpeta public
app.use(express.static(path.join(__dirname, '../public')));

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