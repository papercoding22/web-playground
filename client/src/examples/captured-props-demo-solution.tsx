import React, { useState } from "react";

// Card UI
function CartMessage({ message }: { message: string }) {
  return (
    <div
      style={{
        backgroundColor: "#f1f1f1",
        border: "1px solid #ccc",
        padding: "10px",
        marginTop: "10px",
        borderRadius: "8px",
      }}
    >
      🛒 {message}
    </div>
  );
}

interface ProductProps {
  product: string;
  onAdd: (message: string) => void;
}

// Function Component
function ProductFunction({ product, onAdd }: ProductProps) {
  const handleClick = () => {
    setTimeout(() => {
      onAdd(`(Function) Added "${product}" to cart!`);
    }, 3000);
  };

  return (
    <div style={{ border: "1px solid blue", padding: "10px", margin: "10px" }}>
      <h3>Function Product: {product}</h3>
      <button onClick={handleClick}>Add to Cart</button>
    </div>
  );
}

// Class Component
class ProductClass extends React.Component<ProductProps> {
  render() {
    const props = this.props;

    const handleClick = () => {
      setTimeout(() => {
        this.props.onAdd(`(Class) Added "${props.product}" to cart!`);
      }, 3000);
    };

    return (
      <div
        style={{ border: "1px solid green", padding: "10px", margin: "10px" }}
      >
        <h3>Class Product: {this.props.product}</h3>
        <button onClick={handleClick}>Add to Cart</button>
      </div>
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

// App Component
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

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
      <h2>🛒 Product Page</h2>
      <button onClick={changeProduct}>🔄 Switch Product</button>
      <ProductFunction product={product} onAdd={handleAddToCart} />
      <ProductClass product={product} onAdd={handleAddToCart} />
      <p>
        👆 Click “Add to Cart”, then “Switch Product” before 3s. Function comp
        shows stale, class comp shows latest.
      </p>
      {messages.map((msg, index) => (
        <CartMessage key={index} message={msg} />
      ))}
    </div>
  );
}

export default CapturedPropsChangeSolution;
