# Web Security Learning Platform 🛡️

A comprehensive educational platform for learning web security concepts through interactive demonstrations and hands-on examples.

## 🎯 Project Overview

This project is designed as a learning platform to understand critical web security concepts including Same-Origin Policy (SOP) and Cross-Site Request Forgery (CSRF) through beautiful, interactive demonstrations.

## ✨ Features

### 🌐 Same-Origin Policy (SOP) Demo

- **Interactive Testing**: Real-time testing of SOP restrictions with various APIs
- **Visual Learning**: Clear explanations of same vs. different origins
- **Live Demonstrations**: Shows how CORS-enabled APIs work vs. blocked requests
- **Educational Content**: Comprehensive explanations of security implications

### 🛡️ CSRF Protection Demo

- **Attack Simulation**: Safe simulation of CSRF attacks for educational purposes
- **Security Measures**: Demonstrates how modern protections block malicious requests
- **Best Practices**: Interactive guide for implementing CSRF protection
- **Real-world Scenarios**: Examples like malicious transfers and fake posts

### 📊 Interactive Features

- **Real-time Activity Log**: Live monitoring of all security events and test results
- **Beautiful UI**: Modern, responsive design with smooth animations
- **Tabbed Interface**: Easy navigation between different security concepts
- **Educational Tooltips**: Contextual help and explanations throughout

## 🚀 Tech Stack

### Frontend

- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Modern ES6+** features

### Backend (Planned)

- **Express.js** with TypeScript
- **Node.js** runtime
- **Security middleware** demonstrations
- **CORS configuration** examples

## 📦 Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Modern web browser

### Setup Instructions

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/web-security-learning-platform.git
   cd web-security-learning-platform
   ```

2. **Install dependencies**

   ```bash
   # For the React frontend
   npm install

   # For the Express backend (when available)
   cd server
   npm install
   ```

3. **Start the development servers**

   ```bash
   # Frontend (React)
   npm start

   # Backend (Express) - in separate terminal
   cd server
   npm run dev
   ```

4. **Open your browser**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:5000`

## 🎓 Learning Objectives

After using this platform, you will understand:

### Same-Origin Policy (SOP)

- ✅ What constitutes the same origin vs. different origins
- ✅ How SOP protects against malicious cross-origin requests
- ✅ When and how CORS allows controlled cross-origin access
- ✅ Real-world implications of SOP in web applications

### CSRF Protection

- ✅ How CSRF attacks work and why they're dangerous
- ✅ Common CSRF protection mechanisms (tokens, SameSite cookies)
- ✅ Best practices for implementing CSRF protection
- ✅ How to identify and prevent CSRF vulnerabilities

## 🧪 Demo Usage

### Testing Same-Origin Policy

1. Navigate to the **SOP tab**
2. Click **"Test CORS Enabled"** to see successful cross-origin requests
3. Try **"Test External API"** to observe different behaviors
4. Monitor the **Activity Log** for detailed explanations

### Simulating CSRF Attacks

1. Switch to the **CSRF tab**
2. Click **"Malicious Transfer"** to simulate a banking attack
3. Try **"Fake Post"** to see social media vulnerabilities
4. Observe how security measures block these attempts

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# React App Configuration
REACT_APP_API_BASE_URL=http://localhost:5000
REACT_APP_ENABLE_MOCK_API=true

# Express Server Configuration
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000

# Security Configuration
CSRF_SECRET=your-csrf-secret-key
SESSION_SECRET=your-session-secret-key
```

### Tailwind Configuration

The project uses a custom Tailwind configuration optimized for security demonstrations:

```javascript
// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        security: {
          safe: "#10B981",
          warning: "#F59E0B",
          danger: "#EF4444",
          info: "#3B82F6",
        },
      },
    },
  },
};
```

## 📁 Project Structure

```
web-security-learning-platform/
├── src/
│   ├── components/           # React components
│   │   ├── SOPDemo.tsx      # Same-Origin Policy demo
│   │   ├── CSRFDemo.tsx     # CSRF protection demo
│   │   └── ActivityLog.tsx   # Real-time logging
│   ├── types/               # TypeScript type definitions
│   ├── utils/               # Utility functions
│   ├── styles/              # Global styles
│   └── App.tsx              # Main application
├── server/                  # Express backend (planned)
│   ├── routes/              # API routes
│   ├── middleware/          # Security middleware
│   └── app.js              # Express application
├── public/                  # Static assets
├── docs/                    # Documentation
└── README.md               # This file
```

## 🤝 Contributing

We welcome contributions to improve this educational platform!

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-security-demo
   ```
3. **Make your changes**
4. **Write tests** (when applicable)
5. **Commit your changes**
   ```bash
   git commit -m "Add amazing security demonstration"
   ```
6. **Push to your branch**
   ```bash
   git push origin feature/amazing-security-demo
   ```
7. **Open a Pull Request**

### Contribution Guidelines

- Follow TypeScript best practices
- Maintain educational value in all demonstrations
- Ensure all security examples are safe and ethical
- Update documentation for new features
- Test thoroughly across different browsers

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Security Testing

- All demonstrations are designed to be safe and educational
- No actual vulnerabilities are created or exploited
- All simulated attacks are contained within the application

## 📚 Resources

### Learning Materials

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)
- [Same-Origin Policy - MDN](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy)
- [CSRF Prevention - OWASP](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)

### Documentation

- [React Documentation](https://reactjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)

## 🐛 Troubleshooting

### Common Issues

**CORS Errors in Development**

```bash
# Solution: Ensure your backend has proper CORS configuration
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

**TypeScript Compilation Errors**

```bash
# Clear TypeScript cache
npm run clean
npm install
```

**Styling Issues**

```bash
# Rebuild Tailwind styles
npm run build:css
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OWASP** for comprehensive security guidelines
- **React Team** for the amazing framework
- **Tailwind CSS** for beautiful, utility-first styling
- **Security Research Community** for ongoing vulnerability research

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/web-security-learning-platform/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/web-security-learning-platform/discussions)
- **Email**: your.email@example.com

---

**⚠️ Educational Purpose Only**: This platform is designed solely for educational purposes. All security demonstrations are safe, contained, and do not create real vulnerabilities. Always practice responsible disclosure and ethical security research.

**🌟 Happy Learning!** If you find this project helpful, please consider giving it a star on GitHub!
