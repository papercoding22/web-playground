import React, { useState } from "react";

interface Product {
  id: number;
  name: string;
  price: number;
}

const products: Product[] = [
  { id: 1, name: "🍕 Pizza", price: 12.99 },
  { id: 2, name: "🍔 Burger", price: 8.99 },
  { id: 3, name: "🍟 Fries", price: 4.99 },
  { id: 4, name: "🥤 Drink", price: 2.99 },
];

const ShoppingCartReact: React.FC = () => {
  // React  approach - single source of truth
  const [cartItems, setCartItems] = useState<Product[]>([]);

  const addToCart = (product: Product) => {
    setCartItems((prevItems) => [...prevItems, product]);
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.length;
  const totalPrice = cartItems.reduce((total, item) => total + item.price, 0);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Product List */}
      <div className="bg-white border rounded-lg p-4">
        <h2 className="text-xl font-bold mb-4">🍕 Menu</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((product) => (
            <div key={product.id} className="border rounded-lg p-3 text-center">
              <div className="text-2xl mb-2">{product.name}</div>
              <div className="font-bold text-green-600 mb-3">
                ${product.price}
              </div>
              <div className="space-y-2">
                <button
                  onClick={() => addToCart(product)}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white text-xs py-1 px-2 rounded transition-colors"
                >
                  Add (React)
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        {/* Clear Cart */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-blue-800">
            🔵 React Approach
          </h3>
          <button
            onClick={clearCart}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
          >
            Clear Cart
          </button>
        </div>

        {/* Header */}
        <div className="bg-blue-100 p-3 rounded mb-3">
          <div className="flex justify-between items-center">
            <span className="font-semibold">🏪 Header Navigation</span>
            <div className="bg-blue-600 text-white px-2 py-1 rounded-full text-sm">
              Cart (<span className="font-bold">{cartCount}</span>)
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="bg-blue-100 p-3 rounded mb-3">
          <div className="font-semibold mb-2">📋 Sidebar Menu</div>
          <div className="text-sm">
            🛒 Shopping Cart: <span className="font-bold">{cartCount}</span>{" "}
            items
          </div>
        </div>
      </div>

      {/* Cart Content */}
      <div className="bg-blue-100 p-3 rounded mb-3">
        <div className="font-semibold mb-2">📦 Cart Contents</div>
        <div className="min-h-[100px] text-sm">
          {cartItems.length === 0 ? (
            <div className="text-gray-500 italic">Cart is empty</div>
          ) : (
            cartItems.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-2 bg-gray-50 rounded mb-2"
              >
                <span>{item.name}</span>
                <span className="font-semibold">${item.price.toFixed(2)}</span>
              </div>
            ))
          )}
        </div>
        <div className="font-bold text-right">
          Total: ${totalPrice.toFixed(2)}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-blue-100 p-3 rounded">
        <div className="text-center text-sm">
          🦶 Footer: Items in cart:{" "}
          <span className="font-bold">{cartCount}</span>
        </div>
      </div>

      {/* Explanation */}
      <div className="mt-4 p-3 bg-blue-200 rounded text-sm">
        <div className="font-semibold text-blue-800 mb-1">✨ The Magic:</div>
        <ul className="text-blue-700 space-y-1">
          <li>• Single `setCartItems()` call</li>
          <li>• ALL UI updates automatically</li>
          <li>• State centralized & predictable</li>
          <li>• Impossible to forget locations!</li>
        </ul>
      </div>
    </div>
  );
};

export default ShoppingCartReact;
