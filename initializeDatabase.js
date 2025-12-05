// initializeDatabase.js


// Importa el SDK de Firebase Admin

const admin = require('firebase-admin');


// --- 1. Configura la ruta a tu archivo de credenciales ---

// Asegúrate de que 'serviceAccountKey.json' esté en la misma carpeta que este script

const serviceAccount = require('./serviceAccountKey.json');


// --- 2. Inicializa el Admin SDK ---

// Aquí le dices al SDK a qué proyecto de Firebase debe conectarse.

admin.initializeApp({

  credential: admin.credential.cert(serviceAccount),

  // Asegúrate de que esta sea la URL CORRECTA de tu Realtime Database.

  // Tu Realtime Database es: https://desarrolloenlanube-34667-816f5-default-rtdb.firebaseio.com

  databaseURL: 'https://desarrolloenlanube-34667-816f5-default-rtdb.firebaseio.com'

});


// Obtiene una referencia a tu Realtime Database

const db = admin.database();


// --- 3. Define la estructura de datos inicial ---

// Este es el "árbol" de datos que quieres crear en tu Realtime Database.

// No hay "tablas" en el sentido relacional, sino "nodos" y "rutas".

const initialData = {

  // Un nodo para usuarios

  users: {

    // Un usuario de ejemplo con un ID específico

    'user_id_1': {

      name: 'Alice Smith',

      email: 'alice@example.com',

      role: 'admin',

      createdAt: new Date().toISOString() // Almacena la fecha de creación

    },

    'user_id_2': {

      name: 'Bob Johnson',

      email: 'bob@example.com',

      role: 'viewer',

      createdAt: new Date().toISOString()

    }

  },

  // Un nodo para productos

  products: {

    'product_sku_abc': {

      name: 'Laptop Pro',

      price: 1200.00,

      stock: 50,

      description: 'Potente laptop para profesionales',

      category: 'Electronics'

    },

    'product_sku_xyz': {

      name: 'Monitor Ultra',

      price: 300.00,

      stock: 120,

      description: 'Monitor de alta resolución',

      category: 'Electronics'

    }

  },

  // Un nodo para configuraciones globales

  settings: {

    appVersion: '1.0.0',

    initialSetupCompleted: true, // Una bandera para saber si la inicialización ya se hizo

    setupDate: new Date().toISOString()

  }

};


// --- 4. Función para inicializar la base de datos ---

async function initializeDatabase() {

  try {

    console.log('Iniciando script de inicialización de la base de datos...');


    // Opcional pero recomendado: Verifica si la base de datos ya está inicializada

    // Esto evita que sobrescribas tus datos si ejecutas el script accidentalmente varias veces.

    const settingsRef = db.ref('settings/initialSetupCompleted');

    const snapshot = await settingsRef.once('value'); // 'once' lee los datos una sola vez


    if (snapshot.exists() && snapshot.val() === true) {

      console.log('¡Advertencia! La base de datos ya parece haber sido inicializada. Si deseas reiniciarla, elimina los datos manualmente o modifica el script.');

      process.exit(0); // Sale del script sin error

    }


    // Si no está inicializada o la bandera no existe, procede a establecer los datos.

    // 'db.ref('/')' apunta a la raíz de tu Realtime Database.

    // 'set()' sobrescribe completamente los datos en esa ruta con 'initialData'.

    await db.ref('/').set(initialData);


    console.log('🎉 ¡Base de datos inicializada con éxito con la estructura inicial!');

    process.exit(0); // Sale del script exitosamente

  } catch (error) {

    console.error('❌ ¡Error al inicializar la base de datos con Admin SDK!:', error);

    process.exit(1); // Sale del script con un código de error

  }

}


// Llama a la función para ejecutar el script

initializeDatabase();