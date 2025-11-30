import { readdir, readFile, writeFile, unlink } from "node:fs/promises";
import fs from "node:fs";
import { randomUUID } from "node:crypto";
import { exec } from "child_process";

// Microservice: Get Date and Time
function getDateTime() {
  return new Promise((resolve, reject) => {
    // execute microservice client file
    exec(
      "python ./microservices/getdatetime/datetime-client.py",
      (err, stdout, stderr) => {
        if (err) {
          reject("Microservice error: " + stderr);
        } else {
          resolve(stdout.trim());
        }
      }
    );
  });
}

// Microservice: Mood Tagging
function moodTag(user, entryId, mood) {
  return new Promise((resolve, reject) => {
    // Pass values through environment variables: user, entryId, mood
    const env = {
      ...process.env,
      moodUser: user,
      moodEntryId: entryId,
      moodMood: mood,
    };
    // execute microservice client file with environment variables
    exec(
      "python ./microservices/moodtag/moodtag-client.py",
      { env },
      (err, stdout, stderr) => {
        if (err) {
          reject("Microservice error: " + stderr);
        } else {
          resolve(stdout.trim());
        }
      }
    );
  });
}

// Microservice: Search Journal Entries
function keywordSearch(user, keyword) {
  return new Promise((resolve, reject) => {
    // Pass values through environment variables: user, keyword
    const env = { ...process.env, searchUser: user, searchKeyword: keyword };
    // execute microservice client file with environment variables
    exec(
      "python ./microservices/searchentry/search-entry-client.py",
      { env },
      (err, stdout, stderr) => {
        if (err) {
          reject("Microservice error: " + stderr);
        } else {
          resolve(stdout.trim());
        }
      }
    );
  });
}

// Microservice: Word Ranking List
function wordRank(user) {
  return new Promise((resolve, reject) => {
    // Pass values through environment variable: user
    const env = { ...process.env, rankUser: user };
    // execute microservice client file with environment variables
    exec(
      "python ./microservices/wordrank/wordrank-client.py",
      { env },
      (err, stdout, stderr) => {
        if (err) {
          reject("Microservice error: " + stderr);
        } else {
          resolve(stdout.trim());
        }
      }
    );
  });
}

// Create new entry
async function createEntry(user, data) {
  // Generate unique id for entry
  const id = randomUUID();
  const userPath = `./data/${user}`;
  const fileName = `${userPath}/${id}.json`;
  const dateTime = await getDateTime();
  const entry = { id: id, date: dateTime, text: data.text, mood: data.mood };
  await writeFile(fileName, JSON.stringify(entry));
  await moodTag(user, id, entry.mood);
  return getEntryWithId(user, id);
}

// Get entries for user
async function getEntries(user) {
  const userPath = `./data/${user}`;
  const files = await readdir(userPath);
  // Add all user's entries to map
  return files
    .map((fileName) => {
      const entry = JSON.parse(fs.readFileSync(`${userPath}/${fileName}`));
      return {
        id: entry.id,
        date: entry.date,
        text: entry.text.substring(0, 400),
        mood: entry.mood,
      };
      // Sort by descending date/time order
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

// View entry
async function getEntryWithId(user, id) {
  const userPath = `./data/${user}`;
  try {
    console.log(`${userPath}/${id}.json`);
    return JSON.parse(await readFile(`${userPath}/${id}.json`));
  } catch (err) {
    return undefined;
  }
}

// Login
async function userLogin(user, pass) {
  try {
    const userPath = `./users/${user}.json`;
    const contents = await readFile(userPath);
    const userData = JSON.parse(contents);
    if (userData.pass === pass) {
      return { user: userData.user };
    }
  } catch (err) {
    return undefined;
  }
}

// Delete entry
async function deleteEntry(user, id) {
  const userPath = `./data/${user}`;
  const fileName = `${userPath}/${id}.json`;

  try {
    await unlink(fileName);
    return true;
  } catch (err) {
    if (err.code === "ENOENT") {
      return false;
    }
    throw err;
  }
}

// Edit entry
async function editEntry(user, id, data) {
  const userPath = `./data/${user}`;
  const fileName = `${userPath}/${id}.json`;
  try {
    // store original entry
    const oldEntry = JSON.parse(await readFile(fileName));
    // save original date, save original or updated mood
    const updatedEntry = {
      id,
      date: oldEntry.date,
      text: data.text,
      mood: data.mood || oldEntry.mood,
    };
    await writeFile(fileName, JSON.stringify(updatedEntry));
    await moodTag(user, id, updatedEntry.mood);
    return updatedEntry;
  } catch (err) {
    console.error(err);
    return undefined;
  }
}

// Filter entries by mood tag
async function getEntryWithMood(user, mood) {
  const all = await getEntries(user);
  return all.filter((entry) => entry.mood === mood);
}

export {
  createEntry,
  getEntries,
  getEntryWithId,
  userLogin,
  deleteEntry,
  editEntry,
  getDateTime,
  moodTag,
  getEntryWithMood,
  keywordSearch,
  wordRank,
};
