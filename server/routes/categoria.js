const express  = require('express');
const app = express();
let {verificaToken, verificaAdmin} = require('../middlewares/autenticacion');

let Categoria = require('../models/categoria');

//Servicios

//============================
//Mostrar todas las categorias
//============================

app.get('/categoria', verificaToken,(req,res) => {

    //El metodo POPULATE permite obtner que ObjectId hay en la categoria solicitada

    Categoria.find({})
        .sort('descripcion') // Para ordenar de aceurdo con el valor de un atributo
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            }) 
        }

        if (!categorias) {
            return res.status(400).json({
                ok: false,
                err:{
                    message : 'No hay categorias en la base de datos'
                }
            }) 
        }
        res.json({
            ok: true,
            categorias,
        })
    })

})

//============================
//Mostrar una categoria por ID
//============================

app.get('/categoria/:id', verificaToken, (req,res) => {

    let id = req.params.id;
    Categoria.findById(id, (err, categoria) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            }) 
        }

        if (!categoria) {
            return res.status(400).json({
                ok: false,
                err:{
                    message : 'No exite la categoría con el ID dado'
                }
            }) 
        }

        res.json({
            ok: true, 
            categoria
        })

    })
    
})

//============================
//Crear una nueva categoria
//============================

app.post('/categoria', verificaToken, (req,res) => {

    //req.usuario._id
    let body = req.body;
    let categoria = new Categoria();

    categoria.descripcion = body.descripcion;
    categoria.usuario = req.usuario._id;

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            }) 
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            }) 
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })
    })
    
})

//============================
//Actulizar una categoria
//============================

app.put('/categoria/:id', (req,res) => {

    let id = req.params.id;
    des = {
        descripcion: req.body.descripcion
    }
    
    Categoria.findByIdAndUpdate(id, des, { new: true, runValidators: true, context: 'query' }, (err, resultado) => {

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
                err
            }) 
        }

        res.json({
            ok: true,
            usuario: resultado
        })
    })
})

//============================
//Borrar una categoria, solo Admin
//============================

app.delete('/categoria/:id', [verificaToken, verificaAdmin], (req,res) => {

    let id = req.params.id;

    Categoria.findByIdAndDelete(id, (err, result) => {

        if (err) {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
        }

        if (!result) {
            return res.status(400).json({
                ok: false,
                err:{
                    message : 'No exite la categoría con el ID dado'
                }
            }) 
        }

        res.json({
            ok: true,
            message: 'La siguiente categoria ha sido eliminada: ',
            result
        })

    })
})

module.exports = app;