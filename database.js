// Conectar a MongoDB
const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://jmo0019:contraJMO0019@cluster0.uieur.mongodb.net/biblioteca';

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Conexión exitosa a MongoDB');
    } catch (err) {
        console.error('Error al conectar a MongoDB:', err);
        process.exit(1); // Salir del proceso en caso de error
    }
};

module.exports = connectDB;
