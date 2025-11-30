import express from "express";
import * as entries from "./model.js";
const router = express.Router();

// Login
router.post("/login", async (req, res) => {
  // validate username and password
  const validUser = await entries.userLogin(req.body.user, req.body.pass);
  if (!validUser) {
    res.status(403).json({ Error: "Invalid username and/or password" });
  } else {
    console.log(validUser);
    res.status(200).json(validUser);
  }
});

// Validate entry submission
function isEntryValid(body) {
  const keys = Object.keys(body);
  const requiredKeys = ["text"];

  let allKeysPresent = true;
  for (const requiredKey of requiredKeys) {
    if (!keys.includes(requiredKey)) {
      allKeysPresent = false;
      break;
    }
  }

  // keys: text and mood (none = default mood)
  if (keys.length < 1 || keys.length > 2 || !allKeysPresent) return false;

  const { text, mood } = body;

  if (typeof text !== "string" || text.trim().length === 0) return false;

  if (keys.includes("mood")) {
    const validMoods = ["none", "happy", "neutral", "sad", "angry"];
    if (!validMoods.includes(mood)) return false;
  }

  return true;
}

// Create new entry
router.post("/entries", async (req, res) => {
  if (!isEntryValid(req.body)) {
    res.status(400).json({ Error: "Invalid request" });
  } else {
    const newEntry = await entries.createEntry(req.query.user, req.body);
    res.status(201).json(newEntry);
  }
});

// Get all entries of user
router.get("/entries", async (req, res) => {
  const found = await entries.getEntries(req.query.user);
  res.status(200).json(found);
});

// Filter entries by mood
router.get("/entries/filter", async (req, res) => {
  const { user, mood } = req.query;
  const foundMood = await entries.getEntryWithMood(user, mood);
  res.status(200).json(foundMood);
});

// Search entries by keyword
router.get("/entries/search", async (req, res) => {
  const { user, keyword } = req.query;

  const foundKeyword = await entries.keywordSearch(user, keyword);
  // (/'/g, '"') = search for every single quote in python list return, replace with double quotes (needed for JSON)
  const filenames = JSON.parse(foundKeyword.replace(/'/g, '"'));

  const entryList = [];
  for (const file of filenames) {
    const id = file.replace(".json", "");
    // Load entry, add to search list
    const entry = await entries.getEntryWithId(user, id);
    if (entry) entryList.push(entry);
  }
  return res.status(200).json(entryList);
});

// Rank 10 top most used words
router.get("/entries/ranking", async (req, res) => {
  const result = await entries.wordRank(req.query.user);
  const ranked = JSON.parse(result);
  res.status(200).json(ranked);
});

// View entry
router.get("/entries/:id", async (req, res) => {
  const found = await entries.getEntryWithId(req.query.user, req.params.id);
  if (!found) {
    res.status(404).json({ Error: "Not found" });
  } else {
    res.status(200).json(found);
  }
});

// Delete entry
router.delete("/entries/:id", async (req, res) => {
  const { id } = req.params;
  const { user } = req.query;

  try {
    const deleted = await entries.deleteEntry(user, id);
    if (deleted) {
      res.status(200).json({ message: "Entry deleted" });
    } else {
      res.status(404).json({ error: "Entry not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Edit entry
router.put("/entries/:id", async (req, res) => {
  const { id } = req.params;
  const { user } = req.query;

  if (!isEntryValid(req.body)) {
    res.status(400).json({ Error: "Invalid request" });
  }
  const updated = await entries.editEntry(user, id, req.body);
  if (!updated) {
    return res.status(404).json({ error: "Entry not found" });
  }
  res.status(200).json(updated);
});

export default router;
