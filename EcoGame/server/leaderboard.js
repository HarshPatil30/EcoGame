// Leaderboard schema and helpers
import { ObjectId } from 'mongodb';

export function formatLeaderboardEntry(doc) {
  return {
    _id: doc._id instanceof ObjectId ? doc._id.toString() : doc._id,
    name: doc.name,
    total: doc.total,
    lastPlayed: doc.lastPlayed ? new Date(doc.lastPlayed).toISOString() : null,
    game: doc.game || null
  };
}

export const leaderboardSchema = {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'total', 'lastPlayed', 'game'],
      properties: {
        name: { bsonType: 'string' },
        total: { bsonType: 'int' },
        lastPlayed: { bsonType: 'string' },
        game: { bsonType: 'string' }
      }
    }
  }
};
