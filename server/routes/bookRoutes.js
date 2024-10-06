import express from "express";
import {
  searchGoogleBooks,
  addBookToStore,
  getBooksForStore,
} from "../controllers/bookController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/search", searchGoogleBooks); // Search for books via Google API
router.post("/store/:storeId/add", protect, addBookToStore); // Add book to specific store (admin only)
router.get("/store/:storeId", getBooksForStore); // Get books for a store

export default router;
