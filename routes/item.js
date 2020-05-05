var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken')
var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Item = require('../models/item');


//=====================================================
//OBTENER TODOS LOS ITEM
//=====================================================

app.get('/', (req, response, next) => {

   
    Item.find({})
        .populate('usuario', 'nombre email img')
        .sort({created:-1})
        .exec(
            (err, items) => {

                if (err) {
                    return response.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando items',
                        errors: err
                    })
                }
                Item.count({}, (err, conteo) => {
                    response.status(200).json({
                        ok: true,
                        items: items,
                        total: conteo
                    })

                })


            })


});




//=====================================================
//OBTENER TODOS LOS ITEM DE AUTOR
//=====================================================
app.get('/autor/:id', (req, res) => {

    var id = req.params.id;
   
   

    Item.find({usuario:id})
        .populate('usuario', 'nombre email img')
        .sort({created:-1})
        .exec(
            (err, item) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando items',
                        errors: err
                    })
                }
                
                if (!item) {

                    return res.status(400).json({
                        ok: false,
                        mensaje: 'El usuario con el id ' + id + ' no tiene ningún item',
                        errors: { message: 'El usuario  no tiene ningún item' }
            });
        }

        return res.status(200).json({
                        ok: true,
                        item:item
                        
            });


            })


});






//=====================================================
//OBTENER ITEM POR ID
//=====================================================
app.get('/:id', (req, res) => {

    var id = req.params.id;
   
   

    Item.findById(id)
        .populate('usuario', 'nombre email img')
        .sort({created:-1})
        .exec(
            (err, item) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando items',
                        errors: err
                    })
                }
                
                if (!item) {

                    return res.status(400).json({
                        ok: false,
                        mensaje: 'El item con el id ' + id + ' no existe',
                        errors: { message: 'No existe un item con ese id' }
            });
        }

        return res.status(200).json({
                        ok: true,
                        item:item
                        
            });


            })


});


//=====================================================
//ACTUALIZAR ITEM
//=====================================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Item.findById(id, (err, item) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar el item',
                errors: err
            });
        }

        if (!item) {

            return res.status(400).json({
                ok: false,
                mensaje: 'El item con el id ' + id + ' no existe',
                errors: { message: 'No existe un item con ese id' }
            });
        }

        item.nombre = body.nombre;
        item.usuario = req.usuario._id;
        item.modified = new Date();


        item.save((err, itemGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar el item',
                    errors: err
                });
            }


            res.status(200).json({
                ok: true,
                item: itemGuardado

            });
        });
    });
});

//=====================================================
//CREAR UN NUEVO ITEM
//=====================================================

app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var item = new Item({
        nombre: body.nombre,
        usuario: req.usuario._id,
        img:body.img,
        img:body.img,
        descripcion:body.descripcion,
        precio:body.precio,


        created:new Date(),
       
    });

    item.save((err, itemGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear el item',
                errors: err
            })
        }

        res.status(201).json({
            ok: true,
            item: itemGuardado,
            usuariotoken: req.usuario
        })

    });
});

//=====================================================
//BORRAR UN ITEM POR EL ID 
//=====================================================
app.delete('/:id', (req, res) => {

    var id = req.params.id;

    Item.findByIdAndRemove(id, (err, itemBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar el item',
                errors: err
            })
        }

        if (!itemBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un item con ese ID',
                errors: { message: 'No existe un item con ese ID' }
            })
        }

        res.status(200).json({
            ok: true,
            item: itemBorrado
        })

    });

});

module.exports = app;