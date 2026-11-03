# Token-Sandbox-Proxy

A functional development proxy server designed to intercept incoming API requests containing real authentication tokens (JWTs, API Keys), mask or swap them automatically, and forward them safely to an isolated sandbox backend environment.

## Features
- 🔄 **Automatic Interception:** Seamlessly sniffs standard headers like `Authorization: Bearer` and `X-API-Key`.
- 🎭 **Token Swapping:** Exchanges live credentials dynamically with safe, predefined mock sandbox tokens.
- 📺 **Security Logs:** Clean console logs showcasing masked credential tracking without revealing original secrets.
- 🛠️ **Seamless Integration:** Built on top of Express and `http-proxy-middleware`.

## Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org) installed (v18+ recommended).

### Installation
1. Clone this repository or copy the files locally.
2. Install the necessary dependencies:
   ```bash
   npm install
   ```

### Configuration
1. Duplicate the `.env.example` file and rename it to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and fill in your target sandbox base URL and mock tokens.

### Running the App
Start the proxy in development mode (with auto-reload enabled):
```bash
npm run dev
```

The server will boot up locally at `http://localhost:3000`. Any request sent to your local instance will be cleaned up and forwarded safely to your configured `SANDBOX_TARGET_URL`.
