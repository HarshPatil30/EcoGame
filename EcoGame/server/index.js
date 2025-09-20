import express from 'express';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import cors from 'cors';
import { formatLeaderboardEntry, leaderboardSchema } from './leaderboard.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
const dbName = 'EcoGame';
const collectionName = 'leaderboard';

async function getCollection() {
  if (!client.topology || !client.topology.isConnected()) {
    await client.connect();
  }
  return client.db(dbName).collection(collectionName);
}

// GET leaderboard
app.get('/api/leaderboard', async (req, res) => {
  try {
    const col = await getCollection();
    const players = await col.find().sort({ total: -1 }).toArray();
    res.json(players.map(formatLeaderboardEntry));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new player or update score
app.post('/api/leaderboard', async (req, res) => {
  const { name, total, game } = req.body;
  if (!name || typeof total !== 'number' || !game) {
    console.log("error NAME, TOTAL, GAME");
    return res.status(400).json({ error: 'Name, total, and game required.' });
  }
  try {
    const col = await getCollection();
    const result = await col.updateOne(
      { name, game },
      { $set: { name, total, lastPlayed: new Date().toISOString(), game } },
      { upsert: true }
    );
    console.log("success NAME, TOTAL, GAME");
    res.json({ success: true, result });
  } catch (err) {
    console.log("error");
    res.status(500).json({ error: err.message });
  }
});

// PUT update score
app.put('/api/leaderboard/:name', async (req, res) => {
  const name = req.params.name;
  const { total, game } = req.body;
  if (typeof total !== 'number' || !game) {
    return res.status(400).json({ error: 'Total and game required.' });
  }
  try {
    const col = await getCollection();
    const result = await col.updateOne(
      { name, game },
      { $set: { total, lastPlayed: new Date().toISOString(), game } }
    );
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`EcoGame server running on port ${PORT}`);
});
