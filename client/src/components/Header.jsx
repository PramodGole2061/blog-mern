import { Button, Navbar, TextInput, DropdownHeader, DropdownDivider, DropdownItem, NavbarCollapse, NavbarLink, NavbarToggle, Dropdown, Avatar } from "flowbite-react";
import { Link, useLocation } from "react-router-dom"
import {AiOutlineSearch, AiOutlineMoon} from 'react-icons/ai'
import {useSelector} from 'react-redux'


export default function Header() {
    //to access global state of user from here
    const currentUser = useSelector((state)=>(state.user.currentUser))
    console.log({currentUser})

    // urlPath now contains the current path of the url
    const urlPath = useLocation().pathname;
  return (
    // border-b-amber-500 is not working, it should give bottom border with amber color
    <Navbar className="p-4 border-b-amber-500">
        <Link to='/' className="self-center text-sm sm:text-xl whitespace-nowrap font-semibold dark:text-white">
            <span className="px-2 py-1 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-lg">
                Pramod's
            </span>
            Blog
        </Link>
        <form>
            {/* for large screen make it appear inline for md and sm make it hidden */}
            <TextInput type="text" placeholder="Search" rightIcon={AiOutlineSearch} className="hidden lg:inline w-24 md:w-auto" />
        </form>
        {/* pill makes the button rounded */}
        <Button className="lg:hidden w-12 h-10 " color='grey' pill> 
            <AiOutlineSearch />
        </Button>

        {/* flex to put them horizontally, gap make a gap, in small scrrens show one */}
        <div className="flex gap-2 sm:order-2"> 
            <Button className="w-12 h-10 hidden sm:inline" color='grey' pill>
                <AiOutlineMoon />
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
                        <DropdownItem>Sign out</DropdownItem>
                    </Link>
                </Dropdown>
            ) : (
                <Link to='/signin' >
                    <Button className="bg-linear-to-r from-purple-500 to-blue-5000" outline>
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
            <NavbarLink to="/projects" active={urlPath==='/projects'} as={Link}>Projects</NavbarLink>

        </NavbarCollapse>
    </Navbar>
  )
}
