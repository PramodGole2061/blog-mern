// The purpose of this component is to block unauthorized(signedup, signed in) people to have access to dashboard

import { useSelector } from "react-redux"
import { Outlet, Navigate } from "react-router-dom";


export default function PrivateRoute() {
    const {currentUser} = useSelector((state)=>(state.user));
  return (
    // if currentUser is true, render this components child component (which is <Dashboard />) in the place of <Outlet /> component
    //else go to <Navigate /> component. it is similar to useNavigate() but <Navigat /> is a component form react-router-dom
    currentUser ? <Outlet /> : <Navigate to='/signin' />
  )
}
