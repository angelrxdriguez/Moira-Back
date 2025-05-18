const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors'); 
const app = express();
app.use(cors());
app.use(express.json());
const uri= "mongodb+srv://angelrp:abc123.@cluster0.76po7.mongodb.net/moira?retryWrites=true&w=majority&appName=Cluster0";
//const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
let collection;
async function connectToDB() {
  try {
    await client.connect();
    const database = client.db('restaurante');
    collection = database.collection('usuarios');
    console.log("Conectado a MongoDB");
  } catch (err) {
    console.error("Error al conectar a MongoDB:", err);
  }
}
connectToDB();

app.get('/api/check-db', async (req, res) => {
  try {
    if (!client.topology || !client.topology.isConnected()) {
      await client.connect();
    }
    const test = await collection.findOne();
    res.json({ message: 'Te conecta a mongo', test });
  } catch (error) {
    res.status(500).json({ message: 'Error al conectar con Mongo', error });
  }
});

app.get('/api', (req, res) => {
  res.json({ message: 'Bienvenido a la API' });
});

// Registro de usuario
app.post("/api/register", async (req, res) => {
  try {
    console.log(req.body);
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Todos los campos son obligatorios." });
    }

    const existingUser = await collection.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Este correo ya está registrado." });
    }

    await collection.insertOne({ email, password });

    res.status(201).json({ success: true, message: "Usuario registrado correctamente." });
  } catch (error) {
    console.error("Error en el registro:", error);
    res.status(500).json({ success: false, message: "Error en el servidor." });
  }
});
app.post("/api/login", async (req, res) => {
  try {
      console.log("Datos recibidos en /api/login:", req.body);
      const { email, password } = req.body;

      if (!email || !password) {
          return res.status(400).json({ success: false, message: "Todos los campos son obligatorios." });
      }

      const user = await collection.findOne({ email, password });

      if (!user) {
          return res.status(401).json({ success: false, message: "Correo o contraseña incorrectos." });
      }

      res.status(200).json({ success: true, message: "Inicio de sesión exitoso." });
  } catch (error) {
      console.error("🔥 Error en el login:", error);
      res.status(500).json({ success: false, message: "Error en el servidor." });
  }
});
// Endpoint para crear una reserva
app.post("/api/reservas", async (req, res) => {
  try {
      const { nombre, telefono, comensales, fecha, hora } = req.body;

      if (!nombre || !telefono || !comensales || !fecha || !hora) {
          return res.status(400).json({ success: false, message: "Todos los campos son obligatorios." });
      }

      // Convertir la fecha a tipo Date para ordenamiento futuro
      const fechaReserva = new Date(fecha);

      // Insertar en la colección "reservas"
      await client.db("restaurante").collection("reservas").insertOne({
          nombre,
          telefono,
          comensales: parseInt(comensales),
          fecha: fechaReserva,
          hora
      });

      res.status(201).json({ success: true, message: "Reserva creada exitosamente." });
  } catch (error) {
      console.error("Error al crear la reserva:", error);
      res.status(500).json({ success: false, message: "Error en el servidor." });
  }
});
app.get("/api/reservas", async (req, res) => {
  try {
    const reservas = await client.db("restaurante").collection("reservas").find().toArray();
    res.status(200).json({ success: true, reservas });
  } catch (error) {
    console.error("Error al obtener reservas:", error);
    res.status(500).json({ success: false, message: "Error al obtener las reservas." });
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