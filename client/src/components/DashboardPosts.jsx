import { Button, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Modal, ModalBody, ModalHeader  } from "flowbite-react";
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { useSelector } from "react-redux";
import {format} from 'date-fns'
import {data, Link} from 'react-router-dom'
import { HiOutlineExclamationCircle } from "react-icons/hi";


export default function DashboardPosts() {
    const {currentUser} = useSelector((state)=>(state.user));

    const [userPosts, setUserPosts] = useState([]);
    // console.log(userPosts)
    const [showMore, setShowMore] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [postIdToDelete, setPostIdToDelete] = useState(null);

    useEffect(()=>{
        const fetchPosts = async ()=>{
            try {
                const res = await fetch(`/api/post/fetch?userId=${currentUser._id}`);

                const data = await res.json();

                if(res.ok){
                    //from backend an object with fetchedPosts, totalPosts and lastMonthPosts are sent in the res
                    //so specify fetchedPosts otherwise it will remain an object and .length will show 0 or u
                    setUserPosts(data.fetchedPosts);
                    if(data.fetchedPosts.length < 9){
                        setShowMore(false);
                    }
                }else{
                    toast.error('Internal server error!')
                    console.log('Error given from server: ', data.message);
                }
            } catch (error) {
                toast.error("Failed to fetch posts!");
                console.log('Error fetching posts at DashboardPosts.jsx: ', error);
            }
        }

        if(currentUser.isAdmin){
            fetchPosts();
        }
    }, [currentUser._id])

    const handleShowMore = async ()=>{
        //set the startIndex from the length of current userPosts state, because it has all the fetched posts till now
        const startIndex = userPosts.length;
        try {
            //use current startIndex to fetch from that index
            const res = await fetch(`/api/post/fetch?${currentUser._id}&startIndex=${startIndex}`);

            const data = await res.json();

            if(res.ok){
                //add newly fetched posts inside userPosts state
                setUserPosts((prev)=>([...prev, ...data.fetchedPosts]));
                if(data.fetchedPosts.length < 9){
                    setShowMore(false);
                }
            }else{
                toast.error('Error fetching more posts!')
                console.error('Error from server at handleShowMore function at DashboardPosts.jsx: ', data.message);
            }
        } catch (error) {
            toast.error('Error fetching more posts!');
            console.log('Error at handleShowMore function for show more button: ', error)
        }
    }

    const handlePostDelete = async()=>{
        setOpenModal(false);
        try {
            const res = await fetch(`/api/post/delete/${postIdToDelete}/${currentUser._id}`, {
                method: 'DELETE'
            })

            const data = await res.json();

            if(res.ok){
                //remove the post from the screen as well
                setUserPosts((prev)=>
                    prev.filter((post)=>(post._id !== postIdToDelete))
                );
                toast.success('Post deleted successfully!');
            }else{
                toast.error('Error deleting post1!');
                console.error('Error from server for deleting post at handlePostDelete function inside DashboardPosts.jsx: ', data.message)
            }
        } catch (error) {
            toast.error('Error deleting post!');
            console.error('Error deleting post at catch at handlePostDelete function at DashboardPosts.jsx: ', error)
        }
    }
  return (
    <div className="table-auto overflow-x-auto md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 scrollbar-thumb-slate-500">
      {currentUser.isAdmin && userPosts.length > 0 ? 
      (<>
        <Table>
            <TableHead>
                <TableHeadCell>
                    Date updated
                </TableHeadCell>
                <TableHeadCell>
                    Image
                </TableHeadCell>
                <TableHeadCell>
                    Title
                </TableHeadCell>
                <TableHeadCell>
                    Category
                </TableHeadCell>
                <TableHeadCell>
                    Delete
                </TableHeadCell>
                <TableHeadCell>
                    <span>Edit</span>
                </TableHeadCell>
            </TableHead>
            {userPosts.map((post)=>(
                <TableBody className="divide-y" key={post._id}>
                    <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                        <TableCell>
                            {format(post.updatedAt, "yyyy/MM/dd")}
                        </TableCell>
                        <TableCell>
                            <Link to={`/post/${post.slug}`} >
                                <img src={post.image} className="w-20 h-10 object-cover bg-gray-500" />
                            </Link>
                        </TableCell>
                        <TableCell>
                            <Link className="font-medium text-gray-900 dark:text-white" to={`/post/${post.slug}`}>
                                {post.title}
                            </Link>
                        </TableCell>
                        <TableCell>
                            {post.category}
                        </TableCell>
                        <TableCell>
                            <span onClick={()=>{
                                setOpenModal(true);
                                setPostIdToDelete(post._id);
                            }} className="text-red-500 font-medium hover:underline cursor-pointer">Delete</span>
                        </TableCell>
                        <TableCell>
                            <Link to={`/update-post/${post._id}`}>
                                <span className="text-teal-500 hover:underline cursor-pointer">Edit</span>
                            </Link>
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
      (<p>No posts</p>)}
      <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
        <ModalHeader />
        <ModalBody>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this post?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="red" onClick={() => handlePostDelete()}>
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
