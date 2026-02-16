import { useEffect, useState } from "react"
import {formatDistanceToNow} from 'date-fns';
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";

export default function Comment({comment, handleLikes}) {
    const [userInfo, setUserInfo] = useState({});
    const {currentUser} = useSelector((state)=>(state.user));

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
    <p className="text-xs text-gray-500 mt-2">{comment.content}</p>
    <div className="mt-2 flex gap-2 items-center">
        <button onClick={()=>(handleLikes(comment._id))} type="button" className={`text-sm text-gray-400 hover:text-blue-500 hover:cursor-pointer ${currentUser && comment.likes.includes(currentUser._id) && 'text-blue-500!'} `}>
            <FaThumbsUp  />
        </button>
        <p className="text-xs text-gray-500">{(comment.numberOfLikes + ' ' + (comment.numberOfLikes>1 ? 'Likes': 'Like'))}</p>
    </div>
    </div>
  )
}
