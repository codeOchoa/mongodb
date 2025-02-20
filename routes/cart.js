import express from "express";
import { readJSONFile, writeJSONFile, CARTS_FILE, PRODUCTS_FILE } from "../utils/fileManager.js";

const router = express.Router();

// POST /api/carts Create
router.post("/", async (req, res) => {
    const carts = await readJSONFile(CARTS_FILE);
    const newCart = {
        id: String(carts.length + 1),
        products: [],
    };

    carts.push(newCart);
    await writeJSONFile(CARTS_FILE, carts);

    res.status(201).json(newCart);
});

// GET /api/carts/:cid for ID
router.get("/:cid", async (req, res) => {
    const carts = await readJSONFile(CARTS_FILE);
    const cart = carts.find((c) => c.id === req.params.cid);

    if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
    }

    res.json(cart);
});

// POST /api/carts/:cid/product/:pid Add
router.post("/:cid/product/:pid", async (req, res) => {
    const carts = await readJSONFile(CARTS_FILE);
    const products = await readJSONFile(PRODUCTS_FILE);

    const cart = carts.find((c) => c.id === req.params.cid);
    const product = products.find((p) => p.id === req.params.pid);

    if (!cart) return res.status(404).json({ message: "Cart not found" });
    if (!product) return res.status(404).json({ message: "Prodcut not found" });

    const existingProduct = cart.products.find((p) => p.product === req.params.pid);

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.products.push({ product: req.params.pid, quantity: 1 });
    }

    await writeJSONFile(CARTS_FILE, carts);
    res.json(cart);
});

export default router;
