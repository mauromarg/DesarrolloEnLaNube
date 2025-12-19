const { getFirestore } = require("firebase-admin/firestore");

// Función para añadir documentos a una colección solo si está vacía
async function seedCollection(collection, data, idField) {
  const snapshot = await collection.limit(1).get();
  if (snapshot.empty) {
    console.log(`Creando colección de ${collection.id}...`);
    const batch = collection.firestore.batch();
    for (const item of data) {
      const docRef = collection.doc(item[idField]);
      batch.set(docRef, item);
    }
    await batch.commit();
    console.log(`Colección de ${collection.id} creada con éxito.`);
  } else {
    console.log(`La colección de ${collection.id} ya existe.`);
  }
}

// Datos de ejemplo
const usuariosData = [
  { 
    id: 'cliente-1',
    nombre: 'Ana',
    apellido: 'García',
    DNI: '12345678A',
    telefono: '600111222',
    email: 'ana.garcia@example.com',
    password: 'hashed_password_1',
    fecha: new Date(),
    rol: 'cliente'
  },
  {
    id: 'admin-1',
    nombre: 'Carlos',
    apellido: 'Martínez',
    DNI: '87654321Z',
    telefono: '600333444',
    email: 'carlos.martinez@example.com',
    password: 'hashed_password_2',
    fecha: new Date(),
    rol: 'admin'
  }
];

const habitacionesData = [
  {
    id: 'hab-101',
    numero: '101',
    planta: '1',
    tipo: 'individual',
    capacidad: 1,
    precio: 80.50,
    disponibilidad: true
  },
  {
    id: 'hab-205',
    numero: '205',
    planta: '2',
    tipo: 'doble',
    capacidad: 2,
    precio: 120.00,
    disponibilidad: false
  },
  {
    id: 'hab-310',
    numero: '310',
    planta: '3',
    tipo: 'suite',
    capacidad: 4,
    precio: 250.75,
    disponibilidad: true
  }
];

const reservasData = [
  {
    numero_reserva: 'res-001',
    entrada: new Date(new Date().setDate(new Date().getDate() + 1)),
    salida: new Date(new Date().setDate(new Date().getDate() + 5)),
    reserva: new Date(),
    estadoPago: true,
    precioTotal: 480.00,
    habitaciones: ['hab-205'], // Array de IDs de habitación
    idCliente: 'cliente-1' // ID del usuario
  }
];

const serviciosData = [
    {
        id: 'serv-01',
        nombre: "Desayuno Buffet",
        descripcion: "Acceso completo a nuestro desayuno buffet.",
        precio: 15.00,
        disponibilidad: true,
        categoria: "Alimentación"
    },
    {
        id: 'serv-02',
        nombre: "Servicio de Spa",
        descripcion: "Sesión de relajación de 1 hora en nuestro spa.",
        precio: 75.00,
        disponibilidad: true,
        categoria: "Bienestar"
    }
];

const llavesData = [
    {
        idLlave: 'llave-001',
        codigoAcceso: 'NFC_CODE_A1B2C3D4', // Código que leería el NFC
        fechaInicio: new Date(new Date().setDate(new Date().getDate() + 1)),
        fechaExpiracion: new Date(new Date().setDate(new Date().getDate() + 5)),
        activa: true,
        idHabitacion: 'hab-205',
        idReserva: 'res-001'
    }
];


// Función principal para inicializar la base de datos
async function initializeDatabase() {
  const firestore = getFirestore();

  await seedCollection(firestore.collection('usuarios'), usuariosData, 'id');
  await seedCollection(firestore.collection('habitaciones'), habitacionesData, 'id');
  await seedCollection(firestore.collection('reservas'), reservasData, 'numero_reserva');
  await seedCollection(firestore.collection('servicios'), serviciosData, 'id');
  await seedCollection(firestore.collection('llaves'), llavesData, 'idLlave');

  console.log('Verificación de la base de datos completada.');
}

if (require.main === module) {
  const { initializeApp, cert } = require("firebase-admin/app");
  const serviceAccount = require("./serviceAccountKey.json");

  try {
    initializeApp({
      credential: cert(serviceAccount)
    });
    console.log("App de Firebase inicializada para el script.");
    initializeDatabase().catch(console.error);
  } catch(e) {
      if (e.code === 'app/duplicate-app') {
          console.log('La app de Firebase ya parece estar inicializada.');
          initializeDatabase().catch(console.error);
      } else {
          console.error("Error al inicializar la app de Firebase:", e);
      }
  }
}

module.exports = initializeDatabase;
