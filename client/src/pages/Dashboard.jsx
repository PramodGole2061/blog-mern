import { useEffect, useState } from "react"
import {useLocation} from 'react-router-dom'

import DashboardProfile from "../components/DashboardProfile";
import DashboardSidebar from "../components/DashboardSidebar";

export default function Dashboard() {
  const [tab, setTab] = useState(''); {/* to keep track of value of tab in the url: /dashboard?tab=profile etc.*/}

  //current url path
  const urlPath =  useLocation();
  // console.log(urlPath); //Console: {pathname: '/dashboard', search: '?tab=profile', hash: '', state: null, key: 'default'}

  useEffect(()=>{
    //according to the search params in the url, change the page
    //thus keep track of search part of the url with this
    const currentUrlSearchParams = new URLSearchParams(urlPath.search); {/*URLSearchParams is a JavaScript API that allows users to retrieve and work with data in the URL query parameters*/}
    
    //get tab from search params in the url
    const currentTab = currentUrlSearchParams.get('tab')
    if(currentTab){
      setTab(currentTab);
    }


  }, [urlPath.search]) //if urlPath.search changes, execute the useEffect()
  return (
    // full screen height, flex in column normally, but flex in row in screens which are md: or bigger
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* md: or above make the width 56 */}
      <div className="md:w-56">
        {/* Dashboard Sidebar */}
        <DashboardSidebar />
      </div>
      <div>
        {/* Profile */}
        {tab === 'profile' && <DashboardProfile />}
      </div>
    </div>
  )
}
