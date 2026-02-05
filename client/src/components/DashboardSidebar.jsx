import { Sidebar, SidebarCollapse, SidebarItem, SidebarItemGroup, SidebarItems } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiArrowSmLeft, HiArrowSmRight, HiChartPie, HiInbox, HiShoppingBag, HiTable, HiUser } from "react-icons/hi";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";

import { signoutFailure, signoutSuccess } from "../redux/user/userSlice";

export default function DashboardSidebar() {
  const dispatch = useDispatch();

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
          <SidebarItem onClick={()=>(handleSignOut())} icon={HiArrowSmLeft}>
            Sign Out
          </SidebarItem>
        </SidebarItemGroup>
      </SidebarItems>
    </Sidebar>
  )
}
