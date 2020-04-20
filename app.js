// Requires
var express = require('express');
var mongoose = require('mongoose');



//Inicializar variables
var app = express();

//Conexión a BD
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, resp) => {
    if (err) throw err;
    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');
});

//Rutas
app.get('/', (request, response, next) => {

    response.status(200).json({
        ok: true,
        mensaje: 'Petición realizada correctamente'
    })
})


//Escuchar peticiones express
app.listen(3000, () => {
    console.log('Express Server corriendo en el puerto 3000: \x1b[32m%s\x1b[0m', 'online');
})