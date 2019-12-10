const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const _ = require('underscore');

//Modelos
const Usuario = require('../models/usuario');

//Routes
app.get('/usuario', (req, res) => {

    let desde = Number(req.query.desde) || 0;
    let limite = Number(req.query.limite) || 5;

    //retornar los resultados paginados usando skup y limit
    Usuario.find({ estado: true }, 'nombre email role estado google img').skip(desde).limit(limite).exec((err, usuarios) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        //para contar registros
        Usuario.count({ estado: true }, (err, conteo) => {
            res.json({
                ok: true,
                usuarios,
                conteo
            })
        })



    })

});

app.post('/usuario', (req, res) => {

    let usuario = new Usuario({
        nombre: req.body.nombre,
        password: bcrypt.hashSync(req.body.password, 10),
        email: req.body.email,
        role: req.body.role
    })

    usuario.save((err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })

});

app.put('/usuario/:id', (req, res) => {

    //Para obtener el parametro de la URL
    let id = req.params.id

    //Con underscore podemos definir que elementos del body realmente queremos usar para el PUT
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);



    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, resultado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            usuario: resultado
        })
    })

});

app.delete('/usuario/:id', (req, res) => {

    let id = req.params.id;

    //Usuario.findByIdAndRemove(id, (err, resultado) => {
    Usuario.findByIdAndUpdate(id, { estado: false }, { new: true }, (err, resultado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        };

        if (!resultado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            })
        }

        res.json({
            ok: true,
            usuario: resultado
        })

    });

});

module.exports = app;