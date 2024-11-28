const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const cors = require('cors');  // Importa el módulo cors

// Almacenar usuarios en memoria (solo para pruebas, no usar en producción)
const users = [];

app.use(cors());

// Configurar middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'tienda')));  // Sirve los archivos estáticos desde la carpeta 'tienda'

// Ruta para la página de inicio (login)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'tienda', 'index.html'));
});

// Ruta para la página de registro
app.get('/registro.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'tienda', 'registro.html'));
});

// Endpoint para manejar el registro
app.post('/api/register', (req, res) => {
    const { username, email, password } = req.body;

    // Validar que los datos no estén vacíos
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    // Verificar si el usuario ya existe
    const userExists = users.find(user => user.email === email);
    if (userExists) {
        return res.status(400).json({ message: 'El correo ya está registrado.' });
    }

    // Guardar el usuario en memoria
    users.push({ username, email, password });
    res.status(201).json({ message: 'Usuario registrado exitosamente.' });
});

// Endpoint para manejar el login
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    // Validar que los datos no estén vacíos
    if (!email || !password) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    // Buscar el usuario
    const user = users.find(user => user.email === email && user.password === password);
    if (!user) {
        return res.status(401).json({ message: 'Correo o contraseña incorrectos.' });
    }

    res.status(200).json({ message: `Bienvenido, ${user.username}!` });
});

// Iniciar el servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});