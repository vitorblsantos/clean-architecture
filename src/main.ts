import { Logger, ValidationPipe, VersioningType } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import helmet from '@fastify/helmet'

import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter())
  const configService = app.get(ConfigService)

  const host = configService.get<string>('APP_HOST')
  const port = configService.get<number>('APP_PORT')

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
