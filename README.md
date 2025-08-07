# Staff Directory Application

A modern staff management application built with cutting-edge technologies for efficient employee data organization and access.

## 🚀 Tech Stack

- **Frontend Framework**: [React](https://react.dev/) (Vite)
- **UI Components**: [Mantine UI](https://mantine.dev/)
- **Routing**: [TanStack Router](https://tanstack.com/router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [Mantine](https://mantine.dev/)
- **State Management**: Browser [LocalStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- **Data Fetching**: [TanStack Query](https://tanstack.com/query)
- **Testing**:
  - [Playwright](https://playwright.dev) (E2E tests)
- **Linting/Formatting**: ESLint + Prettier (TanStack config)
- **Package Manager**: [pnpm](https://pnpm.io/)

## ✨ Features

- Employee CRUD operations with LocalStorage persistence
- Grade level management
- Responsive design with Mantine components
- Client-side routing with TanStack Router
- Comprehensive test coverage
- Modern UI with Tailwind + Mantine integration

## 🛠️ Development Setup

### Prerequisites

- Node.js v18+
- pnpm v8+
- Chrome/Firefox (for Playwright tests)

### Installation

```bash
# Clone the repository
git clone [repository-url]

# Navigate to project directory
cd staff-directory

# Install dependencies
pnpm install

# Install Playwright browsers
pnpm exec playwright install
```

### Running the Application

```bash
# Clone the repository
pnpm start

# Navigate to project directory
pnpm build

# Install dependencies
pnpm server
```

```
staff-directory/
├── src/
│   ├── routes/          # Application routes
│   ├── components/      # Reusable Mantine components
│   ├── services/        # Data transport service layer (Tanstack layer)
│   ├── pages/           # route pages
│   ├── types/           # Type definitions
│   ├── theme/           # App theming layer
│   ├── layout/          # App Layout
│   ├── constant/        # constant variables used across app
│   └── api/             # Api level interacting with localStorage and making api calls
├── tests/
│   └── e2e/             # Playwright end-to-end tests
├── public/              # Static assets
├── .../                 # Other folders and files
└── vite.config.ts       # Vite configuration
```

### License

This project is proprietary code created for Vocalserve recruitment process.
