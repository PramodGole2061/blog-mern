import { Button, FileInput, Select, TextInput } from 'flowbite-react'
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

export default function CreatePost() {
  return (
    <div className='min-h-screen p-3 max-w-3xl mx-auto'>
      <h1 className='text-center my-7 text-3xl font-semibold'>Create a Post</h1>
      <form className='flex flex-col gap-4'>
        <div className='flex flex-col gap-4 sm:flex-row justify-between'>
            <TextInput type='text' id='title' className='flex-1' placeholder='Title' required />
            <Select id='category' required>
                <option value=''>Select a Category</option>
                <option value='javascript'>Javascript</option>
                <option value='reactjs'>React.js</option>
                <option value='nextjs'>Next.js</option>
            </Select>
        </div>
        <div className='flex gap-4 justify-between border-4 border-dotted border-teal-500 p-3'>
            <FileInput type='file' id='image' accept='image/*'/>
            <Button type='button' className='p-3 cursor-pointer' outline>Upload Image</Button>
        </div>
        <ReactQuill theme='snow' id='content' placeholder='Write something...' className='h-72 mb-12' required/>
        <Button type='submit' outline className='mt-2'>Publish</Button>
      </form>
    </div>
  )
}
