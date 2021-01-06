import { createConnection } from 'typeorm'

createConnection(process.env.DATABASE_ULR ? 'remote' : 'local')
