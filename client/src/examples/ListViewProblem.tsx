import React, { useState } from "react";

// Type definitions
interface CardProps {
  children: React.ReactNode;
  className?: string;
}

interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: "primary" | "secondary" | "warning" | "success" | "toggle";
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
}

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "error" | "active" | "inactive";
  className?: string;
}

interface AlertProps {
  children: React.ReactNode;
  variant?: "error" | "warning" | "success" | "info";
  className?: string;
}

type Item = {
  id: number;
  name: string;
  active: boolean;
};

type ListItemProps = {
  item: Item;
  onToggle: (id: number) => void;
};

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
  size = "md",
  className = "",
  disabled = false,
}) => {
  const variants = {
    primary: "bg-blue-500 hover:bg-blue-600 text-white",
    secondary: "bg-gray-500 hover:bg-gray-600 text-white",
    warning: "bg-orange-500 hover:bg-orange-600 text-white",
    success: "bg-green-500 hover:bg-green-600 text-white",
    toggle: "bg-purple-500 hover:bg-purple-600 text-white",
  };

  const sizes = {
    sm: "px-2 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
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
    active: "bg-green-100 text-green-800",
    inactive: "bg-gray-100 text-gray-600",
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${variants[variant]} ${className}`}
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
    info: "bg-blue-50 border-blue-200 text-blue-800",
  };

  return (
    <div
      className={`border-l-4 p-4 rounded-r-lg ${variants[variant]} ${className}`}
    >
      {children}
    </div>
  );
};

// Enhanced ListItem Component
const ListItem: React.FC<ListItemProps> = ({ item, onToggle }) => {
  console.log(`Rendering Item: ${item.id}`);

  return (
    <div
      className={`p-4 border-l-4 rounded-lg transition-all duration-200 ${
        item.active
          ? "bg-green-50 border-green-200 hover:bg-green-100"
          : "bg-gray-50 border-gray-200 hover:bg-gray-100"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div
            className={`w-3 h-3 rounded-full ${
              item.active ? "bg-green-400" : "bg-gray-300"
            }`}
          />
          <div>
            <h3 className="font-medium text-gray-900">{item.name}</h3>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant={item.active ? "active" : "inactive"}>
                {item.active ? "✅ Active" : "⏸️ Inactive"}
              </Badge>
              <span className="text-xs text-gray-500">ID: {item.id}</span>
            </div>
          </div>
        </div>
        <Button
          onClick={() => onToggle(item.id)}
          variant="toggle"
          size="sm"
          className="min-w-20"
        >
          {item.active ? "Deactivate" : "Activate"}
        </Button>
      </div>
    </div>
  );
};

// Enhanced ListView Component
const ListView: React.FC = () => {
  const [items, setItems] = useState<Item[]>([
    { id: 1, name: "User Management", active: false },
    { id: 2, name: "Data Analytics", active: true },
    { id: 3, name: "Email Notifications", active: false },
    { id: 4, name: "File Storage", active: true },
    { id: 5, name: "API Access", active: false },
  ]);

  const [renderCount, setRenderCount] = useState<number>(0);

  const handleToggle = (id: number) => {
    setRenderCount((prev) => prev + 1);
    const updatedItems = items.map((item) =>
      item.id === id ? { ...item, active: !item.active } : item
    );
    setItems(updatedItems);
  };

  const handleAddItem = () => {
    const newItem: Item = {
      id: Math.max(...items.map((i) => i.id)) + 1,
      name: `New Feature ${items.length + 1}`,
      active: false,
    };
    setItems((prev) => [...prev, newItem]);
  };

  const handleRemoveItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const activeCount = items.filter((item) => item.active).length;
  const totalCount = items.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🎛️ Feature Toggle Dashboard
          </h1>
          <p className="text-gray-600">
            Manage your application features with re-render tracking
          </p>
        </div>

        {/* Re-render Warning Badge */}
        <div className="text-center">
          <Badge variant="warning" className="text-base px-4 py-2">
            ⚠️ Every Toggle Re-renders All Items
          </Badge>
        </div>

        {/* Statistics Card */}
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div className="space-y-1">
              <p className="text-2xl font-bold text-green-600">{activeCount}</p>
              <p className="text-sm text-gray-600">Active Features</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-gray-600">
                {totalCount - activeCount}
              </p>
              <p className="text-sm text-gray-600">Inactive Features</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-blue-600">{totalCount}</p>
              <p className="text-sm text-gray-600">Total Features</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-purple-600">
                {renderCount}
              </p>
              <p className="text-sm text-gray-600">Toggle Actions</p>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <Card>
          <div className="flex gap-4 justify-center">
            <Button onClick={handleAddItem} variant="success">
              ➕ Add Feature
            </Button>
            <Button onClick={() => setRenderCount(0)} variant="secondary">
              🔄 Reset Counter
            </Button>
          </div>
        </Card>

        {/* Performance Alert */}
        <Alert variant="warning">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-lg">🐌</span>
              <span className="font-semibold">Performance Issue</span>
            </div>
            <p className="text-sm">
              Every toggle re-renders ALL items because the handleToggle
              function is recreated on each render. Check the console to see all
              items re-rendering on every toggle action.
            </p>
          </div>
        </Alert>

        {/* Items List */}
        <Card>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">
                Features List
              </h2>
              <Badge variant="default">{totalCount} items</Badge>
            </div>

            {items.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No features available. Add some features to get started!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="relative group">
                    <ListItem item={item} onToggle={handleToggle} />
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-red-500 hover:text-red-700 text-sm"
                      title="Remove item"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Developer Console Alert */}
        <Alert variant="info">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-lg">🔍</span>
              <span className="font-semibold">Developer Tip</span>
            </div>
            <p className="text-sm">
              Open your browser's developer console (F12) to see the console.log
              output. Notice how all items re-render when you toggle any single
              item!
            </p>
          </div>
        </Alert>

        {/* Educational Content */}
        <Card className="bg-purple-50 border-purple-200">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <span className="text-xl">🎓</span>
              <h3 className="text-lg font-semibold text-purple-800">
                What's Happening?
              </h3>
            </div>
            <div className="text-sm text-purple-700 space-y-2">
              <p>
                <strong>The Problem:</strong> handleToggle function is recreated
                on every render
              </p>
              <p>
                <strong>The Impact:</strong> All ListItem components re-render
                because they receive a "new" function
              </p>
              <p>
                <strong>Performance Cost:</strong> With many items, this causes
                unnecessary re-renders and performance issues
              </p>
              <p>
                <strong>Solution Preview:</strong> useCallback hook can memoize
                the function to prevent this issue
              </p>
            </div>
          </div>
        </Card>

        {/* Status Footer */}
        <div className="text-center">
          <div className="flex justify-center space-x-4">
            <Badge variant="warning">Unnecessary Re-renders Active</Badge>
            <Badge variant="default">{renderCount} Toggles Performed</Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListView;
