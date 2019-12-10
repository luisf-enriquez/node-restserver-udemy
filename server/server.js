require('./config/config');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

//Los app. use son middlewares 
//Los del bodyParser permiten obtener datos de los formularios
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.json('Desde root')
});

app.post('/usuario', (req, res) => {

    let body = req.body;

    if (body.nombre === undefined) {

        res.status(400).json({
            ok: false,
            mensaje: 'El nombre es necesario'
        })
    } else {

        res.json({
            persona: body
        })
    }


});

app.put('/usuario/:id', (req, res) => {

    //Para obtener el parametro de la URL
    let id = req.params.id
    res.json({
        id
    })
});

app.delete('/usuario/', (req, res) => {
    res.json('delete usuario')
});

app.listen(process.env.PORT, () => {
    console.log('Conectado en puerto', process.env.PORT);
})