const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const STATE_FILE = 'C:\\Users\\pranj\\SolarReclaim\\vault\\memory\\universal-state.json';
const HISTORY_FILE = 'C:\\Users\\pranj\\SolarReclaim\\vault\\memory\\os-state.md';
const SKILLS_DIR = 'C:\\Users\\pranj\\SolarReclaim\\skills\\';

// GET /api/state: Returns content of universal-state.json
app.get('/api/state', (req, res) => {
    try {
        const data = fs.readFileSync(STATE_FILE, 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        res.status(500).json({ error: 'Could not read state file' });
    }
});

// GET /api/history: Returns content of os-state.md
app.get('/api/history', (req, res) => {
    try {
        const data = fs.readFileSync(HISTORY_FILE, 'utf8');
        res.send(data);
    } catch (error) {
        res.status(500).send('Could not read history file');
    }
});

// GET /api/skills: Returns a list of files in the skills directory
app.get('/api/skills', (req, res) => {
    try {
        const files = fs.readdirSync(SKILLS_DIR);
        res.json({ skills: files.filter(f => f.endsWith('.md')) });
    } catch (error) {
        res.status(500).json({ error: 'Could not read skills directory' });
    }
});

// POST /api/trigger: Updates state and history with a new request
app.post('/api/trigger', (req, res) => {
    const { skill, goal } = req.body;
    if (!skill || !goal) {
        return res.status(400).json({ error: 'Missing skill or goal' });
    }

    try {
        // 1. Update universal-state.json
        const stateData = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
        if (!stateData.founder_requests) {
            stateData.founder_requests = [];
        }
        stateData.founder_requests.push({
            id: Date.now(),
            skill,
            goal,
            timestamp: new Date().toISOString(),
            status: 'pending'
        });
        fs.writeFileSync(STATE_FILE, JSON.stringify(stateData, null, 2));

        // 2. Append to os-state.md
        const logEntry = `\n## Trigger Request [${new Date().toISOString()}]\n- Skill: ${skill}\n- Goal: ${goal}\n- Status: Pending\n---\n`;
        fs.appendFileSync(HISTORY_FILE, logEntry);

        res.json({ message: 'Trigger processed successfully', requestId: stateData.founder_requests[stateData.founder_requests.length - 1].id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error processing trigger' });
    }
});

app.listen(PORT, () => {
    console.log(`OS Dashboard Server running on http://localhost:${PORT}`);
});
