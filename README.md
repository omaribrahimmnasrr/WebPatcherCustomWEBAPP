# Mini Web App

A simple, modern web application built with HTML, CSS, JavaScript, and Node.js using the Express framework.

## Features

- 🚀 **Fast & Lightweight** - Built with Express.js for optimal performance
- 📱 **Responsive Design** - Mobile-first design that works on all devices
- 🎨 **Modern UI** - Clean, beautiful interface with gradient backgrounds
- 🔧 **Simple Structure** - Easy to understand and modify
- 📝 **Contact Form** - Working contact form with server-side processing
- 🌐 **API Endpoints** - RESTful API for dynamic content

## Pages

- **Home** (`/`) - Landing page with features and API demo
- **About** (`/about`) - Information about the project and technologies
- **Contact** (`/contact`) - Contact form with validation

## API Endpoints

- `GET /api/hello` - Returns a greeting message with timestamp
- `POST /api/contact` - Handles contact form submissions

## Installation & Setup

### Prerequisites

- Node.js (version 14 or higher)
- npm (Node Package Manager)

### Steps

1. **Clone or download the project**
   ```bash
   # If you have git
   git clone <repository-url>
   cd webapp-project
   
   # Or simply navigate to the project folder
   cd webapp-project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   # For production
   npm start
   
   # For development (with auto-restart)
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## Project Structure

```
webapp-project/
├── app.js              # Main server file
├── package.json        # Dependencies and scripts
├── README.md          # This file
└── public/            # Static files
    ├── index.html     # Home page
    ├── about.html     # About page
    ├── contact.html   # Contact page
    ├── styles.css     # CSS styling
    └── script.js      # JavaScript functionality
```

## Technologies Used

- **Frontend:**
  - HTML5
  - CSS3 (with Flexbox and Grid)
  - Vanilla JavaScript (ES6+)

- **Backend:**
  - Node.js
  - Express.js
  - Built-in modules (path, fs)

## Development

### Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start development server with nodemon (auto-restart)

### Customization

1. **Styling**: Edit `public/styles.css` to modify the appearance
2. **Functionality**: Update `public/script.js` for client-side features
3. **Server**: Modify `app.js` to add new routes or middleware
4. **Content**: Edit HTML files in the `public/` directory

## Features Explained

### Navigation
- Responsive navigation bar with active page highlighting
- Smooth transitions and hover effects

### API Integration
- Client-side JavaScript communicates with server endpoints
- Error handling for network requests
- JSON data exchange

### Contact Form
- Form validation (client and server-side)
- AJAX form submission
- Success/error message display

### Responsive Design
- Mobile-first CSS approach
- Flexible grid layouts
- Touch-friendly interface

## Troubleshooting

### Common Issues

1. **Port already in use**
   - Change the port in `app.js` (line 6): `const PORT = process.env.PORT || 3001;`

2. **Module not found**
   - Run `npm install` to install all dependencies

3. **Page not loading**
   - Ensure the server is running (`npm start`)
   - Check the console for error messages

### Getting Help

- Check the browser's developer console for JavaScript errors
- Look at the terminal/command prompt for server-side errors
- Ensure all files are in the correct directories

## License

MIT License - feel free to use this project as a starting point for your own applications!

## Contributing

This is a simple demo project, but feel free to:
- Add new features
- Improve the styling
- Add more API endpoints
- Enhance the user experience

---

**Happy Coding! 🚀**
