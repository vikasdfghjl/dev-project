# RSS Reader Frontend

## Tech Stack

- **Framework:** React
- **Language:** TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **State Management:** React Context, Reducer
- **API:** REST (FastAPI backend)

## How to Start the Project

### 1. Create a Virtual Environment (Optional, for Node version management)

If you use [nvm](https://github.com/nvm-sh/nvm) or [fnm](https://github.com/Schniz/fnm):

#### Option A: Using nvm (Linux/macOS)

```sh
nvm install 20
nvm use 20
```

#### Option B: Using nvm-windows (Windows)

```powershell
nvm install 20
nvm use 20
```

### 2. Install dependencies

```sh
npm install
```

### 3. Configure environment

Create a `.env.local` file in the frontend directory if you need to override API URLs or set API keys. Example:

```env
VITE_API_URL=http://localhost:8000/api/v1
```

### 4. Start the development server

```sh
npm run dev
```

The app will be available at [http://localhost:5173/](http://localhost:5173/)

### 5. Build for production

```sh
npm run build
```

### 6. Preview production build

```sh
npm run preview
```

## Running Tests

This project uses [Vitest](https://vitest.dev/) and [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/) for frontend unit and integration tests.

To run all tests:

```bash
npx vitest run
```

To run tests in watch mode (auto-restart on file changes):

```bash
npx vitest
```

Test files are located in the `__tests__` directory at the root of the `frontend` folder. All test utilities are configured in `setupTests.ts`.


If you add new test files, use the `.test.tsx` or `.test.ts` suffix.

## Environment Variables Example (`.env.local`)

```env
VITE_API_URL=http://localhost:8000/api/v1
```

---

For backend setup, see `../backend/README.md`.
