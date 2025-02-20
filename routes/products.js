import express from "express";
import { readJSONFile, writeJSONFile, PRODUCTS_FILE } from "../utils/fileManager.js";

const router = express.Router();

// GET /api/products with ?limit
router.get("/", async (req, res) => {
    const products = await readJSONFile(PRODUCTS_FILE);
    const { limit } = req.query;

    if (limit) {
        return res.json(products.slice(0, Number(limit)));
    }

    res.json(products);
});

// GET /api/products/:pid for ID
router.get("/:pid", async (req, res) => {
    const products = await readJSONFile(PRODUCTS_FILE);
    const product = products.find((p) => p.id === req.params.pid);

    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
});

// POST /api/products Add
router.post("/", async (req, res) => {
    const products = await readJSONFile(PRODUCTS_FILE);
    const { title, description, code, price, stock, category, thumbnails = [] } = req.body;

    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const newProduct = {
        id: String(products.length + 1),
        title,
        description,
        code,
        price,
        status: true,
        stock,
        category,
        thumbnails,
    };

    products.push(newProduct);
    await writeJSONFile(PRODUCTS_FILE, products);

    res.status(201).json(newProduct);
});

// PUT /api/products/:pid Modify
router.put("/:pid", async (req, res) => {
    const products = await readJSONFile(PRODUCTS_FILE);
    const productIndex = products.findIndex((p) => p.id === req.params.pid);

    if (productIndex === -1) {
        return res.status(404).json({ message: "Product not found" });
    }

    products[productIndex] = { ...products[productIndex], ...req.body, id: products[productIndex].id };
    await writeJSONFile(PRODUCTS_FILE, products);

    res.json(products[productIndex]);
});

// DELETE /api/products/:pid Remove
router.delete("/:pid", async (req, res) => {
    let products = await readJSONFile(PRODUCTS_FILE);
    const filteredProducts = products.filter((p) => p.id !== req.params.pid);

    if (filteredProducts.length === products.length) {
        return res.status(404).json({ message: "Product not found" });
    }

    await writeJSONFile(PRODUCTS_FILE, filteredProducts);
    res.json({ message: "Product removed" });
});

export default router;
