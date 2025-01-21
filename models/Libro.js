const mongoose = require('mongoose');

const libroSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    titulo: { type: String, required: true },
    autor: { type: String, required: true },
    genero: { type: String },
    estado: { 
        type: String, 
        enum: ['disponible', 'reservado'], // Enum para limitar los valores posibles
        default: 'disponible'             // Valor por defecto
    }
});

module.exports = mongoose.model('Libro', libroSchema);
