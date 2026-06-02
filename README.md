# Clean Arch

API com **Clean Architecture** e **CQRS**, com fila de mensagens via **Kafka**.

## Stack

- NestJS + Fastify
- CQRS (`@nestjs/cqrs`) — separação de comandos, queries e events
- TypeORM + PostgreSQL
- KafkaJS (fila de mensagens)
- Zod (validação de env)
- Swagger (`@nestjs/swagger`)
- Helmet + Throttler (rate limit global)
- Docker Compose (app + Postgres + Adminer + Kafka + Zookeeper + Kafka UI)

## Estrutura

```text
src/
├── api/            # Controllers, DTOs, validação de entrada, Swagger
├── app/            # Módulos de feature, commands, queries, handlers, events, serviços de aplicação,
│                   # interceptors e decorators
├── domain/         # Entidades, interfaces (repositórios, serviços), regras de domínio puras
└── infra/          # TypeORM, repositórios, Kafka, config, logger, integrações
```

A organização em pastas reflete a **regra de dependência** da Clean Architecture: o domínio fica no centro; a aplicação orquestra casos de uso; a API e a infraestrutura são “pontas” que dependem de camadas interiores, não o contrário.

### Path aliases (tsconfig)

| Alias       | Pasta            |
| ----------- | ---------------- |
| `@api/*`    | `./src/api/*`    |
| `@app/*`    | `./src/app/*`    |
| `@domain/*` | `./src/domain/*` |
| `@infra/*`  | `./src/infra/*`  |

## Setup

```bash
cp .env.sample .env
yarn install
```

## Rodando

```bash
# subir apenas as dependências (Postgres + Kafka + Zookeeper + UIs)
docker compose up -d postgres kafka zookeeper kafka-ui adminer

# dev (NestJS no host)
yarn dev

# ou tudo junto (app + dependências dentro do compose)
docker compose up
```

> Quando rodar a app **fora** do compose, aponta `KAFKA_BROKERS=localhost:29092` (porta publicada para o host). Dentro do compose o serviço `app` já vem configurado com `kafka:9092`.

## Docker Compose

| Serviço     | Imagem                            | Porta (host) | Pra que serve                                                                |
| ----------- | --------------------------------- | ------------ | ---------------------------------------------------------------------------- |
| `app`       | build local (`clean-arch:latest`) | `8080`       | Aplicação NestJS.                                                            |
| `postgres`  | `postgres:latest`                 | `5432`       | Banco de dados relacional. Healthcheck com `pg_isready`.                     |
| `adminer`   | `adminer`                         | `9091`       | UI web para o Postgres.                                                      |
| `zookeeper` | `confluentinc/cp-zookeeper:7.4.4` | `2181`       | Coordenação do cluster Kafka.                                                |
| `kafka`     | `confluentinc/cp-kafka:7.4.4`     | `29092`      | Broker Kafka. Listener `kafka:9092` interno e `localhost:29092` para o host. |
| `kafka-ui`  | `provectuslabs/kafka-ui:latest`   | `9090`       | UI web para inspecionar tópicos/mensagens.                                   |

Network: `clean-arch-app` (bridge, gerida pelo próprio Compose).

## Variáveis de ambiente

Validadas com Zod em `src/domain/services/environment/environment.service.ts` (via `EnvironmentModule`).

### Aplicação

| Variável   | Default   | Descrição                                       |
| ---------- | --------- | ----------------------------------------------- |
| `HOST`     | `0.0.0.0` | Host da aplicação                               |
| `PORT`     | `8080`    | Porta da aplicação                              |
| `NODE_ENV` | `local`   | `local`, `development`, `staging`, `production` |

### Banco

| Variável               | Default      | Descrição                       |
| ---------------------- | ------------ | ------------------------------- |
| `DATABASE_HOST`        | `localhost`  | Host do PostgreSQL              |
| `DATABASE_PORT`        | `5432`       | Porta do PostgreSQL             |
| `DATABASE_USER`        | `postgres`   | Usuário do banco                |
| `DATABASE_PASSWORD`    | `postgres`   | Senha do banco                  |
| `DATABASE_NAME`        | `clean-arch` | Nome do banco                   |
| `DATABASE_SCHEMA`      | `public`     | Schema do banco                 |
| `DATABASE_SYNCHRONIZE` | `false`      | Sincronizar entidades (TypeORM) |
| `DATABASE_TIMEZONE`    | `UTC`        | Timezone do driver              |

### Kafka

| Variável                              | Default      | Descrição                                                                                                |
| ------------------------------------- | ------------ | -------------------------------------------------------------------------------------------------------- |
| `KAFKA_BROKERS`                       | —            | Lista CSV de brokers. Ex.: `localhost:29092` (host) ou `kafka:9092` (compose). **Obrigatório**.          |
| `KAFKA_CLIENT_ID`                     | `clean-arch` | Identificador do cliente KafkaJS                                                                         |
| `KAFKA_TOPIC_CONTACTS_SYNC`           | —            | Tópico para enfileirar atualização de profiles                                                           |
| `KAFKA_TOPIC_CONTACTS_SYNC_DLQ`       | —            | Tópico DLQ (opcional no schema Zod)                                                                      |

Swagger disponível em `/`. JSON do spec em `/json`.

## Endpoints (Profile)

| Método   | Rota                      | O que faz                                                                                      |
| -------- | ------------------------- | ---------------------------------------------------------------------------------------------- |
| `GET`    | `/v1/profiles`            | Lista profiles.                                                                                |
| `GET`    | `/v1/profiles/:id`        | Busca profile por id.                                                                          |
| `POST`   | `/v1/profiles`            | Cria profile.                                                                                  |
| `PUT`    | `/v1/profiles/:id`        | **Enfileira** atualização no Kafka. `202 Accepted`.                                           |
| `PUT`    | `/v1/profiles/:id/update` | Endpoint **interno** chamado pelo consumer Kafka para aplicar o update. (oculto no Swagger)  |
| `DELETE` | `/v1/profiles/:id/delete` | Soft-delete (`deletedAt`). (oculto no Swagger)                                                 |

---

## Kafka / fila de mensagens

A fila é abstraída pela interface `IKafkaService` em `src/domain/interfaces/kafka/kafka.interface.ts`:

```ts
export interface IKafkaService {
  enqueue(args: EnqueueTaskArgs): Promise<void>
  subscribe(topic: string, eachMessage: ..., fromBeginning: boolean): Promise<void>
}
```

A implementação fica em `src/app/services/kafka/kafka.service.ts` (a migrar para `src/infra/kafka/` conforme o plano de arquitetura). Para enfileirar:

```ts
await this.kafkaService.enqueue({
  topic: this.kafkaConfig.getKafkaTopicProfilesSync(),
  payload: profilesEntity,
})
```

Para adicionar um novo tópico:

1. Definir a env do tópico (ex.: `KAFKA_TOPIC_MEU_EVENTO`).
2. Expor getter em `KafkaConfig` / `EnvironmentService`.
3. Chamar `kafkaService.enqueue({ topic, payload })`.

---

## Adicionar um **Command** (escrita) ou **Query** (leitura)

Siga a ordem. O exemplo usa o módulo `profile`; em outro contexto, troca o caminho e o nome do módulo.

### Command (ex.: criar, atualizar, enfileirar, deletar)

1. **Criar o POJO do comando** em `src/app/<feature>/command/<nome>.command.ts`
   - Classe simples com `constructor(public readonly ...)` com os campos necessários.
   - Nada de decorators NestJS no command.

2. **Criar o handler** em `src/app/<feature>/command/handler/<nome>.handler.ts`
   - `@CommandHandler(SeuCommand)` e `implements ICommandHandler<SeuCommand, TResultado>`.
   - O `execute` delega para o serviço de aplicação / regras já existentes (ex.: `ProfilesService`).

3. **Registar o handler** no módulo da feature (ex.: `src/app/<feature>/<feature>.module.ts`):
   - Adiciona a classe ao array `Commands` (ou equivalente) e espalha em `providers`: `...Commands`.

4. **No controller** em `src/api/controllers/...`:
   - Injeta `CommandBus` (`@nestjs/cqrs`).
   - Chama `this.commandBus.execute(new SeuCommand(...))`.
   - DTOs continuam em `src/api/dto/...` com validação.

5. **CqrsModule**
   - Já está importado em `src/api/api.module.ts` uma vez — não dupliques noutro módulo (evita dois `CommandBus`).

### Query (ex.: listar, obter por id)

1. **Criar a query** em `src/app/<feature>/query/<nome>.query.ts`
   - POJO; pode ser classe vazia (listagem) ou com parâmetros no `constructor` (ex.: `id`).

2. **Criar o handler** em `src/app/<feature>/query/handler/<nome>.handler.ts`
   - `@QueryHandler(SuaQuery)` e `implements IQueryHandler<SuaQuery, TResultado>`.
   - O `execute` delega para o serviço de aplicação (ex.: `findAll`, `findById`).

3. **Registar o handler** no módulo da feature: adiciona ao array `Queries` e `...Queries` em `providers`.

4. **No controller**: injeta `QueryBus` e chama `this.queryBus.execute(new SuaQuery(...))`.

### Checklist rápido

| Passo               | Command                            | Query                            |
| ------------------- | ---------------------------------- | -------------------------------- |
| Ficheiro do payload | `.../command/*.command.ts`         | `.../query/*.query.ts`           |
| Handler             | `.../command/handler/*.handler.ts` | `.../query/handler/*.handler.ts` |
| Registo no módulo   | `Commands` / `...Commands`         | `Queries` / `...Queries`         |
| HTTP                | `CommandBus.execute`               | `QueryBus.execute`               |

### O que não fazer (CQRS)

- Não importar outro `CqrsModule` no módulo da feature se o `ApiModule` já importa (há um único bus global).
- Não colocar regra de negócio pesada no controller; o handler chama a camada de aplicação (`*Service`) que orquestra domínio e repositórios.

---

## Arquitetura (Clean Architecture)

O projeto segue **Clean Architecture** com **CQRS**. A ideia central é que o **código de negócio** (domínio e orquestração de casos de uso) **não dependa** de framework, banco de dados concreto, fila ou biblioteca de entrega HTTP.

Em termos de camadas e dependências:

```text
api / infra  →  app  →  domain
```

- **`domain/`** — o centro. Entidades, interfaces (repositórios, serviços) e regras de domínio puras. **Não importa** NestJS, TypeORM, Fastify, KafkaJS nem nada de `api/` ou `infra/`.
- **`app/`** — casos de uso: serviços de aplicação, commands, queries, events e handlers. Orquestram o domínio e falam com o exterior **através de interfaces** definidas no domínio (ex.: `IKafkaService`, `IProfilesRepository`).
- **`api/`** — borda HTTP: controllers, DTOs, validação de entrada, Swagger. Só despacha para `CommandBus` / `QueryBus`.
- **`infra/`** — borda técnica: implementações (TypeORM, repositórios, Kafka, config, logger). **Implementa** os contratos do `domain/` e é selecionada pelos módulos via tokens (ex.: `IProfilesRepository`).

**Nunca** o contrário: o `domain` não “conhece” a infraestrutura; a aplicação não depende de detalhes concretos de entrega, só de abstrações.

### Regra de dependência (resumo)

A dependência aponta sempre **para dentro**, em direção ao domínio:

```text
infra  →  app  →  domain
api    →  app  →  domain
```

O domínio permanece estável quando trocas base de dados, broker Kafka ou o adaptador HTTP.

### CQRS neste repositório

Cada operação de **escrita** é um **Command** (POJO, sem decorators) em `app/`. O **Handler** aplica o caso de uso, normalmente **delegando** para um serviço de aplicação que coordena domínio e repositórios. Cada operação de **leitura** segue o mesmo padrão com **Query** + `QueryHandler`. **Eventos** (ex.: `CreateProfileFailedEvent`) ficam em `app/<feature>/events/`.

Fluxo típico (HTTP síncrono):

```text
Controller → CommandBus / QueryBus → Handler (app) → *Service (app) → domain + implementações em infra
```

Fluxo típico (assíncrono via fila):

```text
Controller → EnqueueProfileUpdateCommand → Handler → ProfilesService.enqueue
                                                    └─ IKafkaService.enqueue (publica no tópico)
                                                                                 │
                                                                                 ▼
                                                       Kafka consumer → PUT /v1/profiles/:id/update
                                                                                 │
                                                                                 ▼
                                                       UpdateProfileCommand → Handler → ProfilesService.update
```

| Peça                          | Onde fica                                                | Responsabilidade                                                         |
| ----------------------------- | -------------------------------------------------------- | ------------------------------------------------------------------------ |
| `*.command.ts` / `*.query.ts` | `app/<feature>/`                                         | Define o payload. POJO puro.                                             |
| `*.handler.ts`                | `app/<feature>/command/handler/` ou `.../query/handler/` | `@CommandHandler` / `@QueryHandler`: liga o bus ao serviço de aplicação. |
| `*.event.ts`                  | `app/<feature>/events/`                                  | Eventos de domínio/aplicação (ex.: falhas, side-effects).                |
| `*Service` (aplicação)        | `app/services/...`                                       | Orquestra regras e acessos, usando interfaces do `domain/`.              |
| `*.controller.ts`             | `api/controllers/`                                       | Valida o input e despacha `CommandBus` / `QueryBus`.                     |
| Repositórios, ORM, Kafka      | `infra/`                                                 | Detalhes de persistência e integração (TypeORM, Kafka).                    |

### Na prática

- **Precisa de uma nova operação de escrita?** Cria o command + handler em `app/`, regista no módulo da feature, e no controller usa `CommandBus` (e DTO em `api/dto/` se for HTTP).
- **Precisa de uma nova leitura?** Cria a query + handler, regista, e no controller usa `QueryBus`.
- **Precisa de uma nova interface ou modelo de domínio?** Coloca em `domain/`.
- **Precisa de integrar com algo externo (banco, fila, API)?** Implementa em `infra/` e **implementa** uma interface do `domain/`.
- **Precisa de um novo endpoint?** Cria o controller em `api/controllers/` e despacha commands/queries pelos buses (mantém a borda fina).
- **Precisa enfileirar trabalho?** Injeta `IKafkaService` (via DI no módulo) e chama `enqueue({ topic, payload })`.

### O que não fazer (geral)

- Não importar nada de `api/` ou `infra/` de dentro de `domain/` (o domínio permanece puro).
- Não colocar **lógica de negócio** no controller; ela fica no domínio e nos serviços de aplicação orquestrados pelos handlers.
- Não usar **classes concretas** de infraestrutura dentro do domínio: depende das **interfaces** definidas no `domain/`.
- Não acoplar features à implementação concreta de Kafka: sempre via `IKafkaService`.
