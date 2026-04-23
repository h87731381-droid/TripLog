const { MongoClient } = require('mongodb');
const url = process.env.MONGODB_URL;

//글로벌(전역) 변수 global.
if (!global.mongoClientPromise) {
    global.mongoClientPromise = new MongoClient(url).connect();
}

async function db() {
    const client = await global.mongoClientPromise;
    return client.db('tripLog');
}

export default db;
