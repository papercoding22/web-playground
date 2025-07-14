# React Demo Playground 🚀

Welcome to the React Demo Playground\! This project is a curated collection of interactive demonstrations showcasing various React concepts, patterns, and best practices. It's designed to be a learning resource for understanding common challenges and their solutions in a hands-on manner.

---

## ✨ Features

- **Interactive Demos**: A wide range of demos covering performance, security, and algorithms.
- **Side-by-Side Comparisons**: See the problem and the solution implemented for concepts like race conditions and stale closures.
- **Algorithm Visualizers**: Watch algorithms like DFS Word Search and Move Zeroes in action.
- **Client-Server Architecture**: Includes a React client and an Express server.
- **Modern Tech Stack**: Built with TypeScript, Vite, and Tailwind CSS for a great developer experience.

---

## 📚 Demos

Here's a list of the available demos you can explore in the playground:

- **Race Condition**: Demonstrates and solves race conditions when fetching data.
- **Stale Closure**: Illustrates the "stale closure" problem and how to fix it with `useRef`.
- **Captured Props**: Shows how props can be captured in functional and class components, and how to handle them.
- **List View Optimization**: A demo on optimizing list rendering with `useCallback` and `memo`.
- **Token Refresh Challenge**: A challenge to implement a token refresh mechanism.
- **DFS Word Search**: A visualizer for the Depth-First Search algorithm.
- **Move Zeroes**: An interactive visualizer for the two-pointers algorithm.
- **SOP/CSRF Demo**: A demonstration of Same-Origin Policy and Cross-Site Request Forgery.

---

## 💻 Tech Stack

### Client

| Technology       | Description                                                                           |
| :--------------- | :------------------------------------------------------------------------------------ |
| **React**        | A JavaScript library for building user interfaces.                                    |
| **TypeScript**   | A typed superset of JavaScript that compiles to plain JavaScript.                     |
| **Vite**         | A fast build tool and development server.                                             |
| **Tailwind CSS** | A utility-first CSS framework for rapid UI development.                               |
| **axios**        | A promise-based HTTP client for the browser and Node.js.                              |
| **ESLint**       | A tool for identifying and reporting on patterns found in ECMAScript/JavaScript code. |

### Server

| Technology      | Description                                                                                                |
| :-------------- | :--------------------------------------------------------------------------------------------------------- |
| **Express**     | A fast, unopinionated, minimalist web framework for Node.js.                                               |
| **TypeScript**  | For type-safe server-side code.                                                                            |
| **ts-node-dev** | A tool that automatically restarts the server on file changes.                                             |
| **CORS**        | A package for providing a Connect/Express middleware that can be used to enable CORS with various options. |
| **dotenv**      | A zero-dependency module that loads environment variables from a `.env` file into `process.env`.           |

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation & Setup

1.  **Clone the repository**:

    ```bash
    git clone <your-repo-url>
    cd my-react-app
    ```

2.  **Install client dependencies**:

    ```bash
    cd client
    npm install
    ```

3.  **Install server dependencies**:

    ```bash
    cd ../server
    npm install
    ```

### Running the Project

1.  **Start the server**:
    From the `server` directory, run:

    ```bash
    npm run dev
    ```

    The server will start on `http://localhost:5000`.

2.  **Start the client**:
    From the `client` directory, run:

    ```bash
    npm run dev
    ```

    The React application will open in your browser at `http://localhost:5173` (or another port if 5173 is busy).

---

## 📝 ESLint & Configuration

- **Client**: The client-side code is linted with ESLint, and includes plugins for React Hooks and React Refresh. The configuration can be found in `client/eslint.config.js`.
- **Server**: The server-side code uses ESLint with TypeScript support. The configuration is in `server/.eslintrc.json`.
- **TypeScript**: Both client and server have their own `tsconfig.json` files for TypeScript configuration.

Feel free to explore, learn, and contribute\!
