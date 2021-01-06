module.exports = {
  "type": "postgres",
  "url": process.env.DATABASE_URL,
  "ssl": { rejectUnauthorized: false },
  "entities": [
    process.env.ENTITIES_REPO
  ],
  "migrations": [
    process.env.MIGRATIONS_REPO
  ],
  "cli": {
    "migrationsDir": process.env.CLI
  }
}
