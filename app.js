// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');



//Inicializar variables
var app = express();

//CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST,GET,PUT,DELETE,OPTIONS");
    next();
});


//Body Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
    // parse application/json
app.use(bodyParser.json())

//Server index config
//Este plugin sirve para poder acceder a la carpeta '/uploads' mediante la url especificada '/uploadsDownloads'
//var serveIndex = require('serve-index');
//app.use(express.static(__dirname + '/'))
//app.use('/uploadsDownloads', serveIndex(__dirname + '/uploads'));


//Importar rutas
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');
//var hospitalRoutes = require('./routes/hospital');
var productoRoutes = require('./routes/producto');
//var medicoRoutes = require('./routes/medico');
var itemRoutes = require('./routes/item');
var busquedaRoutes = require('./routes/busqueda');
var uploadRoutes = require('./routes/upload');
var imagenesRoutes = require('./routes/imagenes');




//Conexión a BD
mongoose.connection.openUri('mongodb://localhost:27017/proyecto', (err, resp) => {
    if (err) throw err;
    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');
});
//Rutas
app.use('/usuario', usuarioRoutes);
//app.use('/hospital', hospitalRoutes);
app.use('/producto', productoRoutes);
//app.use('/medico', medicoRoutes);
app.use('/item', itemRoutes);
app.use('/login', loginRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/upload', uploadRoutes);
app.use('/img', imagenesRoutes);






app.use('/', appRoutes);


//Escuchar peticiones express
app.listen(3000, () => {
    console.log('Express Server corriendo en el puerto 3000: \x1b[32m%s\x1b[0m', 'online');
})