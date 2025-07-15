import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

// Types
interface Product {
  id: number;
  name: string;
  price: number;
  rating: number;
  reviews: Review[];
}

interface Review {
  id: number;
  productId: number;
  user: string;
  rating: number;
  comment: string;
  date: string;
}

interface CorsConfig {
  allowedOrigins: string[];
  allowCredentials: boolean;
  optionsSuccessStatus: number;
}

class CORSServer {
  private app: express.Application;
  private port: number;
  private corsConfig: CorsConfig;

  // Sample data
  private products: Product[] = [
    {
      id: 1,
      name: 'Premium Laptop',
      price: 1299,
      rating: 4.5,
      reviews: [
        {
          id: 1,
          productId: 1,
          user: 'John',
          rating: 5,
          comment: 'Excellent laptop!',
          date: '2024-01-15',
        },
        {
          id: 2,
          productId: 1,
          user: 'Sarah',
          rating: 4,
          comment: 'Good performance',
          date: '2024-01-20',
        },
      ],
    },
    {
      id: 2,
      name: 'Wireless Mouse',
      price: 49,
      rating: 4.2,
      reviews: [
        { id: 3, productId: 2, user: 'Mike', rating: 4, comment: 'Works well', date: '2024-01-10' },
      ],
    },
  ];

  constructor(port: number = 3001) {
    this.app = express();
    this.port = port;
    this.corsConfig = {
      allowedOrigins: [
        'http://localhost:3000', // React dev server
        'https://trusted-shop.com', // Production frontend
        'https://partner-store.com', // Partner site
      ],
      allowCredentials: true,
      optionsSuccessStatus: 200,
    };

    this.initializeMiddleware();
    this.initializeRoutes();
  }

  private initializeMiddleware(): void {
    // Security headers
    this.app.use(helmet());

    // Logging
    this.app.use(morgan('combined'));

    // Parse JSON
    this.app.use(express.json());

    // Custom CORS middleware (Method 1: Manual implementation)
    this.app.use(this.customCorsMiddleware.bind(this));

    // Alternative: Using cors package (Method 2: Uncomment to use)
    // this.app.use(this.configureCorsPackage());
  }

  // Method 1: Custom CORS implementation
  private customCorsMiddleware(req: Request, res: Response, next: NextFunction): void {
    const origin = req.headers.origin as string;
    const userAgent = req.headers['user-agent'] as string;

    console.log(`\n🌐 Request from origin: ${origin || 'no origin header'}`);
    console.log(`📍 Request URL: ${req.method} ${req.url}`);
    console.log(`🤖 User-Agent: ${userAgent || 'no user-agent'}`);

    // Special handling for requests without origin (same-origin, mobile apps, server-to-server)
    if (!origin) {
      console.log(`ℹ️  No origin header - allowing (same-origin, mobile app, or server-to-server)`);
      // No CORS headers needed for same-origin requests
      next();
      return;
    }

    // Check if origin is in allowed list
    if (this.corsConfig.allowedOrigins.includes(origin)) {
      console.log(`✅ Origin allowed: ${origin}`);

      // Set CORS headers for allowed origins
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

      if (this.corsConfig.allowCredentials) {
        res.setHeader('Access-Control-Allow-Credentials', 'true');
      }

      // Handle preflight requests
      if (req.method === 'OPTIONS') {
        console.log(`🔍 Preflight request handled for allowed origin`);
        res.sendStatus(this.corsConfig.optionsSuccessStatus);
        return;
      }

      next();
    } else {
      // CORS policy rejection
      console.log(`🚫 REJECTING REQUEST - Origin not allowed: ${origin}`);
      console.log(`🛡️  Server-side security: Preventing unauthorized access`);

      // SERVER REJECTS THE REQUEST IMMEDIATELY
      res.status(403).json({
        success: false,
        error: 'Origin not allowed by server CORS policy',
        origin: origin,
        allowedOrigins: this.corsConfig.allowedOrigins,
        timestamp: new Date().toISOString(),
        message:
          'This server only accepts requests from authorized origins. Contact admin to whitelist your domain.',
      });
      return; // Stop processing - don't call next()
    }
  }

  // Method 2: Using cors package (alternative approach)
  private configureCorsPackage() {
    return cors({
      origin: (
        origin: string | undefined,
        callback: (err: Error | null, allow?: boolean) => void
      ) => {
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) return callback(null, true);

        if (this.corsConfig.allowedOrigins.includes(origin)) {
          console.log(`✅ CORS package: Origin allowed: ${origin}`);
          callback(null, true);
        } else {
          console.log(`❌ CORS package: Origin blocked: ${origin}`);
          callback(new Error('Not allowed by CORS'), false);
        }
      },
      credentials: this.corsConfig.allowCredentials,
      optionsSuccessStatus: this.corsConfig.optionsSuccessStatus,
    });
  }

  private initializeRoutes(): void {
    // Health check
    this.app.get('/health', (req: Request, res: Response) => {
      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        corsConfig: {
          allowedOrigins: this.corsConfig.allowedOrigins,
          allowCredentials: this.corsConfig.allowCredentials,
        },
      });
    });

    // Get all products
    this.app.get('/api/products', (req: Request, res: Response) => {
      console.log(`📦 Sending ${this.products.length} products`);
      res.json({
        success: true,
        data: this.products,
        timestamp: new Date().toISOString(),
      });
    });

    // Get specific product
    this.app.get('/api/products/:id', (req: Request, res: Response) => {
      const productId = parseInt(req.params.id);
      const product = this.products.find((p) => p.id === productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          error: 'Product not found',
        });
      }

      console.log(`📦 Sending product: ${product.name}`);
      res.json({
        success: true,
        data: product,
        timestamp: new Date().toISOString(),
      });
    });

    // Get reviews for a product
    this.app.get('/api/products/:id/reviews', (req, res) => {
      const productId = parseInt(req.params.id);
      const product = this.products.find((p) => p.id === productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          error: 'Product not found',
        });
      }

      console.log(`⭐ Sending ${product.reviews.length} reviews for ${product.name}`);
      res.json({
        success: true,
        data: product.reviews,
        timestamp: new Date().toISOString(),
      });
    });

    // Add new review (POST example)
    this.app.post('/api/products/:id/reviews', (req: Request, res: Response) => {
      const productId = parseInt(req.params.id);
      const product = this.products.find((p) => p.id === productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          error: 'Product not found',
        });
      }

      const { user, rating, comment } = req.body;

      if (!user || !rating || !comment) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: user, rating, comment',
        });
      }

      const newReview: Review = {
        id: Date.now(), // Simple ID generation
        productId,
        user,
        rating: parseInt(rating),
        comment,
        date: new Date().toISOString().split('T')[0],
      };

      product.reviews.push(newReview);

      // Recalculate average rating
      const avgRating =
        product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length;
      product.rating = Math.round(avgRating * 10) / 10;

      console.log(`📝 New review added for ${product.name} by ${user}`);
      res.json({
        success: true,
        data: newReview,
        message: 'Review added successfully',
      });
    });

    // Admin endpoint to update CORS configuration
    this.app.post('/admin/cors/origins', (req: Request, res: Response) => {
      const { action, origin } = req.body;

      if (action === 'add' && origin && !this.corsConfig.allowedOrigins.includes(origin)) {
        this.corsConfig.allowedOrigins.push(origin);
        console.log(`🔧 Added origin to allowlist: ${origin}`);
      } else if (action === 'remove' && origin) {
        this.corsConfig.allowedOrigins = this.corsConfig.allowedOrigins.filter((o) => o !== origin);
        console.log(`🔧 Removed origin from allowlist: ${origin}`);
      }

      res.json({
        success: true,
        corsConfig: this.corsConfig,
      });
    });

    // Catch-all for undefined routes
    this.app.use('*', (req: Request, res: Response) => {
      res.status(404).json({
        success: false,
        error: 'Route not found',
        availableEndpoints: [
          'GET /health',
          'GET /api/products',
          'GET /api/products/:id',
          'GET /api/products/:id/reviews',
          'POST /api/products/:id/reviews',
          'POST /admin/cors/origins',
        ],
      });
    });
  }

  public start(): void {
    this.app.listen(this.port, () => {
      console.log('\n🚀 CORS Demo Server Started!');
      console.log(`📡 Server running on: http://localhost:${this.port}`);
      console.log(`🛡️  CORS enabled for origins: ${this.corsConfig.allowedOrigins.join(', ')}`);
      console.log('\n📋 Available endpoints:');
      console.log(`   GET  /health`);
      console.log(`   GET  /api/products`);
      console.log(`   GET  /api/products/:id`);
      console.log(`   GET  /api/products/:id/reviews`);
      console.log(`   POST /api/products/:id/reviews`);
      console.log(`   POST /admin/cors/origins`);
      console.log('\n🧪 Test with:');
      console.log(`   curl http://localhost:${this.port}/api/products`);
      console.log(
        `   curl -H "Origin: https://trusted-shop.com" http://localhost:${this.port}/api/products`
      );
      console.log(
        `   curl -H "Origin: https://evil-site.com" http://localhost:${this.port}/api/products`
      );
    });
  }
}

// Start the server
const server = new CORSServer(3001);
server.start();

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n👋 Gracefully shutting down...');
  process.exit(0);
});

export default CORSServer;
