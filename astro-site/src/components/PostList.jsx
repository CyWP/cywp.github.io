import React from 'react';
import PostCard from './PostCard.jsx';

const PostList = ({ posts, selectedCategory }) => {
  const filteredPosts = selectedCategory
    ? posts.filter(post => post.category === selectedCategory)
    : posts;

  return (
    <div>
      {filteredPosts.map(post => (
        <PostCard key={post.slug} post={post} />
      ))}
    </div>
  );
};

export default PostList;