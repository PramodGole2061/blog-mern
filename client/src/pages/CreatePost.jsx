import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react'
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useNavigate } from 'react-router-dom';

export default function CreatePost() {
  const [formData, setFormData] = useState({});
  const [postImage, setPostImage] = useState(null);
  const [postImageUrl, setPostImageUrl] = useState(null);
  const [publishError, setPublishError] = useState(null);

  const navigate = useNavigate()

  const handleChange = (e)=>{
    setFormData({...formData, [e.target.id]: e.target.value});
  }

  console.log(formData);

  
  const handlePostImage = (e)=>{
    const file = e.target.files[0];
    if(file){
      setPostImage(file);
      setPostImageUrl(URL.createObjectURL(file));
    }
  }
  
  useEffect(()=>{
    uploadPostImage();
  }, [postImage])

  const uploadPostImage = async ()=>{
    if(!postImage){
      return;
    }
    try {
      const dataForCloudinary = new FormData();
      dataForCloudinary.append('file', postImage);
      dataForCloudinary.append('upload_preset', import.meta.env.VITE_CLOUDINARY_POSTS_UPLOAD_PRESET)
      dataForCloudinary.append('cloud_name', import.meta.env.VITE_CLOUDINARY_CLOUD_NAME)

      const res = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,{
        method: 'POST',
        body: dataForCloudinary
      });

      const data = await res.json();

      if(res.ok){
        const downloadedImageUrl = data.secure_url;
        setFormData({...formData, image: downloadedImageUrl});
      }else{
        console.error("Failed uploading image, ", data.error.message)
      }
    } catch (error) {
      console.error("Failed to upload the image to cloudinary: ", error)
    }
  }

  const handleSubmit = async (e)=>{
    e.preventDefault();

    if(Object.keys(formData).length === 0 || formData.title.trim() === '' || formData.content.trim() === ''){
      setPublishError('Title and content field can not be empty!');
      toast.error('Title and content field can not be empty!')
      return;
    }

    try {
      const res = await fetch('/api/post/create',{
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await res.json();

      if(res.ok){
        toast.success('Post saved successfully!')
        navigate(`/posts/${data.slug}`)
      }else{
        console.error("Server sent an error in a response while creating a post: ", data.message);
        setPublishError('Internal server error!');
        toast.error('Internal server error!')
      }
    } catch (error) {
      console.error("Error submitting create post form in CreatePost.jsx: ", error)
      setPublishError('Error saving the post!');
      toast.error('Error saving the post!')
    }
  }
  return (
    <div className='min-h-screen p-3 max-w-3xl mx-auto'>
      <h1 className='text-center my-7 text-3xl font-semibold'>Create a Post</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <div className='flex flex-col gap-4 sm:flex-row justify-between'>
            <TextInput type='text' id='title' onChange={handleChange} value={formData.title} className='flex-1' placeholder='Title' required />
            <Select id='category' onChange={handleChange} value={formData.category} >
                <option value=''>Select a Category</option>
                <option value='javascript'>Javascript</option>
                <option value='reactjs'>React.js</option>
                <option value='nextjs'>Next.js</option>
            </Select>
        </div>
        <div className='flex gap-4 justify-between border-4 border-dotted border-teal-500 p-3'>
            <FileInput type='file' id='image' onChange={handlePostImage} accept='image/*'/>
            <Button type='button' className='p-3 cursor-pointer' outline>Upload Image</Button>
        </div>
          {postImageUrl ? 
            <div className='cursor-pointer'>
              <img src={postImageUrl} alt='Post image' />
            </div>
            : ''}
        <ReactQuill theme='snow' id='content' onChange={(value)=>{setFormData({...formData, content: value})}} value={formData.content} placeholder='Write something...' className='h-72 mb-12' required/>
        <Button type='submit' outline className='mt-2'>Publish</Button>
      </form>
      {publishError && (<Alert className='text-sm mt-3' color='failure'>{publishError}</Alert>)}
    </div>
  )
}
