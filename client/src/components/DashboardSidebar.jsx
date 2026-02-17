import { Sidebar, SidebarCollapse, SidebarItem, SidebarItemGroup, SidebarItems } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiArrowSmLeft, HiArrowSmRight, HiChartPie, HiInbox, HiPaperClip, HiShoppingBag, HiTable, HiUser, HiUserGroup } from "react-icons/hi";
import { href, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaComment } from "react-icons/fa";
import { IoIosPaper } from "react-icons/io";


import { signoutFailure, signoutSuccess } from "../redux/user/userSlice";

export default function DashboardSidebar() {
  const dispatch = useDispatch();
  const {currentUser} = useSelector((state)=>(state.user));

    const [tab, setTab] = useState('');

    const urlPath = useLocation();
    
    useEffect(()=>{

        const currentSearchParams = new URLSearchParams(urlPath.search);
        const currentTab = currentSearchParams.get('tab');

        if(currentTab){
            setTab(currentTab);
        }

    },[urlPath.search])

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
    // width 100% but in scrrens which are md: or above(lg:) make the width 56
    <Sidebar className="w-full md:w-56">
      <SidebarItems>
        <SidebarItemGroup>
          <SidebarItem active={tab==='profile'} href="/dashboard?tab=profile" icon={HiUser} label="user" labelColor="dark">
            Profile
          </SidebarItem>
          {currentUser.isAdmin && (<SidebarItem active={tab === 'posts'} href="/dashboard?tab=posts" icon={IoIosPaper} >
            Posts
          </SidebarItem>
          )}
          {currentUser.isAdmin && (<SidebarItem active={tab === 'users'} href="/dashboard?tab=users" icon={HiUserGroup} >
            Users
          </SidebarItem>
          )}
          {currentUser.isAdmin && (
            <SidebarItem active={tab === 'comments'} href="/dashboard?tab=comments" icon={FaComment}>
              Comments
            </SidebarItem>
          )}
          <SidebarItem onClick={()=>(handleSignOut())} icon={HiArrowSmLeft}>
            Sign Out
          </SidebarItem>
        </SidebarItemGroup>
      </SidebarItems>
    </Sidebar>
  )
}
