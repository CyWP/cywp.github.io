import React from 'react';

const TopBar = ({ categories, setSelectedCategory }) => {
  return (
    <nav>
      <button onClick={() => setSelectedCategory(null)}>All</button>
      {categories.map(category => (
        <button key={category} onClick={() => setSelectedCategory(category)}>
          {category}
        </button>
      ))}
    </nav>
  );
};

export default TopBar;