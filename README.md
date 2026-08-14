# Weather App

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Firebase

This project uses Firebase for authentication and access to realtime database.
`src/environments/environment.ts` and `src/environments/environment.development.ts` are committed with placeholder values.

To use these features, create a Firebase account and project, then replace the placeholder values in both files with your own Firebase configuration.

> **⚠️ Warning:** Both environment files are tracked by Git. After adding your real Firebase credentials, be careful not to commit them — double-check `git status` and `git diff` before committing, or your credentials will be pushed to a public repository.

## Acknowledgments

This project uses code from [weather-icons](https://github.com/basmilius/weather-icons) by Bas Milius, licensed under the MIT License. See the [LICENSE](https://github.com/basmilius/weather-icons/blob/dev/LICENSE) file for details.