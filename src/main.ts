import { Logger, ValidationPipe, VersioningType } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import helmet from '@fastify/helmet'

import { EnvironmentService } from '@infra/config/environment/environment.service'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter())
  const envService = app.get(EnvironmentService)

  const host = envService.getAppHost()
  const port = envService.getAppPort()

  app.enableCors({
    allowedHeaders: ['Authorization', 'Content-Type'],
  })

  app.enableVersioning({
    prefix: 'v',
    type: VersioningType.URI,
  })

  app.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: [`'self'`],
        styleSrc: [`'self'`, `'unsafe-inline'`],
        imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
        scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
      },
    },
  })

  app.useGlobalPipes(new ValidationPipe())

  const swaggerConfig = new DocumentBuilder()
    .setDescription('Clean Architecture API documentation')
    .setTitle('Clean Architecture API')
    .setVersion('0.0.1')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Authentication token',
        name: 'Authorization',
        in: 'header',
      },
      'access-token',
    )
    .build()

  const document = SwaggerModule.createDocument(app, swaggerConfig)

  SwaggerModule.setup('/', app, document, {
    jsonDocumentUrl: '/json',
    swaggerOptions: {
      persistAuthorization: true,
      security: [{ 'access-token': [] }],
    },
  })

  await app.listen({ port, host }, () => Logger.debug(`App running on port: ${port} 🔥`))
}
bootstrap()
