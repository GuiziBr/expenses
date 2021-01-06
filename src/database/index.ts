import { createConnection } from 'typeorm'

createConnection({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

// createConnection(process.env.DATABASE_URL ? 'remote' : 'local')
