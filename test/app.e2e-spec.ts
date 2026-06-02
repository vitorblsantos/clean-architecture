import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { App } from 'supertest/types'
import { MainModule } from '../src/main.module'

describe('AppController (e2e)', () => {
  let app: INestApplication<App>

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MainModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  it('/ (GET) serves the Swagger UI', () => {
    return request(app.getHttpServer()).get('/').expect(200)
  })

  it('/json (GET) serves the OpenAPI spec', () => {
    return request(app.getHttpServer()).get('/json').expect(200)
  })
})
