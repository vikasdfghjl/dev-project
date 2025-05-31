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

## How to Run Tests

_Tests are not included by default. Add your preferred testing framework (e.g., Jest, Vitest) and run as needed._

## Environment Variables Example (`.env.local`)

```env
VITE_API_URL=http://localhost:8000/api/v1
```

---

For backend setup, see `../backend/README.md`.
