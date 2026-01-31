import {Link} from 'react-router-dom';
import { Button, Checkbox, Label, TextInput } from "flowbite-react";

export default function SignUp() {
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
          <form className="flex max-w-md flex-col gap-4">
            <div>
              <div className="mb-2 block">
                <Label htmlFor="name">Your name</Label>
              </div>
              <TextInput id="name" type="text" placeholder="username" required />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="email1">Your email</Label>
              </div>
              <TextInput id="email1" type="email" placeholder="name@gmail.com" required />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="password1">Your password</Label>
              </div>
              <TextInput id="password1" type="password" placeholder='password' required />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="remember" />
              <Label htmlFor="remember">Remember me</Label>
            </div>
            <Button className='bg-linear-to-r from-purple-500 to-pink-500' type="submit">Sign Up</Button>
            <div className='text-sm flex gap-2'>
              <span>Already have an account?</span>
              <Link to='/signin' className='text-blue-500'>
                sign in
              </Link>
            </div>
          </form>
        </div>

      </div>
    </div>
  )
}
