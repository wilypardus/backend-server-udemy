var express = require('express');
var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Producto = require('../models/producto');

//=====================================================
//OBTENER TODOS LOS PRODUCTOS
//=====================================================

app.get('/', (req, response, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Producto.find({})
        .populate('usuario', 'nombre email')
        .skip(desde)
        .limit(5)
        .exec(
            (err, productos) => {

                if (err) {
                    return response.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando productos',
                        errors: err
                    })
                }

                Producto.count({}, (err, conteo) => {
                    response.status(200).json({
                        ok: true,
                        productos: productos,
                        total: conteo
                    })

                })


            })
});

//=====================================================
//ACTUALIZAR PRODUCTOS
//=====================================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Producto.findById(id, (err, producto) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar el producto',
                errors: err
            });
        }

        if (!producto) {

            return res.status(400).json({
                ok: false,
                mensaje: 'El producto con el id ' + id + ' no existe',
                errors: { message: 'No existe un producto con ese id' }
            });
        }

        producto.nombre = body.nombre;
        producto.usuario = req.usuario._id;


        producto.save((err, productoGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar el producto',
                    errors: err
                });
            }


            res.status(200).json({
                ok: true,
                producto: productoGuardado
            });
        });
    });
});

//=====================================================
//CREAR UN NUEVO PRODUCTOS
//=====================================================

app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var producto = new Producto({

        nombre: body.nombre,
        usuario: req.usuario._id
    });

    producto.save((err, productoGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear el producto',
                errors: err
            })
        }

        res.status(201).json({
            ok: true,
            producto: productoGuardado
        })

    });
});

//=====================================================
//BORRAR UN PRODUCTO POR EL ID 
//=====================================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Producto.findByIdAndRemove(id, (err, productoBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar el producto',
                errors: err
            })
        }

        if (!productoBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un producto con ese ID',
                errors: { message: 'No existe un producto con ese ID' }
            })
        }

        res.status(200).json({
            ok: true,
            producto: productoBorrado
        })

    });

});

module.exports = app;