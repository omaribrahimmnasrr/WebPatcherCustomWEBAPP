const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static(path.join(__dirname, 'public')));

// Custom JSON parser with error handling
app.use((req, res, next) => {
    if (req.headers['content-type'] === 'application/json') {
        let data = '';
        req.setEncoding('utf8');
        
        req.on('data', (chunk) => {
            data += chunk;
        });
        
        req.on('end', () => {
            try {
                if (data.trim() === '') {
                    req.body = {};
                } else {
                    req.body = JSON.parse(data);
                }
                next();
            } catch (e) {
                res.status(400).json({
                    error: 'Invalid JSON',
                    success: false
                });
            }
        });
    } else {
        next();
    }
});

app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'yourpage.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'contact.html'));
});

// API Routes
app.get('/api/hello', (req, res) => {
    res.json({ 
        message: 'Hello from the server!', 
        timestamp: new Date().toISOString() 
    });
});

app.get('/api/unsafe-html', (req, res) => {
    // This endpoint is intentionally vulnerable for testing purposes
    const html = `
        <div style="padding: 20px; border: 2px solid #ff6b6b; background: #fff3cd;">
            <h3>⚠️ Vulnerable HTML Content</h3>
            <p>This is intentionally unsafe HTML content for vulnerability testing.</p>
            <p><strong>VULN-10:</strong> Server HTML injection test</p>
            <script>console.log('Vulnerable script executed from server HTML');</script>
        </div>
    `;
    res.send(html);
});

app.post('/api/contact', (req, res) => {
    try {
        console.log('Received POST request to /api/contact');
        console.log('Request body:', req.body);
        
        // Check if request body exists and is an object
        if (!req.body || typeof req.body !== 'object' || req.body === null) {
            return res.status(400).json({
                error: 'Invalid request body',
                success: false
            });
        }
        
        const { name, message } = req.body;
        
        // Simple validation
        const errors = [];
        
        if (!name || typeof name !== 'string' || name.trim().length === 0) {
            errors.push({
                msg: 'Name is required',
                param: 'name',
                location: 'body'
            });
        } else if (name.length > 100) {
            errors.push({
                msg: 'Name must be less than 100 characters',
                param: 'name',
                location: 'body'
            });
        }
        
        if (!message || typeof message !== 'string' || message.trim().length === 0) {
            errors.push({
                msg: 'Message is required',
                param: 'message',
                location: 'body'
            });
        } else if (message.length > 1000) {
            errors.push({
                msg: 'Message must be less than 1000 characters',
                param: 'message',
                location: 'body'
            });
        }
        
        if (errors.length > 0) {
            console.log('Validation failed:', errors);
            return res.status(400).json({ 
                error: 'Validation failed',
                details: errors,
                success: false
            });
        }
        
        // Simulate saving the message
        console.log(`New contact form submission:`, { name: name.trim(), message: message.trim() });
        
        res.json({ 
            success: true, 
            message: `Thank you for your message, ${name.trim()}! We will get back to you soon.` 
        });
        
    } catch (error) {
        console.error('Error in contact form:', error);
        res.status(500).json({
            error: 'Internal server error',
            success: false
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        error: 'Internal server error',
        success: false
    });
});

// Handle unsupported HTTP methods
app.use((req, res, next) => {
    // Check for unsupported methods on defined routes
    const supportedMethods = {
        '/': ['GET'],
        '/about': ['GET'],
        '/contact': ['GET'],
        '/yourpage.html': ['GET'],
        '/api/hello': ['GET'],
        '/api/contact': ['POST'],
        '/api/unsafe-html': ['GET']
    };
    
    const route = req.path;
    const method = req.method;
    
    if (supportedMethods[route] && !supportedMethods[route].includes(method)) {
        res.set('Allow', supportedMethods[route].join(', '));
        return res.status(405).json({
            error: 'Method not allowed',
            success: false,
            allowedMethods: supportedMethods[route]
        });
    }
    
    next();
});

// 404 handler for undefined routes
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Route not found',
        success: false
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📁 Serving static files from: ${path.join(__dirname, 'public')}`);
});
