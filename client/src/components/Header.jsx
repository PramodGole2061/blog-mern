import { Button, Navbar, TextInput, DropdownHeader, DropdownDivider, DropdownItem, NavbarCollapse, NavbarLink, NavbarToggle, Dropdown, Avatar, theme } from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom"
import {AiOutlineSearch, AiOutlineMoon, AiOutlineSun} from 'react-icons/ai'
import {useSelector, useDispatch} from 'react-redux'

import { toggleTheme } from "../redux/theme/themeSlice";
import { signoutFailure, signoutSuccess } from "../redux/user/userSlice";
import { useEffect, useState } from "react";

export default function Header() {
    //to access global state of user from here
    const currentUser = useSelector((state)=>(state.user.currentUser))
    // console.log({currentUser})

    // urlPath now contains the current path of the url
    const urlPath = useLocation().pathname;

    //for accessing global theme states
    const {theme} = useSelector((state)=>(state.theme));
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState('');
    // console.log(searchTerm);

    useEffect(()=>{
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');

        if(searchTermFromUrl){
            setSearchTerm(searchTermFromUrl)
        }
    }, [location.search]) //if search parameter in the location changes, run it

    const handleSubmit = (e)=>{
        e.preventDefault();

        const urlParams = new URLSearchParams(location.search);
        urlParams.set('searchTerm', searchTerm);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    }


    const handleSignOut = async ()=>{
          try {
            const res = await fetch(`/api/user/signout`, {
              method: 'POST'
            })
    
            const data = await res.json();
    
            if(res.ok){
              dispatch(signoutSuccess());
            }else{
              dispatch(signoutFailure(data.message));
            }
    
          } catch (error) {
            dispatch(signoutFailure(error))
          }
        }

  return (
    // border-b-amber-500 is not working, it should give bottom border with amber color
    <Navbar className="border-b">
        <Link to='/' className="self-center text-sm sm:text-xl whitespace-nowrap font-semibold dark:text-white">
            <span className="px-2 py-1 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-lg">
                Pramod's
            </span>
            Blog
        </Link>
        <form onSubmit={handleSubmit}>
            {/* for large screen make it appear inline for md and sm make it hidden */}
            <TextInput type="text" value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} placeholder="Search" rightIcon={AiOutlineSearch} className="hidden lg:inline w-24 md:w-auto" />
        </form>
        {/* pill makes the button rounded */}
        <Button className="lg:hidden w-12 h-10 " color='grey' pill> 
            <AiOutlineSearch />
        </Button>

        {/* flex to put them horizontally, gap make a gap, in small scrrens show one */}
        <div className="flex gap-2 sm:order-2"> 
            <Button className="w-12 h-10 hidden sm:inline" color='gray' pill onClick={()=>(dispatch(toggleTheme()))}>
                {theme === 'light' ? <AiOutlineMoon /> : <AiOutlineSun/>}
            </Button>

            {/* user profile section or sign in section */}
            {currentUser ? (
                <Dropdown arrowIcon={false} inline label={<Avatar img={currentUser.profilePicture} rounded alt="user" />} >
                    <DropdownHeader>
                        <span className="block text-sm">{currentUser.name}</span>
                        <span className="block truncate text-sm font-medium">{currentUser.email}</span>
                    </DropdownHeader>

                    <Link to='/dashboard?tab=profile'>
                        <DropdownItem>Profile</DropdownItem>
                    </Link>

                    <DropdownDivider />

                    <Link>
                        <DropdownItem onClick={()=>(handleSignOut())}>Sign out</DropdownItem>
                    </Link>
                </Dropdown>
            ) : (
                <Link to='/signin' >
                    <Button color= 'green' outline>
                        Sign In
                    </Button>
                </Link>

            )}
            <NavbarToggle/>
        </div>
        <NavbarCollapse>
            {/* use the above urlPath to decide which NavbarLink to be active depending on the url path */}
            <NavbarLink to="/" active={urlPath === '/'} as={Link}>Home</NavbarLink>
            <NavbarLink to="/about" active={urlPath === '/about'} as={Link}>About</NavbarLink>

        </NavbarCollapse>
    </Navbar>
  )
}
