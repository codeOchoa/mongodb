import express from 'express';
import { readJSONFile, PRODUCTS_FILE } from '../utils/fileManager.js';

const router = express.Router();

// Home static
router.get('/', async (req, res) => {
  const products = await readJSONFile(PRODUCTS_FILE);
  res.render('home', { title: 'Home', products });
});

// Real time products refresh
router.get('/realtimeproducts', async (req, res) => {
  const products = await readJSONFile(PRODUCTS_FILE);
  res.render('realTimeProducts', { title: 'Products in real time', products });
});

export default router;
