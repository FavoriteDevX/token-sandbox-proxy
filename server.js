const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const TARGET_URL = process.env.SANDBOX_TARGET_URL || 'https://example.com';

console.log('==================================================');
console.log('🚀 Starting Token-Sandbox-Proxy...');
console.log(`🎯 Target Sandbox Environment: ${TARGET_URL}`);
console.log('==================================================');

// Helper function to safely mask tokens for console logging visualization
function maskToken(token) {
    if (!token) return 'None';
    if (token.length <= 8) return '********';
    return `${token.substring(0, 4)}...${token.substring(token.length - 4)}`;
}

// Proxy configuration and lifecycle hooks
const tokenSandboxProxy = createProxyMiddleware({
    target: TARGET_URL,
    changeOrigin: true,
    logLevel: 'info',
    on: {
        proxyReq: (proxyReq, req, res) => {
            console.log(`\n📥 [Incoming Request] ${req.method} ${req.url}`);

            // 1. Intercept Authorization Headers (Bearer Tokens)
            const authHeader = req.headers['authorization'];
            if (authHeader && authHeader.startsWith('Bearer ')) {
                const originalToken = authHeader.split(' ')[1];
                const sandboxToken = process.env.MOCK_BEARER_TOKEN || 'default_sandbox_jwt';
                
                // Swap the real token with the safe sandbox token
                proxyReq.setHeader('Authorization', `Bearer ${sandboxToken}`);
                
                console.log(`🔒 [Token Masked] Swapped Bearer Token: ${maskToken(originalToken)} ➡️  ${maskToken(sandboxToken)}`);
            }

            // 2. Intercept Custom API Keys (e.g., X-API-Key)
            const apiKeyHeader = req.headers['x-api-key'];
            if (apiKeyHeader) {
                const sandboxKey = process.env.MOCK_API_KEY || 'default_sandbox_key';
                
                // Swap the real API key with the safe sandbox key
                proxyReq.setHeader('x-api-key', sandboxKey);
                
                console.log(`🔑 [Key Masked] Swapped X-API-Key: ${maskToken(apiKeyHeader)} ➡️  ${maskToken(sandboxKey)}`);
            }

            // 3. Optional: Add custom debugging headers so the sandbox knows it passed through this proxy
            proxyReq.setHeader('X-Proxied-By', 'Token-Sandbox-Proxy');
        },
        proxyRes: (proxyRes, req, res) => {
            console.log(`📤 [Target Response] ${req.method} ${req.url} -> Status: ${proxyRes.statusCode}`);
        },
        error: (err, req, res) => {
            console.error('❌ [Proxy Error]:', err.message);
            res.status(500).json({
                error: 'Proxy Error',
                message: 'Failed to safely route request to the sandbox environment.',
                details: err.message
            });
        }
    }
});

// Use the proxy middleware for all incoming routes
app.use('/', tokenSandboxProxy);

app.listen(PORT, () => {
    console.log(`✅ Token-Sandbox-Proxy running locally at http://localhost:${PORT}`);
});
