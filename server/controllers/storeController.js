import { Store } from "../db.js";

// Create a new store (admin)
export const createStore = async (req, res) => {
  const { name } = req.body;
  const owner = req.user._id; // Owner is the logged-in admin

  try {
    const store = new Store({
      name,
      owner,
    });

    await store.save();
    res.status(201).json(store);
  } catch (error) {
    console.error("Error creating store:", error);
    res.status(500).json({ message: "Error creating store" });
  }
};

// Get all stores for a specific owner/admin
export const getStoresForOwner = async (req, res) => {
  const owner = req.user._id; // Owner is the logged-in admin

  try {
    const stores = await Store.find({ owner });
    res.json(stores);
  } catch (error) {
    console.error("Error fetching stores:", error);
    res.status(500).json({ message: "Error fetching stores" });
  }
};

// export const addBookToStore = async (req, res) => {
//   const { storeId } = req.params;
//   const { bookId } = req.body;

//   try {
//     const store = await Store.findById(storeId);
//     if (!store) {
//       return res.status(404).json({ message: "Store not found" });
//     }
//     store.books.push(bookId);
//     await store.save();
//     res.json(store);
//   } catch (error) {
//     console.error("Error adding book to store:", error);
//     res.status(500).json({ message: "Error adding book to store" });
//   }
// }
