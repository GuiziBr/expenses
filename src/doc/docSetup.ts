import { Express } from 'express'
import { OpenApiValidator } from 'express-openapi-validator'
import { OpenAPIV3 } from 'express-openapi-validator/dist/framework/types'
import swaggerUi from 'swagger-ui-express'
import apiSchema from './api.schema.json'

export default async function docSetup(app: Express): Promise<void> {
  app.use('/doc', swaggerUi.serve, swaggerUi.setup(apiSchema))
  await new OpenApiValidator({
    apiSpec: apiSchema as OpenAPIV3.Document,
    validateRequests: true,
    validateResponses: true
  }).install(app)
}
