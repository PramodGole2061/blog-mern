import { Button } from 'flowbite-react'
import { AiOutlineGoogle } from 'react-icons/ai';
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { signInSuccess, signInFailure } from '../redux/user/userSlice';

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const auth = getAuth(app);

  const handleGoogleClick = async () =>{
    const provider = new GoogleAuthProvider();

    //allow users to select from multiple accounts
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    try{
      const resultsFromGoogle = await signInWithPopup(auth, provider)

      // console.log(resultsFromGoogle)

      const res = await fetch('/api/auth/google',{
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          // displayName, email, photoURL are from the console.log(resultsFromGoogle)
          name: resultsFromGoogle.user.displayName,
          email: resultsFromGoogle.user.email,
          googlePhotoUrl: resultsFromGoogle.user.photoURL
        })
      })

      const data = await res.json();


      if(res.ok){
        dispatch(signInSuccess(data));
        navigate('/')
      }else{
        //if google auth error is send in response
        dispatch(signInFailure(data.message))
      }
      
    }catch(error){
      dispatch(signInFailure(error.message || 'Google auth error.'))
    }
  }
  return (
    <Button color='pink' className='cursor-pointer' type='button' outline onClick={handleGoogleClick}>
      <AiOutlineGoogle className='w-6 h-7 mr-1' /><span>Continue with Google</span>
    </Button>
  )
}
