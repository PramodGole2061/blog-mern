import { Button, Navbar, TextInput, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle } from "flowbite-react";
import { Link, useLocation } from "react-router-dom"
import {AiOutlineSearch, AiOutlineMoon} from 'react-icons/ai'


export default function Header() {
    // urlPath now contains the current path of the url
    const urlPath = useLocation().pathname;
  return (
    // border-b-amber-500 is not working, it should give bottom border with amber color
    <Navbar className="p-4 border-b-amber-500">
        <Link className="self-center text-sm sm:text-xl whitespace-nowrap font-semibold dark:text-white">
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-lg">
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
            <Link to='/signin' >
                <Button className="bg-gradient-to-r from-purple-500 to-blue-500">
                    Sign In
                </Button>
            </Link>
            <NavbarToggle/>
        </div>
        <NavbarCollapse>
            {/* use the above urlPath to decide which NavbarLink to be active depending on the url path */}
            <NavbarLink href="/" active={urlPath === '/'}>Home</NavbarLink>
            <NavbarLink href="/about" active={urlPath === '/about'}>About</NavbarLink>
            <NavbarLink href="/projects" active={urlPath==='/projects'}>Projects</NavbarLink>

        </NavbarCollapse>
    </Navbar>
  )
}
