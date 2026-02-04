import { Alert, Button, TextInput } from 'flowbite-react';
import { useEffect, useRef, useState } from 'react';
import {useSelector, useDispatch} from 'react-redux'
import { updateStart, updateSuccess, updateFailure } from '../redux/user/userSlice';
import toast from 'react-hot-toast';

export default function DashboardProfile() {
    const {currentUser, error} = useSelector((state)=>(state.user));
    const dispatch = useDispatch();

    const [imageFile, setImageFile] = useState(null);
    const [formData, setFormData] = useState({});


    const handleFormUpdate = (e) =>{
      setFormData({...formData, [e.target.id]: e.target.value.trim()});
    }

    // console.log({formData})

    const handleSubmit = async (e)=>{
      e.preventDefault();

      //it will always return true, if some fields are not changed
      // if(!formData.name || !formData.email || !formData.password){
      //   return dispatch(updateFailure('Fields can not be empty!'));
      // }

      //check if formData is empty
      if(Object.keys(formData).length === 0){
        return;
      }

      try {
        dispatch(updateStart());

        const res = await fetch(`/api/user/update/${currentUser._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        })

        const data = await res.json();

        if(res.ok){
          dispatch(updateSuccess(data));
          toast.success('Updated successfully!');
        }else{
          dispatch(updateFailure(data.message));
        }
        
      } catch (error) {
        dispatch(updateFailure(error));
      }
    }

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
      setFormData({...formData, profilePicture: imageFileUrl})
    }

    // console.log({imageFile, imageFileUrl})

  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <div className='my-7 text-center text-3xl font-bold'>Profile</div>

      <form className='flex flex-col gap-4' onSubmit={handleSubmit} >
        {/* For uploading an image file */} {/*after referencing it with <div><img></div> make it hidden*/}
        <input type='file' accept='image/*' onChange={handleImageUpload} ref={filePickerReference} hidden className='cursor-pointer' /> {/* accept image with any type(*) */}
          {/* when it is clicked, above <inpput /> would be executed */}
          <div onClick={()=>(filePickerReference.current.click())} className='w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full'>
              {/* if imageFile is not null use imageFile else currentUser.profilePicture */}
              <img src={imageFileUrl || currentUser.profilePicture} className='rounded-full w-full h-full object-cover border-8 border-[lightgray]' alt='User'/>
          </div>
        <TextInput type='text' id='name' defaultValue={currentUser.name} placeholder='name' onChange={handleFormUpdate} required/>
        <TextInput type='email' id='email' defaultValue={currentUser.email} placeholder='email' onChange={handleFormUpdate} required/>
        <TextInput type='password' id='password' placeholder='password' onChange={handleFormUpdate} />
        <Button type='submit' disabled={Object.keys(formData).length === 0} outline >Update</Button>
      </form>

      <div className='flex justify-between p-1 text-red-500 mt-5'>
        <span className='cursor-pointer'>Delete Account</span>
        <span className='cursor-pointer'>Log Out</span>
      </div>

      {error && (<Alert className='text-sm mt-3 mb-3' color='failure'>{error}</Alert>)}
    </div>
  )
}
