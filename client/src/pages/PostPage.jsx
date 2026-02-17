import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import {Button, Spinner} from 'flowbite-react'
import { format } from "date-fns";

import CommentSection from "../components/CommentSection";
import PostCard from "../components/PostCard";

export default function PostPage() {
    const {postSlug} = useParams(); //<Route path="/post/:postSlug" element={<PostPage />} /> from App.jsx

    const [post, setPost] = useState(null); //null for object and [] for arrays
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [recentPosts, setRecentPosts] = useState([]);
    console.log({recentPosts});
    useEffect(()=>{
        const fetchPost = async ()=>{
            setLoading(true);

            try {
                const res = await fetch(`/api/post/fetch?slug=${postSlug}`)
                const data = await res.json();

                if(res.ok){
                    setPost(data.fetchedPosts[0]);
                    setError(null);
                }else{
                    setError(data.message || 'Network error!');
                }
            } catch (error) {
                setError('Error showing the post!');
                console.error("Error showing a post at PostPaga.jsx, ", error)
            }finally{
                setLoading(false);
            }
        }

        fetchPost();
    }, [postSlug])

    useEffect(()=>{
        const fetchRecentPosts = async ()=>{
            try {
                const res = await fetch(`/api/post/fetch?limit=3`);
                const data = await res.json();
                if(res.ok){
                    setRecentPosts(data.fetchedPosts);
                }
            } catch (error) {
                console.log('error fetching recent articles at PostPage.jsx: ', error.message);
                toast.error('Could not fetch recent posts!');
            }
        }

        fetchRecentPosts();
    }, [])// run just once

    
    // {loading && (<div>Loading...</div>)} it won't work here
    //the reason loading is here is because, only loading will be visible if it's true
    if(loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <Spinner size="xl" />
        </div>
    )
  return (
    <main className="min-h-screen max-w-6xl p-3 flex flex-col mx-auto">
      <h1 className="max-w-2xl text-3xl font-serif text-center mt-10 mx-auto lg:text-4xl">{post && (post.title)}</h1>
      <Link to={`/search?category=${post && post.category}`} className="self-center mt-5">
        <Button color='gray' size="xs" className="hover:cursor-pointer">{post && post.category}</Button>
      </Link>
      <img src={post && post.image} alt={post && post.title} className="max-h-600px w-full object-cover mt-8 self-center p-3"/>
      <div className="w-full max-w-2xl mx-auto flex justify-between p-3 border-b border-slate-500 text-xs">
        <span>{post && format(post.createdAt,'yyyy/MM/dd')}</span>
        {/* assuming per thousand character takes 1 minute to read and setting the decimal to 0 or no decimals*/}
        <span className="italic">{post && (post.content.length/1000).toFixed(0)} min read</span>
      </div>
      {/* post-content is custom css on index.css */}
      {/* prose is from tailwindcss typography which containes ready made css for html contents */}
      <div className="w-full max-w-2xl p-2 mx-auto post-content prose dark:prose-invert lg:prose-xl" dangerouslySetInnerHTML={{__html: post && post.content}}>

      </div>

      <CommentSection postId = {post && post._id} />
      <div className="mb-5 flex flex-col justify-center items-center">
        <h1 className="text-xl">Recent Articles</h1>
        <div className="flex flex-wrap gap-2 justify-center mt-5">
            {recentPosts && recentPosts.map((post)=>
            <PostCard key={post._id} post={post} />
            )}
        </div>
      </div>
    </main>
  )
}
