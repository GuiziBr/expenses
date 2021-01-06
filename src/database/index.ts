import { createConnection } from 'typeorm'

createConnection({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: true
})

// createConnection(process.env.DATABASE_URL ? 'remote' : 'local')
