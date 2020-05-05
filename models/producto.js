var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

var categoriasValidas = {
    values: ['CAT1', 'CAT2', 'CAT3'],
    message: '{VALUE} no es una categoría permitida'
};

var productoSchema = new Schema({

    nombre: { type: String, unique: true, required: [true, 'El nombre es necesario'] },
    img: { type: String, required: [false, 'La imagen es obligatoria'] },
    categoria: { type: String, required: true, default: 'CAT1', enum: categoriasValidas },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    descripcion: { type: String },
    precio: { type: Number },
    ventas: { type: Number },
    reviews: { type: Array },

});

productoSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });

module.exports = mongoose.model('Producto', productoSchema);