import { useEffect, useState } from 'react';
import {useSelector} from 'react-redux';
import {toast} from 'react-hot-toast';
import { HiAnnotation, HiDocumentText, HiOutlineUserGroup } from "react-icons/hi";
import { FaArrowUp } from "react-icons/fa";
import {Button, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow} from 'flowbite-react';
import {Link} from 'react-router-dom';

export default function DashboardCompoenent() {

    const {currentUser} = useSelector((state)=>state.user);

    const [users, setUsers] = useState([]);
    const [posts, setPosts] = useState([]);
    const [comments, setComments] = useState([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalPosts, setTotalPosts] = useState(0);
    const [totalComments, setTotalComments] = useState(0);
    const [lastMonthUsers, setLastMonthUsers] = useState(0);
    const [lastMonthPosts, setLastMonthPosts] = useState(0);
    const [lastMonthComments, setLastMonthComments] = useState(0);

    useEffect(()=>{
        const fetchUsers = async()=>{
            try {
                const res = await fetch(`/api/user/fetch?limit=5`);
                const data = await res.json();
                if(res.ok){
                    setUsers(data.fetchedUsers);
                    setTotalUsers(data.numberOfUsers);
                    setLastMonthUsers(data.lastMonthUsers);
                }
            } catch (error) {
                toast.error('Error fetching users!');
                console.error('Error fetching users at DashboardCompoenents.jsx: ', error.message);
            }
        }

        const fetchPosts = async ()=>{
            try {
                const res = await fetch(`/api/post/fetch?limit=5`);
                const data = await res.json();
                if(res.ok){
                    setPosts(data.fetchedPosts);
                    setTotalPosts(data.totalPosts);
                    setLastMonthPosts(data.lastMonthPosts);
                }
            } catch (error) {
                toast.error('Error fetching posts!');
                console.error('Error fetching posts at DashboardCompoenents.jsx: ', error.message);
            }
        }

        const fetchComments = async ()=>{
            try {
                const res = await fetch(`/api/comment/fetch?limit=5`);
                const data = await res.json();
                if(res.ok){
                    setComments(data.comments);
                    setTotalComments(data.totalComments);
                    setLastMonthComments(data.commentsOneMonthAgo);
                }
            } catch (error) {
                toast.error('Error fetching comments!');
                console.error('Error fetching comments at DashboardCompoenents.jsx: ', error.message);
            }
        }

        fetchUsers();
        fetchPosts();
        fetchComments();
    }, [currentUser])

  return (
    <div className='p-3 md:mx-auto'>
        <div className='flex flex-wrap gap-4 justify-center'>
            {/* users */}
            <div className='flex flex-col gap-4 rounded-md p-3 w-full md:w-72 dark:bg-slate-800 shadow-md'>
                <div className='flex justify-between'>
                    <div>
                        <h1 className='text-gray-500 text-md uppercase'>Total Users</h1>
                        <p className='text-2xl'>{totalUsers}</p>
                    </div>
                    <HiOutlineUserGroup className='bg-teal-500 rounded-full p-3 text-white text-5xl shadow-lg' />
                </div>
                <div className='flex gap-2 text-sm'>
                    <span className='flex text-green-500 items-center'>
                        <FaArrowUp className='mr-1' />
                        {lastMonthUsers}
                    </span>
                    <div className='text-gray-500'>
                        Last Month
                    </div>
                </div>
            </div>
            {/* posts */}
            <div className='flex flex-col gap-4 rounded-md p-3 w-full md:w-72 dark:bg-slate-800 shadow-md'>
                <div className='flex justify-between'>
                    <div>
                        <h1 className='text-gray-500 text-md uppercase'>Total Posts</h1>
                        <p className='text-2xl'>{totalPosts}</p>
                    </div>
                    <HiDocumentText className='bg-lime-500 rounded-full p-3 text-white text-5xl shadow-lg' />
                </div>
                <div className='flex gap-2 text-sm'>
                    <span className='flex text-green-500 items-center'>
                        <FaArrowUp className='mr-1' />
                        {lastMonthPosts}
                    </span>
                    <div className='text-gray-500'>
                        Last Month
                    </div>
                </div>
            </div>        
            {/* comments */}
            <div className='flex flex-col gap-4 rounded-md p-3 w-full md:w-72 dark:bg-slate-800 shadow-md'>
                <div className='flex justify-between'>
                    <div>
                        <h1 className='text-gray-500 text-md uppercase'>Total Comments</h1>
                        <p className='text-2xl'>{totalComments}</p>
                    </div>
                    <HiAnnotation className='bg-indigo-500 rounded-full p-3 text-white text-5xl shadow-lg' />
                </div>
                <div className='flex gap-2 text-sm'>
                    <span className='flex text-green-500 items-center'>
                        <FaArrowUp className='mr-1' />
                        {lastMonthComments}
                    </span>
                    <div className='text-gray-500'>
                        Last Month
                    </div>
                </div>
            </div>
        </div>

        <div className='flex flex-wrap gap-4 py-3 justify-center md:w-auto '>
            {/* users */}
            <div className='flex flex-col p-2 rounded-md shadow-md dark:bg-gray-800 w-full md:w-auto'>
                <div className='flex justify-between p-3 text-sm font-semibold'>
                    <h1>Recent Users</h1>
                    <Button type='button' outline color='green'>
                        <Link to='/dashboard?tab=users'>
                        Sell All
                        </Link>
                    </Button>
                </div>

                <Table hoverable>
                    <TableHead>
                        <TableHeadCell>
                            Image
                        </TableHeadCell>
                        <TableHeadCell>
                            Name
                        </TableHeadCell>
                    </TableHead>
                    {users.length > 0 && (users.map((user)=>
                    <TableBody key={user._id} className='divide-y'>
                        <TableRow className='bg-white dark:bg-gray-800 dark:border-gray-700'>
                            <TableCell>
                                <img src={user.profilePicture} className='w-10 h-10 rounded-full bg-gray-500 object-cover' alt={user.name} />
                            </TableCell>
                            <TableCell>
                                {user.name}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                    ))}
                </Table>
            </div>
            {/* posts */}
            <div className='flex flex-col p-2 rounded-md shadow-md dark:bg-gray-800 w-full md:w-auto'>
                <div className='flex justify-between p-3 text-sm font-semibold'>
                    <h1>Recent Posts</h1>
                    <Button type='button' outline color='green'>
                        <Link to='/dashboard?tab=posts'>
                        Sell All
                        </Link>
                    </Button>
                </div>

                <Table hoverable>
                    <TableHead>
                        <TableHeadCell>
                            Image
                        </TableHeadCell>
                        <TableHeadCell>
                            Title
                        </TableHeadCell>
                        <TableHeadCell>
                            Category
                        </TableHeadCell>
                    </TableHead>
                    {posts.length > 0 && (posts.map((post)=>
                    <TableBody key={post._id} className='divide-y'>
                        <TableRow className='bg-white dark:bg-gray-800 dark:border-gray-700'>
                            <TableCell>
                                <img src={post.image} className='w-10 h-10 rounded-md bg-gray-500 object-cover' alt={post.title} />
                            </TableCell>
                            <TableCell className='w-96'>
                                <p className='line-clamp-2'>
                                    {post.title}
                                </p>
                            </TableCell>
                            <TableCell className='w-5'>
                                {post.category}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                    ))}
                </Table>
            </div>
            {/* comments */}
            <div className='flex flex-col p-2 rounded-md shadow-md dark:bg-gray-800 w-full md:w-auto'>
                <div className='flex justify-between p-3 text-sm font-semibold'>
                    <h1>Recent Comments</h1>
                    <Button type='button' outline color='green'>
                        <Link to='/dashboard?tab=comments'>
                        Sell All
                        </Link>
                    </Button>
                </div>

                <Table hoverable>
                    <TableHead>
                        <TableHeadCell>
                            Comment Content
                        </TableHeadCell>
                        <TableHeadCell>
                            Likes
                        </TableHeadCell>
                    </TableHead>
                    {comments.length > 0 && (comments.map((comment)=>
                    <TableBody key={comment._id} className='divide-y'>
                        <TableRow className='bg-white dark:bg-gray-800 dark:border-gray-700'>
                            <TableCell className='w-96'>
                                <p className='line-clamp-2'>
                                    {comment.content}
                                </p>
                            </TableCell>
                            <TableCell>
                                {comment.numberOfLikes}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                    ))}
                </Table>
            </div>
        </div>   
    </div>
  )
}
