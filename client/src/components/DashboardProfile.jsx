import { Button, TextInput } from 'flowbite-react';
import {useSelector} from 'react-redux'

export default function DashboardProfile() {
    const {currentUser} = useSelector((state)=>(state.user));

  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <div className='my-7 text-center text-3xl font-bold'>Profile</div>
      <form className='flex flex-col gap-4' >
        <div className='w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full'>
            <img src={currentUser.profilePicture} className='rounded-full w-full h-full object-cover border-8 border-[lightgray]' alt='User'/>
        </div>
        <TextInput type='text' id='name' defaultValue={currentUser.name} placeholder='name' />
        <TextInput type='email' id='email' defaultValue={currentUser.email} placeholder='email' />
        <TextInput type='password' id='password' placeholder='password' />
        <Button type='submit' outline >Update</Button>
      </form>
      <div className='flex justify-between p-1 text-red-500 mt-5'>
        <span className='cursor-pointer'>Delete Account</span>
        <span className='cursor-pointer'>Log Out</span>
      </div>
    </div>
  )
}
