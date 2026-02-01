import { configureStore } from '@reduxjs/toolkit'
import userReducer from './user/userSlice.js' //we gave it a new name while importing because it is a default export

//this is the central store that holds all the global states of the application
//we can add multiple reducers to the store if we have multiple slices

export const store = configureStore({
  reducer: {
    //this will create a state called 'user' in the store which will hold all the states defined in userSlice.js . 
    // It can be used to update or access the global states related to user
    user: userReducer, 
  },
})