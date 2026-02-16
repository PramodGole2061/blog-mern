import { useEffect, useState } from "react"
import {formatDistanceToNow} from 'date-fns';
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Textarea, Button } from "flowbite-react";
import {toast} from 'react-hot-toast'

export default function Comment({comment, handleLikes, onEdit}) {
    const [userInfo, setUserInfo] = useState({});
    const {currentUser} = useSelector((state)=>(state.user));

    const [isEditing, setIsEditing] = useState(false);
    const [editedComment, setEditedComment] = useState(comment.content);

    // to get user info
    useEffect(()=>{
        const fetchUser = async ()=>{
            try {
                const res = await fetch(`/api/user/${comment.userId}`);
                const data = await res.json();

                if(res.ok){
                    setUserInfo(data);
                }else{
                    console.error('Error from server while fetching user info for a comment at fetchUser() at Comment.jsx: ', data.message);
                }
            } catch (error) {
                console.error('Error fetching user info at fetchUser function at Comment.jsx: ', error);
            }
        }

        fetchUser();
    },[comment])

    const handleCommentEdit = ()=>{
        setIsEditing(true);
    }

    const handleSave = async (e)=>{
        e.preventDefault();
        try {
            const res = await fetch(`/api/comment/edit/${comment._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({content: editedComment})
            })

            const data = await res.json();

            if(res.ok){
                setIsEditing(false);
                onEdit(comment, editedComment);
                toast.success('Comment edited successfully!');
            }else{
                console.error('Error from server at handleSave() at Comment.jsx: ', data.message);
                toast.error('Could not save the comment!');
            }
        } catch (error) {
            console.error('Error saving an edited comment at handleSave() at Comment.jsx: ', error.message);
            toast.error('Could not save the comment!');
        }
    }

  return (
    <div className="border-b items-center p-4 mb-2 ">
    <div className="flex gap-1">
      <div className="shrink-0 mr-2" >
        <img className="w-10 h-10 border rounded-full object-cover bg-gray-200" 
        src={userInfo.profilePicture} 
        alt={userInfo.name} 
        />
      </div>
      <div className="flex">
        {/* truncate: if name is too long it will truncate it */}
        <span className="text-xs font-bold mr-1 truncate">@{userInfo ? userInfo.name : 'Anonymous User'}</span>
        <span className="text-xs text-gray-500">{formatDistanceToNow(new Date(comment.createdAt), { includeSeconds: true })}</span>
        </div>
    </div>
    {/* check state of isEditing */}
    {isEditing ? (
        <form onSubmit={handleSave} className='mt-3 flex flex-col border border-teal-200 rounded-tl-2xl rounded-br-2xl p-3'>
            <Textarea onChange={(e)=>(setEditedComment(e.target.value))} value={editedComment} maxLength={200} required/>
            <div className='flex justify-between mt-5 items-center'>
            <p className='text-xs text-gray-500'>
                {200 - editedComment.length} characters remaining!
            </p>
            <div className="flex justify-end gap-2">
                <Button type='submit' size="xs" color='cyan'>Save</Button>
                <Button type = 'button' size="xs" color='gray' onClick={()=>setIsEditing(false)} outline>Cancel</Button>
            </div>
            </div>
        </form>
    ) : (
        <>
        <p className="text-xs text-gray-500 mt-2">{comment.content}</p>
        <div className="mt-2 flex gap-2 items-center">
            <button onClick={()=>(handleLikes(comment._id))} type="button" className={`text-sm text-gray-400 hover:text-blue-500 hover:cursor-pointer ${currentUser && comment.likes.includes(currentUser._id) && 'text-blue-500!'} `}>
                <FaThumbsUp  />
            </button>
            <p className="text-xs text-gray-500">{(comment.numberOfLikes + ' ' + (comment.numberOfLikes>1 ? 'Likes': 'Like'))}</p>
            {currentUser && (currentUser._id === comment.userId || currentUser.isAdmin) && (
                <button onClick={()=>handleCommentEdit()} className="text-xs text-gray-400 hover:text-blue-500 hover:cursor-pointer">Edit</button>
            )}
        </div>
        </>
    )}
    </div>
  )
}
