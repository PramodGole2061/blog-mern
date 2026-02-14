import { Button, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Modal, ModalBody, ModalHeader  } from "flowbite-react";
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { useSelector } from "react-redux";
import {format} from 'date-fns'
import {data, Link} from 'react-router-dom'
import { HiOutlineExclamationCircle } from "react-icons/hi";
import {FaCheck, FaTimes} from 'react-icons/fa';


export default function DashboardUsers() {
    const {currentUser} = useSelector((state)=>(state.user));

    const [users, setUsers] = useState([]);
    // console.log(userPosts)
    const [showMore, setShowMore] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [userIdToDelete, setUserIdToDelete] = useState(null);

    useEffect(()=>{
        const fetchUsers = async ()=>{
            try {
                const res = await fetch(`/api/user/fetch`);

                const data = await res.json();

                if(res.ok){
                    //from backend an object with fetchedUsers, numberOfUsers and lastMonthUsers are sent in the res
                    //so specify fetchedUsers otherwise it will remain an object and .length will show 0 or undefined
                    setUsers(data.fetchedUsers);
                    if(data.fetchedUsers.length < 9){
                        setShowMore(false);
                    }
                }else{
                    toast.error('Internal server error!')
                    console.log('Error given from server: ', data.message);
                }
            } catch (error) {
                toast.error("Failed to fetch users!");
                console.log('Error fetching users at DashboardUsers.jsx: ', error);
            }
        }

        if(currentUser.isAdmin){
            fetchUsers();
        }
    }, [currentUser._id])

    const handleShowMore = async ()=>{
        //set the startIndex from the length of current userPosts state, because it has all the fetched posts till now
        const startIndex = users.length;
        try {
            //use current startIndex to fetch from that index
            const res = await fetch(`/api/user/fetch?startIndex=${startIndex}`);

            const data = await res.json();

            if(res.ok){
                //add newly fetched posts inside userPosts state
                setUsers((prev)=>([...prev, ...data.fetchedUsers]));
                if(data.fetchedUsers.length < 9){
                    setShowMore(false);
                }
            }else{
                toast.error('Error fetching more users!')
                console.error('Error from server at handleShowMore function at DashboardUsers.jsx: ', data.message);
            }
        } catch (error) {
            toast.error('Error fetching more users!');
            console.log('Error at handleShowMore function for show more button: ', error)
        }
    }

    const handleUserDelete = async()=>{
        setOpenModal(false);
        try {
            const res = await fetch(`/api/user/delete/${userIdToDelete}`, {
                method: 'DELETE'
            })

            const data = await res.json();

            if(res.ok){
                //remove the post from the screen as well
                setUsers((prev)=>
                    prev.filter((user)=>(user._id !== userIdToDelete))
                );
                toast.success('User deleted successfully!');
            }else{
                toast.error('Error deleting User!');
                console.error('Error from server for deleting user at handleUserDelete function inside DashboardUsers.jsx: ', data.message)
            }
        } catch (error) {
            toast.error('Error deleting user!');
            console.error('Error deleting user at catch at handlePostDelete function at DashboardUsers.jsx: ', error)
        }
    }
  return (
    <div className="table-auto overflow-x-auto md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 scrollbar-thumb-slate-500">
      {currentUser.isAdmin && users.length > 0 ? 
      (<>
        <Table>
            <TableHead>
                <TableHeadCell>
                    Date Created
                </TableHeadCell>
                <TableHeadCell>
                    Image
                </TableHeadCell>
                <TableHeadCell>
                    Name
                </TableHeadCell>
                <TableHeadCell>
                    Email
                </TableHeadCell>
                <TableHeadCell>
                    Admin
                </TableHeadCell>
                <TableHeadCell>
                    Delete
                </TableHeadCell>
            </TableHead>
            {users.map((user)=>(
                <TableBody className="divide-y" key={user._id}>
                    <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                        <TableCell>
                            {format(user.createdAt, "yyyy/MM/dd")}
                        </TableCell>
                        <TableCell>
                            <img src={user.profilePicture} className="w-10 h-10 object-cover rounded-full bg-gray-500" />
                        </TableCell>
                        <TableCell>
                            <Link className="font-medium text-gray-900 dark:text-white" >
                                {user.name}
                            </Link>
                        </TableCell>
                        <TableCell>
                            <Link className="font-medium text-gray-900 dark:text-white" >
                                {user.email}
                            </Link>
                        </TableCell>
                        <TableCell>
                            {user.isAdmin ? <FaCheck className="text-green-500"/> : <FaTimes className="text-red-500"/>}
                        </TableCell>
                        <TableCell>
                            <span onClick={()=>{
                                setOpenModal(true);
                                setUserIdToDelete(user._id);
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
              Are you sure you want to delete this post?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="red" onClick={() => handleUserDelete()}>
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
