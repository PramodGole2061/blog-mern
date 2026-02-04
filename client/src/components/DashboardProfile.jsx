import { Button, TextInput } from 'flowbite-react';
import { useEffect, useRef, useState } from 'react';
import {useSelector} from 'react-redux'

export default function DashboardProfile() {
    const {currentUser} = useSelector((state)=>(state.user));
    const [imageFile, setImageFile] = useState(null);
    //instead of working with file/image/object address directly
    // convert file/object loacation/address into an url, which can only work inside user's browser
    const [imageFileUrl, setImageFileUrl] = useState(null);
    const filePickerReference = useRef();

    const handleImageUpload = (e)=>{
      const file = e.target.files[0]; //if multiple files are chosen only the first one will be allowed

      if(file){
        setImageFile(file);

        //URL.createObjectURL(object/blob)
        //A Blob (such as a File) or MediaSource object to create an object URL for.
        //Return value
        //A string containing an object URL that can be used to reference the contents of the specified source object.
        setImageFileUrl(URL.createObjectURL(file));
      }
    }

    //every time imageFile changes upload the file, for that we use useEffect()
    useEffect(()=>{
      if(imageFile){
        uploadImage();
      }
    }, [imageFile]) //if imageFile changes, execute the function


    const uploadImage = async ()=>{ //async because it can take time
      console.log('Uploading image...');
    }

    console.log({imageFile, imageFileUrl})

  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <div className='my-7 text-center text-3xl font-bold'>Profile</div>

      <form className='flex flex-col gap-4' >
        {/* For uploading an image file */} {/*after referencing it with <div><img></div> make it hidden*/}
        <input type='file' accept='image/*' onChange={handleImageUpload} ref={filePickerReference} hidden className='cursor-pointer' /> {/* accept image with any type(*) */}
          {/* when it is clicked, above <inpput /> would be executed */}
          <div onClick={()=>(filePickerReference.current.click())} className='w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full'>
              {/* if imageFile is not null use imageFile else currentUser.profilePicture */}
              <img src={imageFileUrl || currentUser.profilePicture} className='rounded-full w-full h-full object-cover border-8 border-[lightgray]' alt='User'/>
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
