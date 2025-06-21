import React, { useState, useCallback, memo } from "react";

type Item = {
  id: number;
  name: string;
  active: boolean;
};

type ListItemProps = {
  item: Item;
  onToggle: (id: number) => void;
};

const ListItem: React.FC<ListItemProps> = memo(({ item, onToggle }) => {
  console.log(`Rendering Item: ${item.id}`);
  return (
    <div>
      <span>
        {item.name} - {item.active ? "Active" : "Inactive"}
      </span>
      <button onClick={() => onToggle(item.id)}>Toggle</button>
    </div>
  );
});

const ListView: React.FC = () => {
  const [items, setItems] = useState<Item[]>([
    { id: 1, name: "Item 1", active: false },
    { id: 2, name: "Item 2", active: true },
    { id: 3, name: "Item 3", active: false },
  ]);

  const handleToggle = useCallback((id: number) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, active: !item.active } : item
      )
    );
  }, []);

  return (
    <div>
      {items.map((item) => (
        <ListItem key={item.id} item={item} onToggle={handleToggle} />
      ))}
    </div>
  );
};

export default ListView;
