module.exports = {
  "type": "postgres",
  "url": process.env.DATABASE_URL,
  "entities": [
    process.env.ENTITIES_REPO
  ],
  "migrations": [
    process.env.MIGRATIONS_REPO
  ],
  "cli": {
    "migrationsDir": './src/database/migrations'
  }
}
