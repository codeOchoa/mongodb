import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { engine } from 'express-handlebars';
import productsRouter from './routes/products.js';
import cartsRouter from './routes/cart.js';
import viewsRouter from './routes/views.js';
import { readJSONFile, writeJSONFile, PRODUCTS_FILE } from './utils/fileManager.js';

const app = express();
const server = createServer(app);
const io = new Server(server);

const PORT = 8080;

// Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

// Middleware
app.use(express.static('public'));
app.use(express.json());

// Routes
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

// WebSocket
io.on('connection', async (socket) => {
  console.log('🟢 Client connected');

  const products = await readJSONFile(PRODUCTS_FILE);
  socket.emit('updateProducts', products);

  socket.on('newProduct', async (product) => {
    const products = await readJSONFile(PRODUCTS_FILE);
    product.id = String(products.length + 1);
    products.push(product);
    await writeJSONFile(PRODUCTS_FILE, products);
    io.emit('updateProducts', products);
  });

  socket.on('deleteProduct', async (productId) => {
    let products = await readJSONFile(PRODUCTS_FILE);
    products = products.filter((p) => p.id !== productId);
    await writeJSONFile(PRODUCTS_FILE, products);
    io.emit('updateProducts', products);
  });
});

server.listen(PORT, () => {
  console.log('🔥 Server listening on http://localhost:${PORT}');
});
