import { useEffect, useState } from 'react'
import {Link} from 'react-router-dom'

import PostCard from '../components/PostCard'

export default function Home() {
  const [posts, setPosts] = useState([]);
  console.log(posts);
  useEffect(()=>{
    const fetchPosts = async()=>{
      try {
        const res = await fetch(`/api/post/fetch`);
        const data = await res. json();

        setPosts(data.fetchedPosts)
      } catch (error) {
        console.error('Could not fetch posts at fetchPosts() at Home.jsx: ', error.message);
      }
    }

    fetchPosts();
  }, []);
  return (
    <div>
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-3xl lg:text-6xl font-bold">Welcome to my Blog</h1>
        <p className="text-gray-500 text-xs sm:text-sm">
          Here you'll find a variety of articles and tutorials on topics such as web development, software engineering, and programming languages.
        </p>
        <Link to='/search' className="text-xs sm:text-sm text-teal-500 font-bold hover:underline">
          View all posts
        </Link>
      </div>

      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7'>
        {posts && posts.length > 0 && (
          <div className='flex flex-col gap-6'>
            <h2 className='font-semibold text-center text-2xl'>Recent Posts</h2>
            <div className='flex flex-wrap gap-4'>
              {posts.map((post)=>(
                <PostCard key={post._id} post = {post} />
              ))}
            </div>
            <p className='text-lg text-center text-teal-500 hover:underline hover:cursor-pointer'>View all posts</p>
          </div>
        )}
      </div>
    </div>
  )
}
