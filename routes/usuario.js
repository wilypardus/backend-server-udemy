var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken')
var mdAutenticacion = require('../middlewares/autenticacion');
var SEED = require('../config/config').SEED;

var app = express();

var Usuario = require('../models/usuario');

//=====================================================
//OBTENER TODOS LOS USUARIOS
//=====================================================

app.get('/', (req, response, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Usuario.find({}, 'nombre email img role')
        .skip(desde)
        .limit(5)
        .exec(
            (err, usuarios) => {

                if (err) {
                    return response.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando usuarios',
                        errors: err
                    })
                }
                Usuario.count({}, (err, conteo) => {
                    response.status(200).json({
                        ok: true,
                        usuarios: usuarios,
                        total: conteo
                    })

                });

            })
});



//=====================================================
//OBTENER  USUARIOS POR ROLE
//=====================================================

function buscarAutor(busqueda, regex) {

    return new Promise((resolve, reject) => {
        Usuario.find({}, 'nombre email role img  ')
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
//=====================================================
//OBTENER DATOS USUARIO POR TOKEN
//=====================================================

app.get('/obt/', mdAutenticacion.verificaToken, (req, response, next) => {

    var token = req.query.token;
    var nombre;
    var role;
    var email;
    var img;

    jwt.verify(token, SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Token incorrecto',
                errors: err
            })
        }
        response.status(200).json({
            ok: true,
            // decoded: decoded,
            usuario:decoded.usuario,
            

        })
    });

});

//=====================================================
//OBTENER DATOS USUARIO POR ID
//=====================================================


app.get('/ob/', (req, res, next) => {
    var id = req.body.id;


    Usuario.findById( id, (err, usuario) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con el id ' + id + ' no existe',
                errors: { message: 'No existe un usuario con ese id' }
            });
        }
        usuario.password = ':)';
        res.status(200).json({
            ok: true,
            usuario: usuario,

        })

    })

});

//=====================================================
//OBTENER DATOS USUARIO POR ID
//=====================================================


app.get('/usr/:usr', (req, res, next) => {
    var usr = req.params.usr;


    Usuario.find( {nombre:usr}, (err, usuario) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con el id ' + id + ' no existe',
                errors: { message: 'No existe un usuario con ese id' }
            });
        }
        usuario.password = ':)';
        res.status(200).json({
            ok: true,
            usuario: usuario,

        })

    })

});
//=====================================================
//ACTUALIZAR USUARIOS
//=====================================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (err, usuario) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        if (!usuario) {

            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con el id ' + id + ' no existe',
                errors: { message: 'No existe un usuario con ese id' }
            });
        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((err, usuarioGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario',
                    errors: err
                });
            }
            usuarioGuardado.password = ':)';

            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });
        });
    });
});

//=====================================================
//CREAR UN NUEVO USUARIO
//=====================================================
app.post('/', (req, res) => {

    var body = req.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    usuario.save((err, usuarioGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear usuario',
                errors: err
            })
        }

        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            usuariotoken: req.usuario
        })

    });
});

//=====================================================
//BORRAR UN USUARIO POR EL ID 
//=====================================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar usuario',
                errors: err
            })
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un usuario con ese ID',
                errors: { message: 'No existe un usuario con ese ID' }
            })
        }

        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        })

    });

});

module.exports = app;