import React from 'react';

const list = ({ items, deleteItem }) => {
  console.log('Rendering the items...');
  return (
    <ul>
      {items.map(todo => (
        <li key={todo.id} onClick={() => deleteItem(todo.id)}>
          {todo.name}
        </li>
      ))}
    </ul>
  );
};

export default list;
