var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var categoriasValidas = {
    values: ['CAT1', 'CAT2', 'CAT3'],
    message: '{VALUE} no es una categoría permitida'
};

var itemSchema = new Schema({

    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    img: { type: String, required: [false, 'La imagen es obligatoria'] },
    categoria: { type: String, required: true, default: 'CAT1', enum: categoriasValidas },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    //usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    created:{ type: Date },
    modified:{ type: Date },
    descripcion: { type: String },
    comentarios: { type: String },
    precio: { type: Number },
    ventas: { type: Number },
    reviews: { type: Object },

});



module.exports = mongoose.model('Item', itemSchema);