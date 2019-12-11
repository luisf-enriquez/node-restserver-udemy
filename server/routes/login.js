const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//Modelos
const Usuario = require('../models/usuario');


app.post('/login', (req,res) => {

    let body = req.body;

    Usuario.findOne({email: body.email}).exec((err, usuario) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            }) 
        }

        // Se verifica si existe el usuario
        if (!usuario) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: '(Usuario) o contraseña incorrectos'
                }
            }) 
        }

        //Se verifica que la contraseña sea correcta
        if (!bcrypt.compareSync(body.password, usuario.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o (contraseña )incorrectos'
                }
            }) 
        }
        
        //Luego de que se ha verificado que usuario y contraseña son correctos creamos el TOKEN

        let token = jwt.sign({
            usuario: usuario // este es el payload
        }, process.env.SEED , {expiresIn: process.env.CADUCIDAD_TOKEN});

        res.json({
            ok: true,
            usuario,
            token
        });
    

    })
})

//Con este export puedo utilizar todas las configuraciones que se hagana a "app"
//en otras páginas

module.exports = app;