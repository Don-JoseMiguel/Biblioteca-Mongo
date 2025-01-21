const express = require('express'); // Importa el framework Express para construir el servidor.
const path = require('path'); // Importa el módulo 'path' para manejar rutas de archivos.
const connectDB = require('./database'); // Importa una función para conectar a la base de datos (debes tener un archivo `database.js`).
const Libro = require('./models/Libro'); // Importa el modelo de datos 'Libro' (asegúrate de definirlo correctamente en `models/Libro.js`).

const app = express(); // Crea una instancia de Express.
const port = 3000; // Define el puerto en el que el servidor escuchará peticiones.


// Middleware para parsear JSON
app.use(express.json());

// Conectar a la base de datos
connectDB();

// Middleware para servir archivos estáticos desde la carpeta 'public' 
app.use(express.static(path.join(__dirname, 'public')));

// Ruta principal para servir el archivo index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rutas para las páginas específicas
app.get('/libros', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'libros.html'));
});

app.get('/actualizar', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'actualizar.html'));
});

app.get('/agregar', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'agregar.html'));
});

app.get('/eliminar', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'eliminar.html'));
});

// API: Obtener todos los libros
app.get('/api/libros', async (req, res) => {
    try {
        const libros = await Libro.find(); // Busca todos los documentos en la colección `libros`.
        res.status(200).json(libros); // Devuelve la lista de libros en formato JSON con un estado HTTP 200.
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener los libros', detalles: err.message });
    }
});


// API: Agregar un nuevo libro
app.post('/api/libros', async (req, res) => {
    try {
        const nuevoLibro = new Libro(req.body); // Crea un nuevo documento `Libro` con los datos recibidos.
        await nuevoLibro.save(); // Guarda el libro en la base de datos.
        res.status(201).json(nuevoLibro); // Devuelve el libro creado con un estado HTTP 201.
    } catch (err) {
        res.status(400).json({ error: 'Error al agregar el libro', detalles: err.message });
    }
});

// API: Actualizar el estado de un libro
app.put('/api/libros/:id', async (req, res) => {
    const { id } = req.params; // Obtiene el ID del libro desde los parámetros de la URL.
    const { estado } = req.body; // Obtiene el estado nuevo desde el cuerpo de la solicitud.

    try {
        const libroActualizado = await Libro.findOneAndUpdate(
            { id }, // Busca el libro por su campo `id`.
            { estado }, // Actualiza el campo `estado`.
            { new: true, runValidators: true } // Devuelve el documento actualizado y valida los datos.
        );

        if (!libroActualizado) {
            return res.status(404).json({ error: 'Libro no encontrado' }); // Si no encuentra el libro, devuelve un error 404.
        }

        res.status(200).json(libroActualizado); // Devuelve el libro actualizado con un estado HTTP 200.
    } catch (err) {
        res.status(400).json({ error: 'Error al actualizar el libro', detalles: err.message });
    }
});

// API: Borrar un libro
app.delete('/api/libros/:id', async (req, res) => {
    const { id } = req.params; // Obtén el ID del libro desde los parámetros de la URL.

    try {
        const libroEliminado = await Libro.findOneAndDelete({ id }); // Busca y elimina el libro por su ID.

        if (!libroEliminado) {
            return res.status(404).json({ error: 'Libro no encontrado' }); // Si no encuentra el libro, devuelve un error 404.
        }

        res.status(200).json({ message: 'Libro eliminado correctamente', libro: libroEliminado });
    } catch (err) {
        res.status(500).json({ error: 'Error al eliminar el libro', detalles: err.message });
    }
});


// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
