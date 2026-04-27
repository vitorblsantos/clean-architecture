# Clean Arch

API com Clean Architecture e CQRS.

## Stack

- NestJS + Fastify
- CQRS (`@nestjs/cqrs`) — separação de comandos e queries
- TypeORM + PostgreSQL
- Zod (validação de env)
- Swagger (`@nestjs/swagger`)
- Docker Compose (app + Postgres)

## Estrutura

```
src/
├── api/            # Controllers, DTOs, validação de entrada, Swagger
├── application/    # Módulos de feature, commands, queries, handlers, serviços de aplicação
├── domain/         # Entidades, interfaces, serviços de domínio puros
└── infra/          # TypeORM, repositórios, config, filas, logger, integrações externas
```

A organização em pastas reflete a **regra de dependência** da Clean Architecture: o domínio fica no centro; a aplicação orquestra casos de uso; a API e a infraestrutura são “pontas” que dependem de camadas interiores, não o contrário.

## Setup

```bash
cp .env.sample .env
yarn install
```

## Rodando

```bash
# subir postgres
docker compose up postgres -d

# dev
yarn dev

# ou tudo junto
docker compose up
```

## Docker Compose

| Serviço    | Imagem            | Porta  | Pra que serve                                                     |
| ---------- | ----------------- | ------ | ----------------------------------------------------------------- |
| `app`      | build local       | `8080` | Aplicação NestJS.                                                 |
| `postgres` | `postgres:latest` | `5432` | Banco de dados relacional. Healthcheck com `pg_isready` embutido. |

## Variáveis de ambiente

| Variável               | Default      | Descrição             |
| ---------------------- | ------------ | --------------------- |
| `APP_HOST`             | `localhost`  | Host da aplicação     |
| `PORT`                 | `8080`       | Porta da aplicação    |
| `DATABASE_HOST`        | `localhost`  | Host do PostgreSQL    |
| `DATABASE_PORT`        | `5432`       | Porta do PostgreSQL   |
| `DATABASE_USER`        | `postgres`   | Usuário do banco      |
| `DATABASE_PASSWORD`    | `postgres`   | Senha do banco        |
| `DATABASE_NAME`        | `clean-arch` | Nome do banco         |
| `DATABASE_SCHEMA`      | `public`     | Schema do banco       |
| `DATABASE_SYNCHRONIZE` | `true`       | Sincronizar entidades |

Swagger disponível em `/`.

---

## Adicionar um **Command** (escrita) ou **Query** (leitura)

Siga a ordem. O exemplo usa o módulo `profile`; em outro contexto, troque o caminho e o nome do módulo.

### Command (ex.: criar, atualizar, enfileirar)

1. **Criar o POJO do comando** em `src/application/<feature>/command/<nome>.command.ts`
   - Classe simples com `constructor(public readonly ...)` com os campos necessários.
   - Nada de decorators NestJS no command.

2. **Criar o handler** em `src/application/<feature>/command/handler/<nome>.handler.ts`
   - `@CommandHandler(SeuCommand)` e `implements ICommandHandler<SeuCommand, TResultado>`.
   - O `execute` delega para o serviço de aplicação / regras já existentes (ex.: `ProfileService`).

3. **Registar o handler** no módulo da feature (ex.: `src/application/<feature>/<feature>.module.ts`):
   - Adiciona a classe ao array `CommandHandlers` (ou equivalente) e espalha em `providers`: `...CommandHandlers`.

4. **No controller** em `src/api/controllers/...`:
   - Injeta `CommandBus` (`@nestjs/cqrs`).
   - Chama `this.commandBus.execute(new SeuCommand(...))`.
   - DTOs continuam em `src/api/dto/...` com validação.

5. **CqrsModule**
   - Já está importado em `src/api/api.module.ts` uma vez — não dupliques noutro módulo (evita dois `CommandBus`).

### Query (ex.: listar, obter por id)

1. **Criar a query** em `src/application/<feature>/query/<nome>.query.ts`
   - POJO; pode ser classe vazia (listagem) ou com parâmetros no `constructor` (ex.: `id`).

2. **Criar o handler** em `src/application/<feature>/query/handler/<nome>.handler.ts`
   - `@QueryHandler(SuaQuery)` e `implements IQueryHandler<SuaQuery, TResultado>`.
   - O `execute` delega para o serviço de aplicação (ex.: `findAll`, `findById`).

3. **Registar o handler** no módulo da feature: adiciona ao array `QueryHandlers` e `...QueryHandlers` em `providers`.

4. **No controller**: injeta `QueryBus` e chama `this.queryBus.execute(new SuaQuery(...))`.

### Checklist rápido

| Passo               | Command                            | Query                            |
| ------------------- | ---------------------------------- | -------------------------------- |
| Ficheiro do payload | `.../command/*.command.ts`         | `.../query/*.query.ts`           |
| Handler             | `.../command/handler/*.handler.ts` | `.../query/handler/*.handler.ts` |
| Registo no módulo   | `CommandHandlers`                  | `QueryHandlers`                  |
| HTTP                | `CommandBus.execute`               | `QueryBus.execute`               |

### O que não fazer (CQRS)

- Não importar outro `CqrsModule` no módulo da feature se o `ApiModule` já importa (há um único bus global).
- Não colocar regra de negócio pesada no controller; o handler chama a camada de aplicação (`*Service`) que orquestra domínio e repositórios.

---

## Arquitetura (Clean Architecture)

O projeto segue **Clean Architecture** com **CQRS**. A ideia central é que o **código de negócio** (domínio e orquestração de casos de uso) **não dependa** de framework, banco de dados concreto ou biblioteca de entrega HTTP.

Em termos de camadas e dependências:

```
api / infra  →  application  →  domain
```

- **`domain/`** — o centro. Entidades, interfaces (repositórios, serviços) e regras de domínio puros. **Não importa** NestJS, TypeORM, Fastify nem nada de `api/` ou `infra/`.
- **`application/`** — casos de uso: serviços de aplicação, commands, queries e handlers. Orquestram o domínio e falam com o exterior **através de interfaces** definidas no domínio.
- **`api/`** — borda HTTP: controllers, DTOs, validação de entrada, Swagger. Só despacha para `CommandBus` / `QueryBus` (ou, quando fizer sentido, para serviços expostos pelo módulo de aplicação).
- **`infra/`** — borda técnica: implementações (TypeORM, repositórios, filas, config, logger). **Implementa** os contratos do `domain/`.

**Nunca** o contrário: o `domain` não “conhece” a infraestrutura; a aplicação não depende de detalhes concretos de entrega, só de abstrações.

### Regra de dependência (resumo)

A dependência aponta sempre **para dentro**, em direção ao domínio:

```
infra  →  application  →  domain
api    →  application  →  domain
```

O domínio permanece estável quando trocas base de dados, filas ou o adaptador HTTP.

### CQRS neste repositório

Cada operação de **escrita** é um **Command** (POJO, sem decorators) em `application/`. O **Handler** aplica o caso de uso, normalmente **delegando** para um serviço de aplicação que coordena domínio e repositórios. Cada operação de **leitura** segue o mesmo padrão com **Query** + `QueryHandler`.

Fluxo típico (HTTP):

```
Controller → CommandBus / QueryBus → Handler (application) → *Service (application) → domain + implementações em infra
```

| Peça                          | Onde fica                      | Responsabilidade                                            |
| ----------------------------- | ------------------------------ | ----------------------------------------------------------- | ------------------------------------------------------------------------ |
| `*.command.ts` / `*.query.ts` | `application/<feature>/`       | Define o payload. POJO puro.                                |
| `*.handler.ts`                | `application/<feature>/command | query/handler/`                                             | `@CommandHandler` / `@QueryHandler`: liga o bus ao serviço de aplicação. |
| `*Service` (aplicação)        | `application/services/...`     | Orquestra regras e acessos, usando interfaces do `domain/`. |
| `*.controller.ts`             | `api/controllers/`             | Valida o input e despacha `CommandBus` / `QueryBus`.        |
| Repositórios, ORM, filas      | `infra/`                       | Detalhes de persistência e integração.                      |

### Na prática

- **Precisa de uma nova operação de escrita?** Cria o command + handler em `application/`, regista no módulo da feature, e no controller usa `CommandBus` (e DTO em `api/dto/` se for HTTP).
- **Precisa de uma nova leitura?** Cria a query + handler, regista, e no controller usa `QueryBus`.
- **Precisa de uma nova interface ou modelo de domínio?** Coloca em `domain/`.
- **Precisa de integrar com algo externo (banco, fila, API)?** Implementa em `infra/` e **implementa** uma interface do `domain/`.
- **Precisa de um novo endpoint?** Cria o controller em `api/controllers/` e despacha commands/queries pelos buses (mantém a borda fina).

### O que não fazer (geral)

- Não importar nada de `api/` ou `infra/` de dentro de `domain/` (o domínio permanece puro).
- Não colocar **lógica de negócio** no controller; ela fica no domínio e nos serviços de aplicação orquestrados pelos handlers.
- Não usar **classes concretas** de infraestrutura dentro do domínio: depende das **interfaces** definidas no `domain/`.
