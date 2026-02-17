import { Button, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Modal, ModalBody, ModalHeader  } from "flowbite-react";
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { useSelector } from "react-redux";
import {format} from 'date-fns'
import {data, Link} from 'react-router-dom'
import { HiOutlineExclamationCircle } from "react-icons/hi";
import {FaCheck, FaTimes} from 'react-icons/fa';


export default function DashboardComments() {
    const {currentUser} = useSelector((state)=>(state.user));

    const [comments, setComments] = useState([]);
    const [showMore, setShowMore] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [commentIdToDelete, setCommentIdToDelete] = useState(null);

    useEffect(()=>{
        const fetchUsers = async ()=>{
            try {
                const res = await fetch(`/api/comment/fetch`);

                const data = await res.json();

                if(res.ok){
                    //from backend an object with {comments, totalComments, commentsOneMonthAgo} are sent in the res
                    //so specify fetchedUsers otherwise it will remain an object and .length will show 0 or undefined
                    setComments(data.comments);
                    if(data.comments.length < 9){
                        setShowMore(false);
                    }
                }else{
                    toast.error('Internal server error!')
                    console.log('Error given from server: ', data.message);
                }
            } catch (error) {
                toast.error("Failed to fetch comments!");
                console.log('Error fetching comments at DashboardComments.jsx: ', error.message);
            }
        }

        if(currentUser.isAdmin){
            fetchUsers();
        }
    }, [currentUser._id])

    const handleShowMore = async ()=>{
        //set the startIndex from the length of current userPosts state, because it has all the fetched posts till now
        const startIndex = comments.length;
        try {
            //use current startIndex to fetch from that index
            const res = await fetch(`/api/comment/fetch?startIndex=${startIndex}`);

            const data = await res.json();

            if(res.ok){
                //add newly fetched comments inside comments state
                setComments((prev)=>([...prev, ...data.comments]));
                if(data.comments.length < 9){
                    setShowMore(false);
                }
            }else{
                toast.error('Error fetching more comments!')
                console.error('Error from server at handleShowMore function at DashboardComments.jsx: ', data.message);
            }
        } catch (error) {
            toast.error('Error fetching more comments!');
            console.log('Error at handleShowMore function for show more button: ', error.message)
        }
    }

    const handleCommentDelete = async()=>{
        setOpenModal(false);
        try {
            const res = await fetch(`/api/comment/delete/${commentIdToDelete}`, {
                method: 'DELETE'
            })

            const data = await res.json();

            if(res.ok){
                //remove the comment from the screen as well
                setComments((prev)=>
                    prev.filter((comment)=>(comment._id !== commentIdToDelete))
                );
                toast.success('Comment deleted successfully!');
            }else{
                toast.error('Error deleting comment!');
                console.error('Error from server for deleting comment at handleCommnentDelete function inside DashboardComments.jsx: ', data.message)
            }
        } catch (error) {
            toast.error('Error deleting comment!');
            console.error('Error deleting comment at catch at handleCommentDelete function at DashboardComments.jsx: ', error.message)
        }
    }
  return (
    <div className="table-auto overflow-x-auto md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 scrollbar-thumb-slate-500">
      {currentUser.isAdmin && comments.length > 0 ? 
      (<>
        <Table>
            <TableHead>
                <TableHeadCell>
                    Date Updated
                </TableHeadCell>
                <TableHeadCell>
                    Content
                </TableHeadCell>
                <TableHeadCell>
                    Likes
                </TableHeadCell>
                <TableHeadCell>
                    Post ID
                </TableHeadCell>
                <TableHeadCell>
                    User ID
                </TableHeadCell>
                <TableHeadCell>
                    Delete
                </TableHeadCell>
            </TableHead>
            {comments.map((comment)=>(
                <TableBody className="divide-y" key={comment._id}>
                    <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                        <TableCell>
                            {format(comment.updatedAt, "yyyy/MM/dd")}
                        </TableCell>
                        <TableCell>
                            <Link className="font-medium text-gray-900 dark:text-white" >
                                {comment.content}
                            </Link>
                        </TableCell>
                        <TableCell>
                            <Link className="font-medium text-gray-900 dark:text-white" >
                                {comment.numberOfLikes}
                            </Link>
                        </TableCell>
                        <TableCell>
                            <Link className="font-medium text-gray-900 dark:text-white" >
                                {comment.postId}
                            </Link>
                        </TableCell>
                        <TableCell>
                            <Link className="font-medium text-gray-900 dark:text-white" >
                                {comment.userId}
                            </Link>
                        </TableCell>
                        <TableCell>
                            <span onClick={()=>{
                                setOpenModal(true);
                                setCommentIdToDelete(comment._id);
                            }} className="text-red-500 font-medium hover:underline cursor-pointer">Delete</span>
                        </TableCell>
                    </TableRow>
                </TableBody>
            ))}
        </Table>
        {showMore && (
            <button onClick={handleShowMore} className="w-full self-center text-sm text-teal-500 py-7 hover:underline cursor-pointer">
                Show More
            </button>
        )}
      </>)
      : 
      (<p>No Users!</p>)}
      <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
        <ModalHeader />
        <ModalBody>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this comment?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="red" onClick={() => handleCommentDelete()}>
                Yes, I'm sure
              </Button>
              <Button color="alternative" onClick={() => setOpenModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </div>
  )
}
