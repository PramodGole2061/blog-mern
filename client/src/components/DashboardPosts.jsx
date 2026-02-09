import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "flowbite-react";
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { useSelector } from "react-redux";
import {format} from 'date-fns'
import {Link} from 'react-router-dom'

export default function DashboardPosts() {
    const {currentUser} = useSelector((state)=>(state.user));

    const [userPosts, setUserPosts] = useState([]);
    console.log(userPosts)

    useEffect(()=>{
        const fetchPosts = async ()=>{
            try {
                const res = await fetch(`/api/post/fetch?userId=${currentUser._id}`);

                const data = await res.json();

                if(res.ok){
                    //from backend an object with fetchedPosts, totalPosts and lastMonthPosts are sent in the res
                    //so specify fetchedPosts otherwise it will remain an object and .length will show 0 or u
                    setUserPosts(data.fetchedPosts);
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
                <TableBody className="divide-y">
                    <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                        <TableCell>
                            {format(post.updatedAt, "MM/dd/yyyy")}
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
                            <span className="text-red-500 font-medium hover:underline cursor-pointer">Delete</span>
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
      </>)
      : 
      (<p>No posts</p>)}
    </div>
  )
}
