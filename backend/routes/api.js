import express from "express";
import * as entries from './model.js';
const router = express.Router();

router.post('/login', async (req, res) => {
    const validUser = await entries.userLogin(req.body.user, req.body.pass);
    if (!validUser) {
        res.status(403).json({ Error: "Invalid username and/or password" })
    } else {
        console.log(validUser);
        res.status(200).json(validUser);
    }
});

function isEntryValid(body) {
    const keys = Object.keys(body);
    const requiredKeys = ['date', 'text'];

    let allKeysPresent = true;
    for (const requiredKey of requiredKeys) {
        if (!keys.includes(requiredKey)) {
            allKeysPresent = false;
            break;
        }
    }

    if (keys.length !== 2 || !allKeysPresent) return false;

    const { date, text } = body;

    if (!entries.isDateValid(date)) return false;
    if (typeof text !== 'string' || text.trim().length === 0) return false;

    return true;
}

router.post('/entries', async (req, res) => {
    if (!isEntryValid(req.body)) {
        res.status(400).json({ Error: "Invalid request" });
    } else {
        const newEntry = await entries.createEntry(req.query.user, req.body);
        res.status(201).json(newEntry);
    }
});

router.get('/entries', async (req, res) => {
    const found = await entries.getEntries(req.query.user);
    res.status(200).json(found);
});

router.get('/entries/:id', async (req, res) => {
    const found = await entries.getEntryWithId(req.query.user, req.params.id);
    if (!found) {
        res.status(404).json({ Error: "Not found" })
    } else {
        res.status(200).json(found);
    }
});

export default router;
