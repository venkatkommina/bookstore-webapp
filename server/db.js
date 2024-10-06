import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async () => {
  try {
    const connectionString =
      process.env.MONGODB_URL || "mongodb://127.0.0.1:27017/bookstore";
    await mongoose.connect(connectionString);
    console.log("MongoDB connected...");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

// const adminSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   createdAt: { type: Date, default: Date.now },
// });

// const Admin = mongoose.model("Admin", adminSchema);

const storeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  books: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
  qrCode: { type: String }, // Can hold QR code link for store
  createdAt: { type: Date, default: Date.now },
});

export const Store = mongoose.model("Store", storeSchema);

const bookSchema = new mongoose.Schema({
  googleBookId: { type: String, required: true }, // Google Books ID
  title: { type: String, required: true },
  authors: [{ type: String }],
  description: { type: String },
  thumbnail: { type: String },
  publishedDate: { type: String },
  store: { type: mongoose.Schema.Types.ObjectId, ref: "Store", required: true },
  createdAt: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema({
  //User means the admin
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  //   wishList: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
  createdAt: { type: Date, default: Date.now },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export const Book = mongoose.model("Book", bookSchema);

export const User = mongoose.model("User", userSchema);

// module.exports = { connectDB, Store, Book, User };
