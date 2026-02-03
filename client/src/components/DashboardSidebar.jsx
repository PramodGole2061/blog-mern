import { Sidebar, SidebarCollapse, SidebarItem, SidebarItemGroup, SidebarItems } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiArrowSmLeft, HiArrowSmRight, HiChartPie, HiInbox, HiShoppingBag, HiTable, HiUser } from "react-icons/hi";
import { useLocation } from "react-router-dom";

export default function DashboardSidebar() {
    const [tab, setTab] = useState('');

    const urlPath = useLocation();
    
    useEffect(()=>{

        const currentSearchParams = new URLSearchParams(urlPath.search);
        const currentTab = currentSearchParams.get('tab');

        if(currentTab){
            setTab(currentTab);
        }

    },[urlPath.search])

  return (
    // width 100% but in scrrens which are md: or above(lg:) make the width 56
    <Sidebar className="w-full md:w-56">
      <SidebarItems>
        <SidebarItemGroup>
          <SidebarItem active={tab==='profile'} href="/dashboard?tab=profile" icon={HiUser} label="user" labelColor="dark">
            Profile
          </SidebarItem>
          <SidebarItem href="#" icon={HiArrowSmLeft}>
            Sign Out
          </SidebarItem>
        </SidebarItemGroup>
      </SidebarItems>
    </Sidebar>
  )
}
