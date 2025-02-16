import React from 'react';
import { Link } from 'astro/router';

const PostCard = ({ post }) => {
  return (
    <div>
      <h2>{post.title}</h2>
      <p>{post.description}</p>
      <Link href={`/posts/${post.slug}`}>Read More</Link>
    </div>
  );
};

export default PostCard;