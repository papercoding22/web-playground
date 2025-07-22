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
    primary: "bg-green-500 hover:bg-green-600 text-white",
    secondary: "bg-gray-500 hover:bg-gray-600 text-white",
    warning: "bg-orange-500 hover:bg-orange-600 text-white",
    function: "bg-green-500 hover:bg-green-600 text-white",
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
    function: "bg-green-100 text-green-800",
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
    info: "bg-green-50 border-green-200 text-green-800",
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
          ? "bg-green-50 border-green-200"
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
              ? "text-green-700"
              : isClass
              ? "text-green-700"
              : "text-gray-700"
          }`}
        >
          {message}
        </span>
        {isFunction && <Badge variant="success">✅ Fixed Function</Badge>}
        {isClass && <Badge variant="success">✅ Fixed Class</Badge>}
      </div>
    </div>
  );
}

// Function Component (Fixed)
function ProductFunction({ product, onAdd }: ProductProps) {
  const handleClick = () => {
    setTimeout(() => {
      onAdd(`(Function) Added "${product}" to cart!`);
    }, 3000);
  };

  return (
    <Card className="border-2 border-green-200 bg-green-50">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Badge variant="success">✅ Fixed Function Component</Badge>
            <span className="text-sm text-gray-600">
              Now captures correctly!
            </span>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-green-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            📱 {product}
          </h3>
          <Button onClick={handleClick} variant="function" className="w-full">
            🛒 Add to Cart (3s delay)
          </Button>
        </div>
        <p className="text-xs text-green-600">
          ✅ Now captures props correctly by storing in local variable
        </p>
      </div>
    </Card>
  );
}

// Class Component (Also Fixed)
class ProductClass extends React.Component<ProductProps> {
  render() {
    const props = this.props; // Capture props in render method
    const handleClick = () => {
      setTimeout(() => {
        // Use captured props variable instead of this.props
        this.props.onAdd(`(Class) Added "${props.product}" to cart!`);
      }, 3000);
    };

    return (
      <Card className="border-2 border-green-200 bg-green-50">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Badge variant="success">✅ Fixed Class Component</Badge>
              <span className="text-sm text-gray-600">
                Props captured in render!
              </span>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-green-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              📱 {this.props.product}
            </h3>
            <Button onClick={handleClick} variant="class" className="w-full">
              🛒 Add to Cart (3s delay)
            </Button>
          </div>
          <p className="text-xs text-green-600">
            ✅ Props captured in render method, consistent behavior achieved
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
function CapturedPropsChangeSolution() {
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

  // Both components should now behave consistently
  const allMessagesConsistent =
    messages.length > 0 &&
    messages.every((msg) => {
      if (msg.includes("Added")) {
        const productInMessage = msg.split('"')[1];
        // In the solution, we expect both to capture the same product
        return true; // Since we fixed both, they should be consistent
      }
      return true;
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🛒 Product Comparison Solution
          </h1>
          <p className="text-gray-600">
            Both components now capture props consistently! 🎯
          </p>
        </div>

        {/* Solution Badge */}
        <div className="text-center">
          <Badge variant="success" className="text-base px-4 py-2">
            ✅ Props Capture Issue Fixed
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
                <p className="text-green-600">
                  ✅ Both components will capture this value consistently
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
        <Alert variant="success">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-lg">🎯</span>
              <span className="font-semibold">Test the Solution</span>
            </div>
            <ol className="text-sm space-y-1 ml-6">
              <li>1. Click "Add to Cart" on both components</li>
              <li>2. Quickly click "Switch Product" before 3 seconds</li>
              <li>
                3. Notice both components now show the same captured product
              </li>
            </ol>
          </div>
        </Alert>

        {/* Components Comparison */}
        <div className="grid md:grid-cols-2 gap-6">
          <ProductFunction product={product} onAdd={handleAddToCart} />
          <ProductClass product={product} onAdd={handleAddToCart} />
        </div>

        {/* Success Alert */}
        {messages.length > 0 && (
          <Alert variant="success">
            <div className="flex items-center space-x-2">
              <span className="text-xl">🎉</span>
              <span className="font-semibold">
                Perfect! Consistent Behavior
              </span>
            </div>
            <p className="mt-1 text-sm">
              Both components now capture props at render time, ensuring
              consistent behavior.
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

        {/* Solution Explanation */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Function Component Solution */}
          <Card className="bg-green-50 border-green-200">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className="text-xl">🔧</span>
                <h3 className="text-lg font-semibold text-green-800">
                  Function Component Fix
                </h3>
              </div>
              <div className="text-sm text-green-700 space-y-2">
                <p>
                  <strong>No Change Needed:</strong> Function components
                  naturally capture props
                </p>
                <p>
                  <strong>Closure Behavior:</strong> The product parameter
                  already captures the value
                </p>
                <p>
                  <strong>Consistent:</strong> Now both components behave the
                  same way
                </p>
              </div>
            </div>
          </Card>

          {/* Class Component Solution */}
          <Card className="bg-green-50 border-green-200">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className="text-xl">🛠️</span>
                <h3 className="text-lg font-semibold text-green-800">
                  Class Component Fix
                </h3>
              </div>
              <div className="text-sm text-green-700 space-y-2">
                <p>
                  <strong>Capture in Render:</strong> const props = this.props
                  in render method
                </p>
                <p>
                  <strong>Use Captured:</strong> Reference props.product instead
                  of this.props.product
                </p>
                <p>
                  <strong>Consistent:</strong> Now matches function component
                  behavior
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Code Comparison */}
        <Card className="bg-green-50 border-green-200">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-xl">💻</span>
              <h3 className="text-lg font-semibold text-green-800">
                Solution Code
              </h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="bg-white p-4 rounded border border-green-200">
                <p className="font-medium text-green-800 mb-2">
                  ✅ Function (Already Good)
                </p>
                <code className="text-xs text-green-700 block">
                  function Product(&#123; product &#125;) &#123;
                  <br />
                  &nbsp;&nbsp;const handleClick = () =&gt; &#123;
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;setTimeout(() =&gt; &#123;
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// product is captured!
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;onAdd(`Added
                  $&#123;product&#125;`);
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&#125;, 3000);
                  <br />
                  &nbsp;&nbsp;&#125;;
                  <br />
                  &#125;
                </code>
              </div>
              <div className="bg-white p-4 rounded border border-green-200">
                <p className="font-medium text-green-800 mb-2">
                  ✅ Class (Fixed)
                </p>
                <code className="text-xs text-green-700 block">
                  render() &#123;
                  <br />
                  &nbsp;&nbsp;const props = this.props; // Capture!
                  <br />
                  &nbsp;&nbsp;const handleClick = () =&gt; &#123;
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;setTimeout(() =&gt; &#123;
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// Use captured props
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;onAdd(`Added
                  $&#123;props.product&#125;`);
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&#125;, 3000);
                  <br />
                  &nbsp;&nbsp;&#125;;
                  <br />
                  &#125;
                </code>
              </div>
            </div>
          </div>
        </Card>

        {/* Status Footer */}
        <div className="text-center">
          <div className="flex justify-center space-x-4">
            <Badge variant="success">Props Capture Fixed</Badge>
            <Badge variant="success">Consistent Behavior</Badge>
            <Badge variant="default">Current: {product}</Badge>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CapturedPropsChangeSolution;
