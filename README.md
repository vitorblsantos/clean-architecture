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
├── domain/         # interfaces e modelos
├── usecases/       # regras de negócio
└── infra/          # controllers, config, logger
```

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

| Serviço    | Imagem            | Porta  | Pra que serve                                                    |
| ---------- | ----------------- | ------ | ---------------------------------------------------------------- |
| `app`      | build local       | `8080` | Aplicação NestJS.                                                |
| `postgres` | `postgres:latest` | `5432` | Banco de dados relacional. Healthcheck com `pg_isready` embutido. |

## Variáveis de ambiente

| Variável               | Default      | Descrição                  |
| ---------------------- | ------------ | -------------------------- |
| `APP_HOST`             | `localhost`  | Host da aplicação          |
| `APP_PORT`             | `8080`       | Porta da aplicação         |
| `DATABASE_HOST`        | `localhost`  | Host do PostgreSQL         |
| `DATABASE_PORT`        | `5432`       | Porta do PostgreSQL        |
| `DATABASE_USER`        | `postgres`   | Usuário do banco           |
| `DATABASE_PASSWORD`    | `postgres`   | Senha do banco             |
| `DATABASE_NAME`        | `clean-arch` | Nome do banco              |
| `DATABASE_SCHEMA`      | `public`     | Schema do banco            |
| `DATABASE_SYNCHRONIZE` | `true`       | Sincronizar entidades      |

Swagger disponível em `/`.

## Arquitetura

O projeto segue **Clean Architecture** com **CQRS**. A ideia central é que o código de negócio não depende de framework, banco ou lib externa.

```
src/
├── domain/         → o centro. Interfaces, modelos e enums puros. Não importa nada externo.
├── usecases/       → regras de negócio + commands. Só depende do domain.
└── infra/          → mundo externo. Controllers, handlers, config, logger. Implementa os contratos do domain.
```

A regra de dependência é sempre de fora pra dentro:

```
infra → usecases → domain
```

Nunca o contrário. O `domain` não sabe que NestJS, TypeORM ou Fastify existem.

### CQRS

Cada operação de escrita é representada por um **Command** (POJO, sem decorators NestJS) em `usecases/`. O **Handler** correspondente vive em `infra/controllers/` — ele injeta os serviços de infraestrutura e delega a execução para o use case.

```
Controller → CommandBus → Handler (infra) → UseCase (usecases) → Domain interfaces
```

| Arquivo            | Camada       | Responsabilidade                                                 |
| ------------------ | ------------ | ---------------------------------------------------------------- |
| `*.command.ts`     | `usecases/`  | Define o payload do comando. POJO puro.                          |
| `*.usecase.ts`     | `usecases/`  | Lógica de negócio. Depende só do `domain/`.                      |
| `*.handler.ts`     | `infra/`     | `@CommandHandler`: injeta serviços NestJS e chama o use case.    |
| `*.controller.ts`  | `infra/`     | Valida o input HTTP e despacha o `CommandBus`.                   |

### Na prática

- **Precisa de uma nova operação de escrita?** Cria `*.command.ts` + `*.usecase.ts` em `usecases/`, cria `*.handler.ts` em `infra/controllers/`, registra o handler no módulo.
- **Precisa de uma nova interface ou modelo?** Coloca no `domain/`.
- **Precisa integrar com algo externo (banco, fila, API)?** Cria a implementação em `infra/` e faz ela implementar uma interface do `domain/`.
- **Precisa de um novo endpoint?** Cria o controller em `infra/controllers/` e despacha um command via `CommandBus`.

### O que não fazer

- Não importar nada de `infra/` dentro de `usecases/` ou `domain/`.
- Não colocar lógica de negócio no controller ou handler. Essa lógica pertence ao use case.
- Não usar classes concretas de infra dentro do use case. Sempre dependa das interfaces do domain.
