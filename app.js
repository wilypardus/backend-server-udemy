// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');



//Inicializar variables
var app = express();


//Body Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
    // parse application/json
app.use(bodyParser.json())


//Importar rutas
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');
var appRoutes = require('./routes/app');

//Conexión a BD
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, resp) => {
    if (err) throw err;
    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');
});
//Rutas
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);


//Escuchar peticiones express
app.listen(3000, () => {
    console.log('Express Server corriendo en el puerto 3000: \x1b[32m%s\x1b[0m', 'online');
})