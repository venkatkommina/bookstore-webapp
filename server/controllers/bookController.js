import axios from "axios";
import { Book, Store } from "../db.js";

// Search for books using Google Books API
export const searchGoogleBooks = async (req, res) => {
  const { query } = req.query; // Search query from the client
  if (!query) return res.status(400).json({ message: "Query is required" });

  try {
    const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${query}`;
    const response = await axios.get(apiUrl);

    if (response.data.items.length === 0) {
      return res.status(404).json({ message: "No books found" });
    }

    const books = response.data.items.map((item) => ({
      googleBookId: item.id,
      title: item.volumeInfo.title,
      authors: item.volumeInfo.authors || [],
      description: item.volumeInfo.description,
      thumbnail: item.volumeInfo.imageLinks?.thumbnail, //optional chaining
      publishedDate: item.volumeInfo.publishedDate,
    }));

    res.json(books);
  } catch (error) {
    console.error("Error fetching data from Google Books API:", error);
    res.status(500).json({ message: "Error fetching books" });
  }
};

// Add a book to store (admin)
export const addBookToStore = async (req, res) => {
  const {
    googleBookId,
    title,
    authors,
    description,
    thumbnail,
    publishedDate,
  } = req.body;
  const { storeId } = req.params;

  try {
    const store = await Store.findById(storeId);
    if (!store) return res.status(404).json({ message: "Store not found" });

    // Create a new book
    const newBook = new Book({
      googleBookId,
      title,
      authors,
      description,
      thumbnail,
      publishedDate,
      store: store._id,
    });

    await newBook.save();
    store.books.push(newBook._id);
    await store.save();

    res.status(201).json(newBook);
  } catch (error) {
    console.error("Error adding book to store:", error);
    res.status(500).json({ message: "Error adding book" });
  }
};

// Get books for a specific store
export const getBooksForStore = async (req, res) => {
  const { storeId } = req.params;

  try {
    const store = await Store.findById(storeId).populate("books");
    if (!store) return res.status(404).json({ message: "Store not found" });

    res.json(store.books);
  } catch (error) {
    console.error("Error fetching books for store:", error);
    res.status(500).json({ message: "Error fetching books" });
  }
};
