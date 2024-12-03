const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Configuración de la base de datos
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',  // Tu usuario de MySQL
    password: 'root',  // Tu contraseña de MySQL
    database: 'mi_aplicacion_db'
});

db.connect(err => {
    if (err) throw err;
    console.log('Conectado a la base de datos');
});

// Ruta para consultar todos los registros
app.get('/', (req, res) => {
    db.query('SELECT * FROM usuarios', (err, results) => {
        if (err) throw err;
        res.render('index', { usuarios: results });
    });
});

// Ruta para ver un registro individual
app.get('/usuario/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM usuarios WHERE id = ?', [id], (err, results) => {
        if (err) throw err;
        res.render('editar', { usuario: results[0] });
    });
});

// Ruta para editar un registro
app.post('/editar/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, email } = req.body;
    db.query('UPDATE usuarios SET nombre = ?, email = ? WHERE id = ?', [nombre, email, id], (err, results) => {
        if (err) throw err;
        res.redirect('/');
    });
});

// Ruta para eliminar un registro
app.get('/eliminar/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM usuarios WHERE id = ?', [id], (err, results) => {
        if (err) throw err;
        res.redirect('/');
    });
});

// Ruta para agregar un nuevo registro
app.get('/agregar', (req, res) => {
    res.render('agregar');
});

app.post('/agregar', (req, res) => {
    const { nombre, email } = req.body;
    db.query('INSERT INTO usuarios (nombre, email) VALUES (?, ?)', [nombre, email], (err, results) => {
        if (err) throw err;
        res.redirect('/');
    });
});

// Iniciar el servidor
app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});
