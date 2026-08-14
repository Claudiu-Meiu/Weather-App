# Weather App

## Running the app

### Option 1 — Docker (recommended, no local setup required)

Requires [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/) installed.

From the project root:
```bash
docker compose up --build -d
```

Navigate to `http://localhost:32781`.

> This uses `src/environments/environment.ts` for the build — see [Firebase](#firebase) below to configure it before running.

### Option 2 — Local development with Angular CLI

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

> This uses `src/environments/environment.development.ts` — see [Firebase](#firebase) below to configure it before running.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Firebase

This project uses Firebase for authentication and access to realtime database.
`src/environments/environment.ts` and `src/environments/environment.development.ts` are committed with placeholder values.

**Regardless of which option above you use, you need to replace the placeholder values in the matching file:**

| Running with | Uses file |
|---|---|
| `docker compose up` / `ng build` | `src/environments/environment.ts` |
| `ng serve` | `src/environments/environment.development.ts` |

Create a Firebase account and project, then replace the placeholder values in whichever file(s) you need with your own Firebase configuration.

> **⚠️ Warning:** Both environment files are tracked by Git. After adding your real Firebase credentials, be careful not to commit them — double-check `git status` and `git diff` before committing, or your credentials will be pushed to a public repository.

## Acknowledgments

This project uses code from [weather-icons](https://github.com/basmilius/weather-icons) by Bas Milius, licensed under the MIT License. See the [LICENSE](https://github.com/basmilius/weather-icons/blob/dev/LICENSE) file for details.