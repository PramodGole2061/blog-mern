import {Link, useNavigate} from 'react-router-dom';
import { Alert, Button, Checkbox, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from 'react';

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) =>{
    setFormData({...formData, [e.target.id] : e.target.value.trim()}); //spread operator to copy existing formData and update the specific fields with new values
  }

  // console.log(formData);

  
  const handleSubmit = async (e)=>{
    setErrorMessage(null); //reset error message on new submit
    setLoading(true); //after clicking submit button, set loading to true

    e.preventDefault(); //prevent default behavior, which is refreshing the page with submit
    
    //basic validation but it must me inside handleSubmit because these fields are initially epmty
    if(!formData.name || !formData.email || !formData.password){
      setErrorMessage("All fields need to be filled.");
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        headers: {
          "content-type": 'application/json'
        },
        body: JSON.stringify(formData) //convert formData object to JSON string
      })
      
      
      // Safe to parse JSON for successful responses
      const data = await res.json(); //convert res json object to js object
      
      //we can't do !data.ok because it will always return from this if check even if it was successful
      if(data.ok === false){
        return setErrorMessage(data.message);
      }

      //if successfull, redirect to signin page
      navigate('/signin')

    } catch (error) {
      setErrorMessage("An error occurred during sign up.", error)
      setLoading(false);
    }finally{
      setLoading(false);
    }
  }
  return (
    <div className='min-h-screen min-w-screen mt-20'>

      {/* flex into row, padding on x 3, maximum width 3xl means it's size is now fixed so we can center this div with mx-auto which center contents horizontally */}
      {/* flex into columns meaning one above other below, but for md: or lg: screens flex horizontally and make items center, gap-5 will put gap between righta and left div*/}
      <div className='flex px-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5'>

        {/* left side */}
        {/* flex-1 means 50% for left div */}
        <div className='flex-1'>
          <Link className='text-4xl font-bold dark:text-white' >
            <span className='px-2 py-1 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-lg'>Pramod's</span>
            Blog
          </Link>
          <p className='text-sm mt-5'>
            This is a demo project. You can sign up with your email or with google.
          </p>
        </div>

        {/* right side */}
        {/* flex-1 on right side div means 50% do right div */}
        <div className='flex-1'>
          <form className="flex max-w-md flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="name">Your name</Label>
              </div>
              <TextInput id="name" type="text" placeholder="username" required onChange={handleChange} />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="email">Your email</Label>
              </div>
              <TextInput id="email" type="email" placeholder="name@gmail.com" required onChange={handleChange} />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="password">Your password</Label>
              </div>
              <TextInput id="password" type="password" placeholder='password' required onChange={handleChange}/>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="remember" />
              <Label htmlFor="remember">Remember me</Label>
            </div>
            <Button className='bg-linear-to-r from-purple-500 to-pink-500' type="submit" disabled={loading}>
              {!loading ? 'Sign Up': (
                <>
                  <Spinner size='sm' />
                  <span className='pl-3'>Signing Up...</span>
                </>
              )}
              </Button>
            <div className='text-sm flex gap-2'>
              <span>Already have an account?</span>
              <Link to='/signin' className='text-blue-500'>
                sign in
              </Link>
            </div>

            {errorMessage && (<Alert className='mt-5 text-sm' color='failure'>{errorMessage}</Alert>)}
          </form>
        </div>

      </div>
    </div>
  )
}
