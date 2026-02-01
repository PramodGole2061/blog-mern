import { createSlice } from '@reduxjs/toolkit'

//These are the global states which can be accessed from any component
const initialState = {
    loading: false,
    error: null, // error message that occurs during sign in
    currentUser: null //user info will be stored here after sign in
}

export const userSlice = createSlice({
    //this is the name of the slice
    name: 'user',
    //this is the initial state of the slice or the global states
    initialState,
    //it contains functions to update the global states
    reducers: {
        //these functions will be called inside components to update the global states
        signInStart: (state) =>{
            state.loading = true;
            state.error = null;
        },
        signInSuccess: (state, action) =>{
            state.currentUser = action.payload; //payload contains user info from backend
            state.loading = false;
            state.error = null;
        },
        signInFailure: (state, action) =>{
            state.loading = false;
            state.error = action.payload;
        },
        finallyBlock: (state) =>{
            state.loading = false;
        }
    }
})

//this will allow us to dispatch the actions from the components.
// which means we can call these functions from any component to update the global states
export const {signInStart, signInSuccess, signInFailure, finallyBlock} = userSlice.actions;

//this will allow us to add this slice to the store
//it will export the reducer function that will be used in the store
//since this is a default export, we can give any name while importing
export default userSlice.reducer