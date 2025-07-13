import React, { useState } from "react";
import { AlertTriangle, Shield, ShoppingCart, Bug } from "lucide-react";

// TypeScript interfaces for type safety
interface Product {
  name: string;
  price: number;
  tax: number;
}

interface ProductDatabase {
  [key: string]: Product;
}

interface PurchaseResult {
  success: boolean;
  message: string;
  serverProcessed: string;
  vulnerability?: string;
  security?: string;
  attack?: string;
  impact?: string;
  attackBlocked?: string;
}

interface TransactionResult extends PurchaseResult {
  timestamp: string;
  productName: string;
  isAttack: boolean;
}

// Type for server implementation versions
type ServerVersion = "vulnerable" | "secure";

// Vulnerable Server Implementation
class VulnerableServer {
  // BAD: Accepts client-side pricing data
  purchase(
    productId: string,
    clientPrice: number,
    clientTax: number,
    clientTotal: number
  ): PurchaseResult {
    return {
      success: true,
      message: `Purchase successful! Charged $${clientTotal}`,
      serverProcessed: `Server trusted: Price=$${clientPrice}, Tax=$${clientTax}, Total=$${clientTotal}`,
      vulnerability: "Server trusted client-side pricing data!",
    };
  }
}

// Secure Server Implementation
class SecureServer {
  constructor(private productDatabase: ProductDatabase) {}

  // GOOD: Only accepts productId, validates everything server-side
  purchase(productId: string): PurchaseResult {
    const product = this.productDatabase[productId];

    if (!product) {
      return {
        success: false,
        message: "Product not found",
        serverProcessed: "Product validation failed",
        security: "Server rejected invalid product ID",
      };
    }

    const total = product.price + product.tax;

    return {
      success: true,
      message: `Purchase successful! Charged $${total}`,
      serverProcessed: `Server calculated: Price=$${product.price}, Tax=$${product.tax}, Total=$${total}`,
      security:
        "Server ignored any client pricing data and used authoritative database!",
    };
  }
}

// Product Card Component with proper typing
interface ProductCardProps {
  id: string;
  product: Product;
}

// Simulated product database with proper typing
const products: ProductDatabase = {
  "1": { name: "Premium Laptop", price: 1200, tax: 96 },
  "2": { name: "Wireless Mouse", price: 50, tax: 4 },
  "3": { name: "Mechanical Keyboard", price: 150, tax: 12 },
};

const EcommerceSecurityDemo: React.FC = () => {
  const [selectedVersion, setSelectedVersion] =
    useState<ServerVersion>("vulnerable");
  const [results, setResults] = useState<TransactionResult[]>([]);

  // Server instances
  const vulnerableServer = new VulnerableServer();
  const secureServer = new SecureServer(products);

  const handlePurchase = (
    productId: string,
    isAttack: boolean = false
  ): void => {
    const product = products[productId];

    if (!product) {
      console.error(`Product ${productId} not found`);
      return;
    }

    const realTotal = product.price + product.tax;
    let result: PurchaseResult;

    if (selectedVersion === "vulnerable") {
      if (isAttack) {
        // Simulate attack: send fake pricing data
        result = vulnerableServer.purchase(productId, 1, 0.08, 1.08);
        result.attack = `🚨 ATTACK: Sent fake price ($1.08) instead of real price ($${realTotal})`;
        result.impact = `Attacker got $${product.price} product for $1.08!`;
      } else {
        // Normal purchase with real data
        result = vulnerableServer.purchase(
          productId,
          product.price,
          product.tax,
          realTotal
        );
      }
    } else {
      // Secure version ignores client pricing
      result = secureServer.purchase(productId);
      if (isAttack) {
        result.attackBlocked =
          "🛡️ Attack blocked! Server ignored fake pricing data.";
      }
    }

    const transactionResult: TransactionResult = {
      ...result,
      timestamp: new Date().toLocaleTimeString(),
      productName: product.name,
      isAttack,
    };

    setResults((prev) => [...prev, transactionResult]);
  };

  const clearResults = (): void => {
    setResults([]);
  };

  const ProductCard: React.FC<ProductCardProps> = ({ id, product }) => (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
      <div className="space-y-1 text-sm mb-4">
        <div>Price: ${product.price}</div>
        <div>Tax: ${product.tax}</div>
        <div className="font-semibold border-t pt-2">
          Total: ${product.price + product.tax}
        </div>
      </div>
      <div className="space-y-2">
        <button
          onClick={() => handlePurchase(id, false)}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center justify-center gap-2 transition-colors"
        >
          <ShoppingCart size={16} />
          Buy Now
        </button>
        <button
          onClick={() => handlePurchase(id, true)}
          className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded flex items-center justify-center gap-2 transition-colors"
        >
          <Bug size={16} />
          Simulate Attack
        </button>
      </div>
    </div>
  );

  // Version selector component
  const VersionSelector: React.FC = () => (
    <div className="mb-8 bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Choose Implementation:</h2>
      <div className="flex gap-4">
        <button
          onClick={() => {
            setSelectedVersion("vulnerable");
            clearResults();
          }}
          className={`px-6 py-3 rounded-lg flex items-center gap-2 transition-colors ${
            selectedVersion === "vulnerable"
              ? "bg-red-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          <AlertTriangle size={20} />
          Vulnerable Version
        </button>
        <button
          onClick={() => {
            setSelectedVersion("secure");
            clearResults();
          }}
          className={`px-6 py-3 rounded-lg flex items-center gap-2 transition-colors ${
            selectedVersion === "secure"
              ? "bg-green-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          <Shield size={20} />
          Secure Version
        </button>
      </div>
    </div>
  );

  // Implementation details component
  const ImplementationDetails: React.FC = () => (
    <div className="mb-8 bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Current Implementation:</h2>
      {selectedVersion === "vulnerable" ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="font-semibold text-red-800 mb-2">
            ⚠️ Vulnerable Server Logic:
          </h3>
          <code className="text-sm text-red-700 block bg-red-100 p-3 rounded whitespace-pre">
            {`// BAD: Server trusts client-sent pricing
class VulnerableServer {
  purchase(productId: string, clientPrice: number, 
           clientTax: number, clientTotal: number): PurchaseResult {
    // Trusts client data without validation!
    return chargeCreditCard(clientTotal);
  }
}`}
          </code>
        </div>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-green-800 mb-2">
            ✅ Secure Server Logic:
          </h3>
          <code className="text-sm text-green-700 block bg-green-100 p-3 rounded whitespace-pre">
            {`// GOOD: Server validates with authoritative database
class SecureServer {
  constructor(private productDatabase: ProductDatabase) {}
  
  purchase(productId: string): PurchaseResult {
    const product = this.productDatabase[productId];
    const total = product.price + product.tax;
    return chargeCreditCard(total); // Uses server data!
  }
}`}
          </code>
        </div>
      )}
    </div>
  );

  // Transaction results component
  const TransactionResults: React.FC = () => (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Transaction Results:</h2>
        <button
          onClick={clearResults}
          className="text-sm bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded"
        >
          Clear Results
        </button>
      </div>
      <div className="space-y-4">
        {results.map((result, index) => (
          <div
            key={index}
            className={`border rounded-lg p-4 ${
              result.isAttack ? "border-red-300 bg-red-50" : "border-gray-200"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-gray-500">{result.timestamp}</span>
              <span className="font-semibold">{result.productName}</span>
              {result.isAttack && (
                <span className="text-red-600 font-bold">ATTACK</span>
              )}
            </div>

            <div className="space-y-2 text-sm">
              <div className="font-semibold text-green-600">
                {result.message}
              </div>
              <div className="text-gray-600">{result.serverProcessed}</div>

              {result.attack && (
                <div className="text-red-600 font-semibold">
                  {result.attack}
                </div>
              )}

              {result.impact && (
                <div className="text-red-700 bg-red-100 p-2 rounded">
                  {result.impact}
                </div>
              )}

              {result.vulnerability && (
                <div className="text-red-600 font-semibold">
                  🚨 {result.vulnerability}
                </div>
              )}

              {result.security && (
                <div className="text-green-600 font-semibold">
                  🛡️ {result.security}
                </div>
              )}

              {result.attackBlocked && (
                <div className="text-green-700 bg-green-100 p-2 rounded font-semibold">
                  {result.attackBlocked}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">
        E-commerce Security Demo (TypeScript)
      </h1>

      <VersionSelector />
      <ImplementationDetails />

      {/* Products */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Products:</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(products).map(([id, product]) => (
            <ProductCard key={id} id={id} product={product} />
          ))}
        </div>
      </div>

      {/* Results */}
      {results.length > 0 && <TransactionResults />}

      {/* Instructions */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-800 mb-2">
          How to Use This Demo:
        </h3>
        <ol className="text-sm text-blue-700 space-y-1 list-decimal ml-4">
          <li>
            Select "Vulnerable Version" and try the "Simulate Attack" button
          </li>
          <li>See how the server accepts fake pricing data</li>
          <li>Switch to "Secure Version" and try the same attack</li>
          <li>
            Notice how the server ignores client pricing and uses its own
            database
          </li>
          <li>
            Compare the transaction results to understand the security
            difference
          </li>
        </ol>

        <div className="mt-4 p-3 bg-blue-100 rounded">
          <h4 className="font-semibold text-blue-800 mb-1">
            TypeScript Security Benefits:
          </h4>
          <p className="text-sm text-blue-700">
            Notice how TypeScript interfaces prevent certain types of errors at
            compile time, and the class-based approach makes the security
            boundaries more explicit.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EcommerceSecurityDemo;
