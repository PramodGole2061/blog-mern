import { Button, Textarea } from 'flowbite-react';
import { useEffect, useState } from 'react';
import {useSelector} from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {toast} from 'react-hot-toast'

import Comment from './Comment';

export default function CommentSection({postId}) {
  const {currentUser} = useSelector((state)=>(state.user));
  const navigate = useNavigate();

  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  console.log(comments);

  useEffect(()=>{
    const fetchComments = async ()=>{
      try {
        const res = await fetch(`/api/comment/fetch/${postId}`);
        const data = await res.json();

        if(res.ok){
          // for auto update on comment section
          setComments('');
          setComments(...comments, data);
        }
      } catch (error) {
        console.error('Error fetching comments at CommentSection.jsx: ', error);
      }
    }

    fetchComments();
  }, [postId])

  const handleLikes = async (commentId)=>{
    if(!currentUser){
      return navigate('/signin');
    }

    try {
      const res = await fetch(`/api/comment/like/${commentId}`, {
        method: 'PUT'
      })

      const data = await res.json();

      if(res.ok){
        //go through all the comments
        setComments((prev)=>prev.map((comment)=>
        comment._id === commentId ? {
          ...comment, likes: data.likes, numberOfLikes: data.numberOfLikes
        } : comment
        ))
      }else{
        console.error('Error at handleLikes() at CommentSection.jsx: ', data.message);
      }
        
    } catch (error) {
      console.error('Error at handleLikes() at CommentSection.jsx: ', error);
    }
  }

  const handleSubmit = async (e)=>{
    e.preventDefault();
    if(comment.length > 200){
      return;
    }
    
    try {
      setLoading(true);

      const res = await fetch('/api/comment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({content: comment, postId: postId, userId: currentUser._id})
      })

      const data = await res.json();

      if(res.ok){
        toast.success('Comment saved successfully!');
        setComment('');
      }
    } catch (error) {
      toast.error('Error saving the comment!');
      console.log('Error saving te comment: ', error)
    }finally{
      setComment('');
      setLoading(false);
    }
  }

  return (
    <div className='w-full max-w-2xl mx-auto p-3'>
      {/* create comment section */}
      {currentUser ? (
        <div className='flex gap-1 items-center my-5 text-sm text-gray-500'>
            <p>Signed in as: </p>
            <img className='w-5 h-5 rounded-full object-cover' src={currentUser.profilePicture} alt='Profile Image'/>
            <Link to='/dashboard?tab=profile' className='text-xs text-teal-500 hover:cursor-pointer hover:underline'>
                @{currentUser.name}
            </Link>
        </div>
      ) : (
      <div className='flex gap-1 text-sm items-center'>
        You must be signed in!
        <Link className='text-xs text-cyan-500 hover:underline' to='/signin'>Sign In</Link>
      </div>)}

      {currentUser && (
        <form onSubmit={handleSubmit} className='flex flex-col border border-teal-200 rounded-tl-2xl rounded-br-2xl p-3'>
          <Textarea onChange={(e)=>(setComment(e.target.value))} value={comment} placeholder='Write your comment...' rows={3} maxLength={200} required/>
          <div className='flex justify-between mt-5 items-center'>
            <p className='text-xs text-gray-500'>
              {200 - comment.length} characters remaining!</p>
            <Button type='submit' outline color='cyan'>{loading ? 'Submitting...' : 'Submit'}</Button>
          </div>
        </form>
      )}

      {/* Show comments */}
      {comments.length === 0 ? (
        <div className='border border-gray-300 rounded-sm my-5 p-3 items-center'>
          <p className='text-sm text-gray-500'>No comments yet.</p>
        </div>) : 
        (<div className='border border-gray-300 rounded-sm my-5 p-3 items-center'>
          <div className='flex gap-1'>
            <p className='text-xm text-gray-500'>Comments</p>
            <div className='border border-gray-400 py-1 px-2 rounded-sm'><p>{comments.length}</p></div>
          </div>
          {comments.map((comment)=>(
            <Comment key={comment._id} comment = {comment} handleLikes={handleLikes} />
          ))}
        </div>)}
    </div>
  )
}
