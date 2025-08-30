const express = require('express');
const { MongoClient, ObjectId } = require('mongodb'); // ✅ Importa ObjectId aquí
const path = require('path');
const app = express();
const port = 3000;

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname)));
app.use(express.json());

// URL de conexión a MongoDB
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

let pedidosCollection;

// Conexión a la base de datos
async function connectDB() {
  try {
    await client.connect();
    const db = client.db('rusticorder');
    pedidosCollection = db.collection('pedidos');
    console.log('✅ Conectado a MongoDB');
  } catch (error) {
    console.error('❌ Error al conectar con MongoDB:', error);
    process.exit(1);
  }
}

// Ruta principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// API: Listar todos los pedidos
app.get('/api/pedidos', async (req, res) => {
  try {
    const pedidos = await pedidosCollection.find().toArray();
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los pedidos', error });
  }
});

// API: Registrar un nuevo pedido
app.post('/api/pedidos', async (req, res) => {
  try {
    const nuevoPedido = {
      ...req.body,
      fecha: new Date().toLocaleString()
    };
    const result = await pedidosCollection.insertOne(nuevoPedido);
    res.status(201).json({
      message: 'Pedido registrado con éxito',
      id: result.insertedId
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar el pedido', error });
  }
});

// API: Actualizar el estado de un pedido por ID
app.put('/api/pedidos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    if (!estado) {
      return res.status(400).json({ message: 'El campo "estado" es obligatorio' });
    }

    // ✅ Usa ObjectId correctamente
    const result = await pedidosCollection.updateOne(
      { _id: new ObjectId(id) }, // ✅ Así se debe usar
      { $set: { estado } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }

    res.json({ message: 'Estado actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar el estado:', error);
    res.status(500).json({ message: 'Error al actualizar el estado', error: {} });
  }
});

// Iniciar el servidor
async function startServer() {
  await connectDB();
  app.listen(port, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${port}`);
    console.log(`🔗 API REST disponible en:`);
    console.log(`   GET  http://localhost:3000/api/pedidos`);
    console.log(`   POST http://localhost:3000/api/pedidos`);
    console.log(`   PUT  http://localhost:3000/api/pedidos/:id`);
  });
}

startServer();