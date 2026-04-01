import { ValidationPipe, VersioningType } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import helmet from '@fastify/helmet'

import { LoggingInterceptor } from '@infra/common/interceptors/logger.interceptor'
import { ResponseInterceptor } from '@infra/common/interceptors/response.interceptor'
import { EnvironmentService } from '@infra/config/environment/environment.service'
import { LoggerService } from '@infra/logger/logger.service'

import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter())

  const environment = app.get(EnvironmentService)
  const host = environment.getAppHost()
  const logger = app.get(LoggerService)
  const port = environment.getAppPort()

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

  app.useGlobalInterceptors(new LoggingInterceptor(logger))
  app.useGlobalInterceptors(new ResponseInterceptor())
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }))
  app.useLogger(logger)

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

  await app.listen({ port, host }, () => logger.debug('Bootstrap', `App running on port: ${port} 🔥`))
}
bootstrap()
