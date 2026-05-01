# Agent Instructions

## Project Overview

Kalenda — calendar booking API system with two roles: **Owner** (admin) and **Guest** (public). No authentication.

## Source of Truth

- **`main.tsp`** — TypeSpec specification. This is the single source of truth for all API definitions (models, routes, operations, examples).
- **Never edit** `tsp-output/schema/openapi.yaml` — it is auto-generated from `main.tsp`.

## Setup & Requirements

- **Node.js >= 24.14** is required (Prism CLI demands it). Use nvm: `nvm use 24`
- Package manager: npm

## Development Workflow

When making API changes:

1. Edit `main.tsp` (models, operations, `@example` decorators)
2. Compile: `npm run compile`
3. If the mock server is running, restart it: `npm run mock`

### Commands

| Command | Description |
|---------|-------------|
| `npm run compile` | Compile TypeSpec → OpenAPI (`tsp-output/schema/openapi.yaml`) |
| `npm run mock` | Start Prism mock server on `http://localhost:4010` |

## Prism Mock Server

- Runs on port **4010**
- Validates request bodies against OpenAPI schemas (returns `422` for invalid requests)
- Returns example data from `@example` decorators on models
- All 10 endpoints are available (6 admin, 4 public)

## Tech Stack

- **TypeSpec** v1.11 — API specification language (Microsoft)
- **Prism** v5.15 — mock server from OpenAPI spec (Stoplight)
- **OpenAPI 3.1** — generated output format

## Key Conventions

- Routes prefixed with `/admin` (Owner) and `/public` (Guest)
- Request bodies use `@body` decorator to avoid `{ "body": ... }` wrapping in OpenAPI
- `duration` values are positive integers (15 or 30 minutes in examples)
- `utcDateTime` fields use ISO 8601 format

## Project Structure

```
main.tsp                          # Source of truth — TypeSpec API definition
tspconfig.yaml                    # TypeSpec compiler configuration
tsp-output/schema/openapi.yaml    # Generated OpenAPI spec (DO NOT EDIT)
package.json                      # Scripts and dependencies
DEVELOPMENT.md                    # Human-readable development guide
```
