import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react'
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function UpdatePost() {
  const [formData, setFormData] = useState({});
  const [postImage, setPostImage] = useState(null);
  const [postImageUrl, setPostImageUrl] = useState(null);
  const [publishError, setPublishError] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);

  const {currentUser} = useSelector((state)=>(state.user));
  const navigate = useNavigate()
  
  const {postId} = useParams(); //<Route path="/update-post/:postId" element={<UpdatePost />} />

  //use the postId to fetch the posts data
  useEffect(()=>{
    try {
        const fetchPost = async ()=>{
            const res = await fetch(`/api/post/fetch?postId=${postId}`);
            const data = await res.json();

            if(res.ok){
                setFormData(data.fetchedPosts[0]);
            }else{
                toast.error(data.message);
                console.log('Error from server while fetching a post for update: ', data.message)
            }
        }

        fetchPost();
    } catch (error) {
        toast.error('Error fetching post!')
        console.log('Error fetching post data in UpdatePost.jsx: ', error)
    }
  }, [postId])


  const handleChange = (e)=>{
    setFormData({...formData, [e.target.id]: e.target.value});
  }

  console.log(formData);

  
  const handlePostImage = (e)=>{
    const file = e.target.files[0];
    if(file){
      setPostImage(file);
      setPostImageUrl(URL.createObjectURL(file));
    }else{
        setImageUploadError('Error uploading image!');
        toast.error('Error uploading image!');
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
        // (prev) => ({...prev}) It is used to ensure that you are updating the absolute latest version of your state
        setFormData((prev) =>({...prev, image: downloadedImageUrl}));
      }else{
        console.error("Failed uploading image, ", data.error.message)
      }
    } catch (error) {
      console.error("Failed to upload the image to cloudinary: ", error)
    }
  }

  const handleSubmit = async (e)=>{
    e.preventDefault();

    try {
      const res = await fetch(`/api/post/update/${postId}/${currentUser._id}`,{
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await res.json();

      if(res.ok){
        toast.success('Post updated successfully!')
        navigate(`/posts/${data.slug}`)
      }else{
        console.error("Server sent an error in a response while updating a post: ", data.message);
        setPublishError(data.message);
      }
    } catch (error) {
      console.error("Error submitting update post form in CreatePost.jsx: ", error)
      setPublishError('Something went wrong!');
    }
  }
  return (
    <div className='min-h-screen p-3 max-w-3xl mx-auto'>
      <h1 className='text-center my-7 text-3xl font-semibold'>Update Post</h1>
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
        {formData.image && (<img src={formData.image} alt='Post image' className='w-full h-72 object-cover' />)}
        <ReactQuill theme='snow' id='content' onChange={(value)=>{setFormData({...formData, content: value})}} value={formData.content} placeholder='Write something...' className='h-72 mb-12' required/>
        <Button type='submit' outline className='mt-2'>Update</Button>
      </form>
      {publishError && (<Alert className='text-sm mt-3' color='failure'>{publishError}</Alert>)}
    </div>
  )
}
