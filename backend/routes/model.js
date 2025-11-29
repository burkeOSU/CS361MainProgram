import { readdir, readFile, writeFile, unlink } from 'node:fs/promises';
import fs from "node:fs";
import { randomUUID } from 'node:crypto';
//https://nodejs.org/api/child_process.html#child_processexeccommand-options-callback
import { exec } from "child_process";

function getDateTime() {
    return new Promise((resolve, reject) => {
        exec("python ./microservices/getdatetime/datetime-client.py", (err, stdout, stderr) => {
            if (err) {
                reject("Microservice error: " + stderr);
            } else {
                resolve(stdout.trim());
            }
        });
    });
}

function moodTag(user, entryId, mood) {
    return new Promise((resolve, reject) => {
        // Pass values through environment variables
        const env = { ...process.env, moodUser: user, moodEntryId: entryId, moodMood: mood };
        exec("python ./microservices/moodtag/moodtag-client.py", { env }, (err, stdout, stderr) => {
            if (err) {
                reject("Microservice error: " + stderr);
            } else {
                resolve(stdout.trim());
            }
        });
    });
}

function keywordSearch(user, keyword) {
    return new Promise((resolve, reject) => {
        // Pass values through environment variables
        const env = { ...process.env, searchUser: user, searchKeyword: keyword };
        exec("python ./microservices/searchentry/search-entry-client.py", { env }, (err, stdout, stderr) => {
            if (err) {
                reject("Microservice error: " + stderr);
            } else {
                resolve(stdout.trim());
            }
        });
    });
}

function isDateValid(date) {
    const format = /^\d\d-\d\d-\d\d\d\d$/;
    return format.test(date);
}

async function createEntry(user, data) {
    const id = randomUUID();
    const userPath = `./data/${user}`;
    const fileName = (`${userPath}/${id}.json`);
    const dateTime = await getDateTime();
    const entry = { id: id, date: dateTime, text: data.text, mood: data.mood };
    await writeFile(fileName, JSON.stringify(entry));
    await moodTag(user, id, entry.mood);
    return getEntryWithId(user, id);
}

async function getEntries(user) {
    const userPath = `./data/${user}`;
    const files = await readdir(userPath);
    return files.map((fileName) => {
        const entry = JSON.parse(fs.readFileSync(`${userPath}/${fileName}`));
        return { id: entry.id, date: entry.date, text: entry.text.substring(0, 400), mood: entry.mood };
    }).sort((a, b) => b.date.localeCompare(a.date));
}

async function getEntryWithId(user, id) {
    const userPath = `./data/${user}`;
    try {
        console.log(`${userPath}/${id}.json`);
        return JSON.parse(await readFile(`${userPath}/${id}.json`));
    }
    catch (err) {
        return undefined;
    }
}

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

async function deleteEntry(user, id) {
    const userPath = `./data/${user}`;
    const fileName = `${userPath}/${id}.json`;

    try {
        await unlink(fileName);
        return true;
    } catch (err) {
        if (err.code === 'ENOENT') {
            return false;
        }
        throw err;
    }
}

async function editEntry(user, id, data) {
    const userPath = `./data/${user}`;
    const fileName = (`${userPath}/${id}.json`);
    try {
        const oldEntry = JSON.parse(await readFile(fileName));

        const updatedEntry = {id, date: oldEntry.date, text: data.text, mood: data.mood || oldEntry.mood};
        await writeFile(fileName, JSON.stringify(updatedEntry));
        await moodTag(user, id, updatedEntry.mood)
        return updatedEntry;
    } catch (err) {
        console.error(err);
        return undefined;
    }
}

async function getEntryWithMood(user, mood) {
    const all = await getEntries(user);
    return all.filter(entry => entry.mood === mood);
}

export {
    isDateValid,
    createEntry,
    getEntries,
    getEntryWithId,
    userLogin,
    deleteEntry,
    editEntry,
    getDateTime,
    moodTag,
    getEntryWithMood,
    keywordSearch
};