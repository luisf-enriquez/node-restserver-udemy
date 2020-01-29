const express  = require('express');
const app = express();

let {verificaToken} = require('../middlewares/autenticacion');

const Producto = require('../models/producto');

//Servicios

//============================
//Mostrar todos los productos
//============================

app.get('/productos', verificaToken, (req,res) => {

    //trae todos los productos y 
    // populate: usuario y categoria
    // paginado

    let desde = Number(req.query.desde) || 0;
    let limite = Number(req.query.limite) || 10;

    Producto.find({disponible: true})
            .populate('usuario', 'nombre email')
            .populate('categoria', 'descripcion')
            .skip(desde).limit(limite)
            .exec((err,productos) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    }) 
                }

                if (!productos) {
                    return res.status(400).json({
                        ok: false,
                        err:{
                            message : 'No hay productos creados en la base de datos'
                        }
                    })
                }

                res.json({
                    ok: true,
                    productos,
                })

            })
})

//============================
//Mostrar un producto por id
//============================

app.get('/productos/:id', verificaToken, (req,res) => {

    // populate: usuario y categoria
    let id = req.params.id;

    Producto.findById(id)
            .populate('usuario', 'nombre email')
            .populate('categoria', 'descripcion')
            .exec((err,productodB) => {

                if (err) {
                    res.status(500).json({
                        ok: false,
                        err
                    })
                }

                if (!productodB) {
                    res.status(400).json({
                        ok: false,
                        err:{
                            message: 'El producto solicitado no existe'
                        }
                    })
                }

                res.status(200).json({
                    ok: true,
                    producto: productodB
                })

            })

})

//============================
//Buscar Productos por TÉRMINO
//============================

app.get('/productos/buscar/:termino', verificaToken, (req,res) => {

    //Para hacer una busqueda flexible, o que coincida con el término de entrada
    //se puede emplear una expresión regular

    let termino = req.params.termino;

    //Se crea un expresión regular basada en el término para que haga match con lo que se ingrese.
    let regex = new RegExp(termino, 'i'); //'i' para que sea insensible a mayúsculas minúsculas
    
    Producto.find({nombre: regex})
            .populate('categoria', 'descripcion')
            .exec((err, productos) => {
                
                if (err) {
                    res.status(500).json({
                        ok:false,
                        err
                    })
                }

                res.status(200).json({
                    ok: true,
                    productos
                })

            })

})

//============================
//crear un nuevo producto
//============================

app.post('/productos', verificaToken, (req,res) => {

    // grabar una categoria del listado
    // grabar el usuario
    //req.usuario._id

    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        usuario: req.usuario._id,
        categoria: body.categoria,
        disponible: body.disponible
    });

    producto.save((err,productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            }) 
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        })
    })

})

//============================
//Actulaizar producto
//============================

app.put('/productos/:id',verificaToken,(req,res) => {

    let id = req.params.id;
    let body = req.body;

    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, resultado) => {
        
        if (err) {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
        }

        if (!resultado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No existe el producto con el ID dado'
                }
            }) 
        }

        res.json({
            ok: true,
            producto: resultado
        })
    })

})

//============================
//Borrar un producto
//============================

app.delete('/productos/:id', verificaToken, (req,res) => {

    //Fisicamente seguira existiendo, solomante cambiar el estado 
    // del atributo "disponible" a false

    let id = req.params.id;

    Producto.findByIdAndUpdate(id, {disponible: false }, { new: true }, (err, resultado) => {

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
                    message: 'Producto no encontrado (Id no existe)'
                }
            })
        }

        res.json({
            ok: true,
            producto: resultado,
            mensaje: 'Producto Borrado'
        })
    })

})


//Exporta toda las configuraciones realizadas al app
module.exports = app;