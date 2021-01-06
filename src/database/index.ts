import { createConnection } from 'typeorm'

createConnection({
  type: 'postgres',
  url: process.env.DATABASE_URL
})

// createConnection(process.env.DATABASE_URL ? 'remote' : 'local')
