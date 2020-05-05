var express = require('express');
var app = express();

//var Hospital = require('../models/hospital');
//var Medicos = require('../models/medico');
var Usuario = require('../models/usuario');
var Item = require('../models/item');
var Producto = require('../models/producto');








//========================================
//BUSQUEDA POR CATEGORIA
//========================================
app.get('/coleccion/:tabla/:busqueda', (req, res) => {

    var tabla = req.params.tabla;
    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');
    var promesa;

    switch (tabla) {
        case 'usuarios':
            promesa = buscarUsuarios(busqueda, regex);
            break;

        case 'items':
            promesa = buscarItems(busqueda, regex);
            break;

        case 'productos':
            promesa = buscarProductos(busqueda, regex);
            break;
        case 'autores':
            promesa = buscarAutores(busqueda, regex);
        break;
        case 'iautores':
            promesa = buscarIAutores(busqueda, regex);
        break;
       
        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'Los tipos de búsqueda sólo son: Usuarios, items y productos',
                error: { message: 'Tipo de búsqueda no válido' }
            });
    }

    promesa.then(data => {
        res.status(200).json({
            ok: true,
            tabla: data
        });
    })

});



//========================================
//BUSQUEDA GENERAL
//========================================

//Rutas
app.get('/todo/:busqueda', (request, response, next) => {

    var busqueda = request.params.busqueda;
    var regex = new RegExp(busqueda, 'i');

    Promise.all([
            buscarProductos(busqueda, regex),
            buscarItems(busqueda, regex),
            buscarUsuarios(busqueda, regex)
        ])
        .then(respuestas => {
            response.status(200).json({
                ok: true,
                productos: respuestas[0],
                items: respuestas[1],
                usuarios: respuestas[2]

            });
        })

});

function buscarProductos(busqueda, regex) {

    return new Promise((resolve, reject) => {
        Producto.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .exec((err, productos) => {

                if (err) {
                    reject('Error al cargar productos', err);
                } else {
                    resolve(productos)
                }
            })
    })
};

function buscarItems(busqueda, regex) {

    return new Promise((resolve, reject) => {
        Item.find({ nombre: regex })
            .populate('usuario', 'nombre email img')
            .populate('producto')
            .exec((err, items) => {

                if (err) {
                    reject('Error al cargar productos', err);
                } else {
                    resolve(items)
                }
            })
    })
}



function buscarIAutores(busqueda, regex) {

    return new Promise((resolve, reject) => {
        Item.find({usuario: busqueda})
                        .populate('usuario', 'nombre email img')
                        .exec((err, items) => {
                if (err) {
                    reject('Error al cargar usuarios', err)
                } else {
                    resolve(items)
                }
            })
    })
}



function buscarUsuarios(busqueda, regex) {

    return new Promise((resolve, reject) => {
        Usuario.find({}, 'nombre email role ')
            .or([{ 'nombre': regex }, { 'email': regex }])
            .exec((err, usuarios) => {
                if (err) {
                    reject('Error al cargar usuarios', err)
                } else {
                    resolve(usuarios)
                }
            })
    })
}

function buscarAutores(busqueda, regex) {

    return new Promise((resolve, reject) => {
        Usuario.find({}, 'nombre email role img ')
            .or([{ 'role': regex }])
            .exec((err, usuarios) => {
                if (err) {
                    reject('Error al cargar usuarios', err)
                } else {
                    resolve(usuarios)
                }
            })
    })
}




module.exports = app;