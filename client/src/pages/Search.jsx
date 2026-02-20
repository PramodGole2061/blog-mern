import { Button, Label, Select, TextInput } from 'flowbite-react';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import {toast} from 'react-hot-toast'

import PostCard from '../components/PostCard'

export default function Search() {
    const [sidebarData, setSidebarData] = useState({
        searchTerm : '',
        sort: 'desc',
        category: 'uncategorized'
    })
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showMore, setShowMore] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    // console.log(sidebarData);
    console.log(showMore)

    useEffect(()=>{
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        const sortFromUrl = urlParams.get('sort');
        const categoryFromUrl = urlParams.get('category');

        if(searchTermFromUrl || sortFromUrl || categoryFromUrl){
            setSidebarData({...sidebarData, searchTerm: searchTermFromUrl, sort: sortFromUrl, category: categoryFromUrl});
        }

        const fetchPosts = async()=>{
            setLoading(true);
            try {
                const searchQuery = urlParams.toString();
                const res = await fetch(`/api/post/fetch?search=${searchQuery}`);
                const  data = await res.json();

                if(res.ok){
                    setPosts(data.fetchedPosts);
                    if(data.fetchedPosts.length === 9){
                        setShowMore(true);
                    }
                }
            } catch (error) {
                console.log('Could not fetch posts according to searchTerm at fetchPosts() at Search.jsx : ', error.message);
                toast.error('Could not fetch posts!');
            }finally{
                setLoading(false);
            }
        }
        fetchPosts();
    }, [location.search])

    const handleChange = (e)=>{
        if(e.target.id === 'searchTerm'){
            setSidebarData({...sidebarData, searchTerm: e.target.value});
        }
        if(e.target.id === 'sort'){
            const order = e.target.value || 'desc';
            setSidebarData({...sidebarData, sort: order});
        }
        if(e.target.id === 'category'){
            const category = e.target.value || 'uncategorized'
            setSidebarData({...sidebarData, category});
        }
    }

    const handleSubmit = (e)=>{
        e.preventDefault();
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('searchTerm', sidebarData.searchTerm);
        urlParams.set('sort', sidebarData.sort);
        urlParams.set('category', sidebarData.category);
        navigate(`/search?${urlParams}`)
    }

    const handleShowMore = async ()=>{
        try {
            const startIndex = posts.length;
            const urlParams = new URLSearchParams(location.search);
            urlParams.set('startIndex', startIndex);
            const searchQuery = urlParams.toString();

            const res = await fetch(`/api/post/fetch?search=${searchQuery}`);
            const data = await res.json();

            if(!res.ok){
                return;
            }

            if(res.ok){
                setPosts([...posts, ...data.fetchedPosts]);
                if(data.fetchedPosts.length === 9){
                    setShowMore(true)
                }else{
                    setShowMore(false);
                }
            }
        } catch (error) {
            console.error('Could not fetch more posts at handleShowMore() at Search.jsx: ', error);
        }
    }
  return (
    <div className='flex flex-col md:flex-row'>
      <div className='p-7 border-b md:border-r md:min-h-screen border-gray-500'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
            <div className='flex items-center gap-2'>
                <Label className='font-semibold' id='searchTerm'>Search Term: </Label>
                <TextInput className='flex-1' type='text' value={sidebarData.searchTerm} onChange={handleChange} id='searchTerm' placeholder='Search...' />
            </div>
            <div className='flex items-center gap-2'>
                <Label className='font-semibold'>Sort: </Label>
                <Select className='flex-1' value={sidebarData.sort} onChange={handleChange} id='sort'>
                    <option value='desc'>Latest</option>
                    <option value='asc'>Oldest</option>
                </Select>
            </div>
            <div className='flex items-center gap-2'>
                <Label id='category' className='font-semibold'>Category: </Label>
                <Select className='flex-1' value={sidebarData.category} onChange={handleChange} id='category'>
                    <option value='uncategorized'>Uncategorized</option>
                    <option value='javascript'>Javascript</option>
                    <option value='reactjs'>React.js</option>
                    <option value='nextjs'>Next.js</option>
                </Select>
            </div>
            <Button type='submit' outline>Apply Filters</Button>
        </form>
      </div>
      <div className='w-full'>
        <h1 className='text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5'>Posts results: </h1>
        <div className='p-7 flex flex-wrap gap-4'>
            {!loading && !posts && (
                <p className='text-xl text-gray-500'>No posts found.</p>
            )}
            {loading && (<p className='text-xl text-gray-500'>
                Loading...
            </p>)}
            {!loading && posts && posts.map((post)=><PostCard key={post._id} post={post} />)}
            {showMore && (
                <button type='button' onClick={handleShowMore} className='text-teal-500 text-lg hover:underline hover:cursor-pointer w-full'>Show More</button>
            )}
        </div>
      </div>
    </div>
  )
}
