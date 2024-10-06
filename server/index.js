import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db.js";
import cors from "cors";

import userRoutes from "./routes/userRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import storeRoutes from "./routes/storeRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/users", userRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/stores", storeRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}, please visit http://localhost:${PORT}`
  );
});
