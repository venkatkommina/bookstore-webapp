import express from "express";
import {
  createStore,
  getStoresForOwner,
} from "../controllers/storeController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/create", protect, createStore); // Create a new store (admin only)
router.get("/owner", protect, getStoresForOwner); // Get stores for the logged-in admin

export default router;
