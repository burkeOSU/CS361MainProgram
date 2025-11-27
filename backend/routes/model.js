import { readdir, readFile, writeFile, unlink } from 'node:fs/promises';
import fs from "node:fs";
import { randomUUID } from 'node:crypto';

function isDateValid(date) {
    const format = /^\d\d-\d\d-\d\d\d\d$/;
    return format.test(date);
}

async function createEntry(user, data) {
    const id = randomUUID();
    const userPath = `./data/${user}`;
    const fileName = (`${userPath}/${id}.json`);
    data.id = id;
    await writeFile(fileName, JSON.stringify(data));
    return getEntryWithId(user, id);
}

async function getEntries(user) {
    const userPath = `./data/${user}`;
    const files = await readdir(userPath);
    return files.map((fileName) => {
        const entry = JSON.parse(fs.readFileSync(`${userPath}/${fileName}`));
        return { id: entry.id, date: entry.date, text: entry.text.substring(0, 400) };
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

export {
    isDateValid,
    createEntry,
    getEntries,
    getEntryWithId,
    userLogin,
    deleteEntry
};