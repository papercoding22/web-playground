import React, { useState, useRef, useEffect } from "react";

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

const ShoppingCartDOM: React.FC = () => {
  // Direct DOM refs
  const headerCountRef = useRef<HTMLSpanElement>(null);
  const sidebarCountRef = useRef<HTMLSpanElement>(null);
  const footerCountRef = useRef<HTMLSpanElement>(null);
  const cartListRef = useRef<HTMLDivElement>(null);
  const totalPriceRef = useRef<HTMLSpanElement>(null);

  // Direct DOM state (scattered!)
  const directDOMState = useRef({
    items: [] as Product[],
    count: 0,
    total: 0,
  });

  const addToCartDirectDOM = (product: Product) => {
    // Update scattered state
    directDOMState.current.items.push(product);
    directDOMState.current.count += 1;
    directDOMState.current.total += product.price;

    // MANUAL SYNC
    if (headerCountRef.current) {
      headerCountRef.current.textContent =
        directDOMState.current.count.toString();
      headerCountRef.current.classList.add("animate-pulse");
      setTimeout(() => {
        headerCountRef.current?.classList.remove("animate-pulse");
      }, 500);
    }

    if (sidebarCountRef.current) {
      sidebarCountRef.current.textContent =
        directDOMState.current.count.toString();
      sidebarCountRef.current.classList.add("animate-bounce");
      setTimeout(() => {
        sidebarCountRef.current?.classList.remove("animate-bounce");
      }, 500);
    }

    if (footerCountRef.current) {
      footerCountRef.current.textContent =
        directDOMState.current.count.toString();
    }

    if (totalPriceRef.current) {
      totalPriceRef.current.textContent = `$${directDOMState.current.total.toFixed(
        2
      )}`;
    }

    // Update cart list
    if (cartListRef.current) {
      const itemDiv = document.createElement("div");
      itemDiv.className =
        "flex justify-between items-center p-2 bg-gray-50 rounded mb-2";
      itemDiv.innerHTML = `
        <span>${product.name}</span>
        <span class="font-semibold">$${product.price.toFixed(2)}</span>
      `;
      cartListRef.current.appendChild(itemDiv);
    }
  };

  const clearDirectDOM = () => {
    directDOMState.current = { items: [], count: 0, total: 0 };

    // 😱 ANOTHER NIGHTMARE - Must clear ALL locations manually!
    [headerCountRef, sidebarCountRef, footerCountRef].forEach((ref) => {
      if (ref.current) ref.current.textContent = "0";
    });

    if (totalPriceRef.current) totalPriceRef.current.textContent = "$0.00";
    if (cartListRef.current) cartListRef.current.innerHTML = "";
  };

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
                  onClick={() => addToCartDirectDOM(product)}
                  className="w-full bg-red-500 hover:bg-red-600 text-white text-xs py-1 px-2 rounded transition-colors"
                >
                  Add (Direct DOM)
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Cart */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-red-800">
              🔴 Direct DOM Approach
            </h3>
            <button
              onClick={clearDirectDOM}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
            >
              Clear Cart
            </button>
          </div>
        </div>
      </div>
      {/* Header */}
      <div className="bg-red-100 p-3 rounded mb-3">
        <div className="flex justify-between items-center">
          <span className="font-semibold">🏪 Header Navigation</span>
          <div className="bg-red-600 text-white px-2 py-1 rounded-full text-sm">
            Cart (
            <span ref={headerCountRef} className="font-bold">
              0
            </span>
            )
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="bg-red-100 p-3 rounded mb-3">
        <div className="font-semibold mb-2">📋 Sidebar Menu</div>
        <div className="text-sm">
          🛒 Shopping Cart:{" "}
          <span ref={sidebarCountRef} className="font-bold">
            0
          </span>{" "}
          items
        </div>
      </div>

      {/* Cart Content */}
      <div className="bg-red-100 p-3 rounded mb-3">
        <div className="font-semibold mb-2">📦 Cart Contents</div>
        <div ref={cartListRef} className="min-h-[100px] text-sm">
          <div className="text-gray-500 italic">Cart is empty</div>
        </div>
        <div className="font-bold text-right">
          Total: <span ref={totalPriceRef}>$0.00</span>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-red-100 p-3 rounded">
        <div className="text-center text-sm">
          🦶 Footer: Items in cart:{" "}
          <span ref={footerCountRef} className="font-bold">
            0
          </span>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCartDOM;