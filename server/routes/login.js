const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

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

//Configuraciones de Google

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    return{
        
        //retorna objeto con base al esquema creado para los usuarios
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}
app.post('/google', async (req,res) => {

    let token = req.body.idtoken;

    let googleUser = await verify(token)
        .catch(e =>{
            return res.status(403).json({
                ok: false,
                err: e
            })
        })

    Usuario.findOne({email: googleUser.email}).exec((err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            }) 
        }

        console.log(googleUser);
        //Si existe usuario en BD
        if (usuarioDB) {

            //Si exsite usuario pero no se ha autenticado mediante Google
            
            if (usuarioDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Debe usar su autenticación normal'
                    }
                }) 
            } 
            
            //Si existe usuario en BD y si se ha autenticado por google entonces
            //renuevo su token y lo retorno
            else {
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, {expiresIn: process.env.CADUCIDAD_TOKEN});

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });
            }
        } else {

            //Si el usuario no existe en la base de datos
            let usuario = new Usuario();

            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.picture;
            usuario.google = true;
            usuario.password = ':)';

            usuario.save((err, usuarioDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    }) 
                }

                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, {expiresIn: process.env.CADUCIDAD_TOKEN});

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });

            })

        }

    })

});

//Con este export puedo utilizar todas las configuraciones que se hagana a "app"
//en otras páginas

module.exports = app;