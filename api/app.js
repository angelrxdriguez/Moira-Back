// app.js
const express = require('express');
const cors = require('cors');
const connectToDB = require('./db'); // archivo de cone

const app = express();
app.use(cors());
app.use(express.json());

/*ENDPOINTS*/
// Tipos de ofertas
app.get('/api/tiposOfertas', async (req, res) => {
  try {
    const { db } = await connectToDB();
    const tiposOfertasCollection = db.collection('tiposOfertas');
    const tipos = await tiposOfertasCollection.find({}).toArray();
    res.json(tipos);
  } catch (error) {
    console.error('Error al obtener tipos de ofertas:', error);
    res.status(500).json({ message: 'Error al obtener tipos de ofertas' });
  }
});

// Ruta de prueba
app.get('/api/check-db', async (req, res) => {
  try {
    const { db } = await connectToDB();
    const usuariosCollection = db.collection('usuarios');
    const test = await usuariosCollection.findOne();
    res.json({ message: 'Te conecta a mongo', test });
  } catch (error) {
    res.status(500).json({ message: 'Error al conectar con Mongo', error });
  }
});

// Ruta base
app.get('/api', (req, res) => {
  res.json({ message: 'Bienvenido a la API' });
});

// Registro de usuarios
app.post('/api/registrar', async (req, res) => {
  try {
    const { usuario, email, contra, fechaNacimiento } = req.body;
    if (!usuario || !email || !contra || !fechaNacimiento) {
      return res.status(400).json({ message: 'Faltan campos obligatorios.' });
    }

    const nuevoUsuario = { usuario, email, contra, fechaNacimiento };

    const { db } = await connectToDB();
    const usuariosCollection = db.collection('usuarios');
    const resultado = await usuariosCollection.insertOne(nuevoUsuario);

    res.status(201).json({ message: 'Usuario creado', id: resultado.insertedId });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Comunidades
app.get("/api/ubicaciones/comunidades", async (req, res) => {
  const { db } = await connectToDB();
  const ubicacionesCollection = db.collection('ubicaciones');
  const doc = await ubicacionesCollection.findOne({});
  if (!doc) return res.status(404).send([]);
  const comunidades = Object.keys(doc).filter(k => k !== "_id");
  res.json(comunidades);
});

// Provincias
app.get("/api/ubicaciones/provincias/:comunidad", async (req, res) => {
  const { comunidad } = req.params;
  const { db } = await connectToDB();
  const ubicacionesCollection = db.collection('ubicaciones');
  const doc = await ubicacionesCollection.findOne({});
  if (!doc || !doc[comunidad]) return res.status(404).send([]);
  const provincias = Object.keys(doc[comunidad]);
  res.json(provincias);
});

// Ciudades
app.get("/api/ubicaciones/ciudades/:comunidad/:provincia", async (req, res) => {
  const { comunidad, provincia } = req.params;
  const { db } = await connectToDB();
  const ubicacionesCollection = db.collection('ubicaciones');
  const doc = await ubicacionesCollection.findOne({});
  if (!doc || !doc[comunidad] || !doc[comunidad][provincia]) return res.status(404).send([]);
  res.json(doc[comunidad][provincia]);
});
//LOGIN
app.post('/api/login', async (req, res) => {
  const { email, contra } = req.body;

  if (!email || !contra) {
    return res.status(400).json({ message: 'Faltan datos de inicio de sesión.' });
  }

  try {
    const { db } = await connectToDB();
    const usuariosCollection = db.collection('usuarios');
    const usuario = await usuariosCollection.findOne({ email });

    if (!usuario || usuario.contra !== contra) {
      return res.status(401).json({ message: 'Credenciales incorrectas.' });
    }

    res.status(200).json({
      message: 'Login exitoso',
      usuario: {
        id: usuario._id,
        nombre: usuario.usuario,
        email: usuario.email
      }
    });
  } catch (err) {
    console.error("Error en login:", err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});


module.exports = app;



/*
// Configurar CORS (uso del middleware CORS)
app.use(cors({
  origin: 'https://frontapi-six.vercel.app', // Aquí pones el dominio de tu frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
// Rutas
app.get('/api', (req, res) => {
  res.json({ message: 'Bienvenido a la API' });
});
// Obtener todos los usuarios
app.get('/api/usuarios', async (req, res) => {
  if (!collection) return res.status(500).json({ error: "Base de datos no conectada" });
  try {
    const usuarios = await collection.find().toArray();
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
});
// Obtener el primer usuario
app.get('/api/usuarios1', async (req, res) => {
  if (!collection) return res.status(500).json({ error: "Base de datos no conectada" });
  try {
    const primerUsuario = await collection.findOne(); // Obtiene el primer documento
    res.json(primerUsuario);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener el usuario" });
  }
});
// Obtener usuario por ID
app.get('/api/usuarios/:id', async (req, res) => {
  if (!collection) return res.status(500).json({ error: "Base de datos no conectada" });
  try {
    const { id } = req.params;
    const usuario = await collection.findOne({ id: parseInt(id) });
    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(usuario);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener usuario" });
  }
});
// Crear un nuevo usuario
app.post('/api/crear', async (req, res) => {
  if (!collection) return res.status(500).json({ error: "Base de datos no conectada" });
  try {
    const { nombre, apellido } = req.body;
    const nuevoUsuario = { nombre, apellido };
    await collection.insertOne(nuevoUsuario);
    res.status(201).json(nuevoUsuario);
  } catch (err) {
    res.status(500).json({ error: "Error al crear usuario" });
  }
});
// Ruta para manejar errores 404
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});
// Manejo de errores generales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Error interno del servidor" });
});
module.exports = app;
*/






























































































//angel