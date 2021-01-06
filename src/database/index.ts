import { createConnection } from 'typeorm'

createConnection(process.env.DATABASE_URL ? 'remote' : 'local')
