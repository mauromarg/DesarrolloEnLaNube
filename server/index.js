const express = require("express");
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const initializeDatabase = require("./initializeDatabase");

// Reemplaza con la ruta a tu clave de cuenta de servicio de Firebase
const serviceAccount = require("./serviceAccountKey.json");

initializeApp({
  credential: cert(serviceAccount)
});

const app = express();
app.use(express.json());

// Inicializar la base de datos
initializeDatabase();

const db = getFirestore();

// Endpoint para obtener todas las habitaciones
app.get("/api/habitaciones", async (req, res) => {
  try {
    const snapshot = await db.collection("habitaciones").get();
    const habitaciones = [];
    snapshot.forEach(doc => {
      habitaciones.push({ id: doc.id, ...doc.data() });
    });
    res.status(200).json(habitaciones);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Endpoint para obtener todos los usuarios
app.get("/api/usuarios", async (req, res) => {
  try {
    const snapshot = await db.collection("usuarios").get();
    const usuarios = [];
    snapshot.forEach(doc => {
      usuarios.push({ id: doc.id, ...doc.data() });
    });
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Endpoint para obtener todas las reservas
app.get("/api/reservas", async (req, res) => {
  try {
    const snapshot = await db.collection("reservas").get();
    const reservas = [];
    snapshot.forEach(doc => {
      reservas.push({ id: doc.id, ...doc.data() });
    });
    res.status(200).json(reservas);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Endpoint para crear una nueva reserva
app.post("/api/reservas", async (req, res) => {
  try {
    const { clienteId, habitacionId, fechaEntrada, fechaSalida } = req.body;
    const newReservation = {
      clienteId,
      habitacionId,
      fechaEntrada: new Date(fechaEntrada),
      fechaSalida: new Date(fechaSalida),
      estado: 'activa'
    };
    const docRef = await db.collection("reservas").add(newReservation);
    res.status(201).json({ id: docRef.id, ...newReservation });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Servir la aplicación cliente
app.use(express.static("public"));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
