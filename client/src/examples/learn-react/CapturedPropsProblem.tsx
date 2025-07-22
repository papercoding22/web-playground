import React, { useState } from "react";

// Type definitions
interface CardProps {
  children: React.ReactNode;
  className?: string;
}

interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: "primary" | "secondary" | "warning" | "function" | "class";
  className?: string;
  disabled?: boolean;
}

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "error" | "function" | "class";
  className?: string;
}

interface AlertProps {
  children: React.ReactNode;
  variant?: "error" | "warning" | "success" | "info";
  className?: string;
}

interface CartMessageProps {
  message: string;
}

interface ProductProps {
  product: string;
  onAdd: (message: string) => void;
}

// Reusable UI Components
const Card: React.FC<CardProps> = ({ children, className = "" }) => (
  <div
    className={`bg-white rounded-xl shadow-lg border border-gray-200 p-6 ${className}`}
  >
    {children}
  </div>
);

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = "primary",
  className = "",
  disabled = false,
}) => {
  const variants = {
    primary: "bg-purple-500 hover:bg-purple-600 text-white",
    secondary: "bg-gray-500 hover:bg-gray-600 text-white",
    warning: "bg-orange-500 hover:bg-orange-600 text-white",
    function: "bg-blue-500 hover:bg-blue-600 text-white",
    class: "bg-green-500 hover:bg-green-600 text-white",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-3 text-lg font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
  className = "",
}) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    error: "bg-red-100 text-red-800",
    function: "bg-blue-100 text-blue-800",
    class: "bg-green-100 text-green-800",
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

const Alert: React.FC<AlertProps> = ({
  children,
  variant = "info",
  className = "",
}) => {
  const variants = {
    error: "bg-red-50 border-red-200 text-red-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    success: "bg-green-50 border-green-200 text-green-800",
    info: "bg-purple-50 border-purple-200 text-purple-800",
  };

  return (
    <div
      className={`border-l-4 p-4 rounded-r-lg ${variants[variant]} ${className}`}
    >
      {children}
    </div>
  );
};

// Cart Message Component
function CartMessage({ message }: CartMessageProps) {
  const isFunction = message.includes("(Function)");
  const isClass = message.includes("(Class)");

  return (
    <div
      className={`p-4 rounded-lg border-l-4 ${
        isFunction
          ? "bg-blue-50 border-blue-200"
          : isClass
          ? "bg-green-50 border-green-200"
          : "bg-gray-50 border-gray-200"
      }`}
    >
      <div className="flex items-center space-x-2">
        <span className="text-lg">🛒</span>
        <span
          className={`text-sm font-mono ${
            isFunction
              ? "text-blue-700"
              : isClass
              ? "text-green-700"
              : "text-gray-700"
          }`}
        >
          {message}
        </span>
        {isFunction && <Badge variant="function">Function</Badge>}
        {isClass && <Badge variant="class">Class</Badge>}
      </div>
    </div>
  );
}

// Function Component
function ProductFunction({ product, onAdd }: ProductProps) {
  const handleClick = () => {
    setTimeout(() => {
      onAdd(`(Function) Added "${product}" to cart!`);
    }, 3000);
  };

  return (
    <Card className="border-2 border-blue-200 bg-blue-50">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Badge variant="function">Function Component</Badge>
            <span className="text-sm text-gray-600">⚠️ Captures props</span>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-blue-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            📱 {product}
          </h3>
          <Button onClick={handleClick} variant="function" className="w-full">
            🛒 Add to Cart (3s delay)
          </Button>
        </div>
        <p className="text-xs text-blue-600">
          💡 Closure captures current prop value at render time
        </p>
      </div>
    </Card>
  );
}

// Class Component
class ProductClass extends React.Component<ProductProps> {
  handleClick = () => {
    setTimeout(() => {
      this.props.onAdd(`(Class) Added "${this.props.product}" to cart!`);
    }, 3000);
  };

  render() {
    return (
      <Card className="border-2 border-green-200 bg-green-50">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Badge variant="class">Class Component</Badge>
              <span className="text-sm text-gray-600">✅ Always current</span>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-green-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              📱 {this.props.product}
            </h3>
            <Button
              onClick={this.handleClick}
              variant="class"
              className="w-full"
            >
              🛒 Add to Cart (3s delay)
            </Button>
          </div>
          <p className="text-xs text-green-600">
            💡 this.props always references latest props
          </p>
        </div>
      </Card>
    );
  }
}

const randomProducts = [
  "iPhone 15",
  "MacBook Pro",
  "iPad Air",
  "Apple Watch Series 9",
  "AirPods Pro",
];

// Main App Component
function CapturedPropsChange() {
  const [product, setProduct] = useState<string>("iPhone 15");
  const [messages, setMessages] = useState<string[]>([]);

  const changeProduct = () => {
    const randomProduct =
      randomProducts[Math.floor(Math.random() * randomProducts.length)];
    setProduct(randomProduct);
  };

  const handleAddToCart = (message: string) => {
    setMessages((prev) => [...prev, message]);
  };

  const clearMessages = () => {
    setMessages([]);
  };

  // Check if there are any prop capture issues
  const hasStaleProps = messages.some((msg) => {
    if (msg.includes("(Function)")) {
      const capturedProduct = msg.split('"')[1];
      return capturedProduct !== product;
    }
    return false;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🛒 Product Comparison Demo
          </h1>
          <p className="text-gray-600">
            Function vs Class Components: Props Capture Behavior
          </p>
        </div>

        {/* Problem Badge */}
        <div className="text-center">
          <Badge variant="warning" className="text-base px-4 py-2">
            ⚠️ Function Component Props Capture Issue
          </Badge>
        </div>

        {/* Current Product Display */}
        <Card>
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-3">
              <span className="text-2xl">📱</span>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Current Product: {product}
                </h2>
                <p className="text-gray-600">
                  This will change when you switch products
                </p>
              </div>
            </div>
            <div className="flex gap-4 justify-center">
              <Button onClick={changeProduct} variant="primary">
                🔄 Switch Product
              </Button>
              {messages.length > 0 && (
                <Button onClick={clearMessages} variant="secondary">
                  🗑️ Clear Messages
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Instructions */}
        <Alert variant="info">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-lg">🎯</span>
              <span className="font-semibold">How to Test</span>
            </div>
            <ol className="text-sm space-y-1 ml-6">
              <li>1. Click "Add to Cart" on both components</li>
              <li>2. Quickly click "Switch Product" before 3 seconds</li>
              <li>3. Watch the different behaviors in the cart messages</li>
            </ol>
          </div>
        </Alert>

        {/* Components Comparison */}
        <div className="grid md:grid-cols-2 gap-6">
          <ProductFunction product={product} onAdd={handleAddToCart} />
          <ProductClass product={product} onAdd={handleAddToCart} />
        </div>

        {/* Stale Props Detection */}
        {hasStaleProps && (
          <Alert variant="warning">
            <div className="flex items-center space-x-2">
              <span className="text-xl">🕰️</span>
              <span className="font-semibold">Stale Props Detected!</span>
            </div>
            <p className="mt-1 text-sm">
              The function component captured old prop values, while the class
              component used current values.
            </p>
          </Alert>
        )}

        {/* Cart Messages */}
        {messages.length > 0 && (
          <Card>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">🛒</span>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Cart Messages
                  </h3>
                  <Badge variant="default">{messages.length} items</Badge>
                </div>
              </div>
              <div className="space-y-3">
                {messages.map((msg, index) => (
                  <CartMessage key={index} message={msg} />
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* Educational Content */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Function Component Explanation */}
          <Card className="bg-blue-50 border-blue-200">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className="text-xl">⚙️</span>
                <h3 className="text-lg font-semibold text-blue-800">
                  Function Component
                </h3>
              </div>
              <div className="text-sm text-blue-700 space-y-2">
                <p>
                  <strong>Props Capture:</strong> Closures capture prop values
                  at render time
                </p>
                <p>
                  <strong>Stale Values:</strong> setTimeout sees old props even
                  after re-render
                </p>
                <p>
                  <strong>Behavior:</strong> Shows the product name from when
                  button was clicked
                </p>
              </div>
            </div>
          </Card>

          {/* Class Component Explanation */}
          <Card className="bg-green-50 border-green-200">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className="text-xl">🏗️</span>
                <h3 className="text-lg font-semibold text-green-800">
                  Class Component
                </h3>
              </div>
              <div className="text-sm text-green-700 space-y-2">
                <p>
                  <strong>Dynamic Access:</strong> this.props always points to
                  current props
                </p>
                <p>
                  <strong>Fresh Values:</strong> setTimeout accesses latest
                  props via this.props
                </p>
                <p>
                  <strong>Behavior:</strong> Shows the current product name when
                  timeout executes
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Status Footer */}
        <div className="text-center">
          <div className="flex justify-center space-x-4">
            <Badge variant={hasStaleProps ? "warning" : "default"}>
              {hasStaleProps ? "Props Capture Detected" : "No Stale Props Yet"}
            </Badge>
            <Badge variant="default">Current: {product}</Badge>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CapturedPropsChange;
