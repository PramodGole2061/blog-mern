//Purpose of this component is to always scroll to the top of page when users click on a new page
//instead of showing similar scrolled down scroll

import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const ScrollToTop = ()=>{
    const currentPath = useLocation();
    useEffect(()=>{
        if(currentPath){
            //to the top of page
            window.scrollTo(0,0);
        }
    }, [currentPath])
}

export default ScrollToTop;