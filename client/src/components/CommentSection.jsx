import { Button, Textarea } from 'flowbite-react';
import { useState } from 'react';
import {useSelector} from 'react-redux';
import { Link } from 'react-router-dom';
import {toast} from 'react-hot-toast'

export default function CommentSection({postId}) {
  const {currentUser} = useSelector((state)=>(state.user));

  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

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

  // console.log({postId})
  return (
    <div className='w-full max-w-2xl mx-auto p-3'>
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
    </div>
  )
}
