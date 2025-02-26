import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Routes
const PRODUCTS_FILE = path.join(__dirname, "../data/products.json");
const CARTS_FILE = path.join(__dirname, "../data/cart.json");

// Read JSON
export const readJSONFile = async (filePath) => {
    try {
        const data = await fs.readFile(filePath, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

// Write JSON
export const writeJSONFile = async (filePath, data) => {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
};

export { PRODUCTS_FILE, CARTS_FILE };
