import { BrowserRouter, Routes, Route } from "react-router-dom"

import Home from "./pages/Home"
import Header from "./components/Header"
import About from "./pages/About"
import Dashboard from "./pages/Dashboard"
import Projects from "./pages/Projects"
import SignIn from "./pages/SignIn"
import SignUp from "./pages/SignUp"
import Footer from "./components/FooterSection"
import PrivateRoute from "./components/PrivateRoute"
import CreatePost from "./pages/CreatePost"
import OnlyAdminPrivateRoute from "./components/OnlyAdminPrivateRoute"

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element = {<Home />} />
        <Route path="/about" element = {<About />} />

        <Route element={<PrivateRoute />}> {/* Before gaining access to /dashboard, go through <PrivateRoute /> */}
          <Route path="/dashboard" element = {<Dashboard />} />
        </Route>

        <Route path="/projects" element = {<Projects />} />
        <Route path="/signin" element = {<SignIn />} />
        <Route path="/signup" element = {<SignUp />} />

        <Route element={<OnlyAdminPrivateRoute />} >
          <Route path="/create-post" element={<CreatePost />}/>
        </Route>
        
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}
