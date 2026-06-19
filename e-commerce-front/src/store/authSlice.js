import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';


const tokenStorage = localStorage.getItem('token');

const initialState = {

  user: localStorage.getItem('userEmail')
    ? {
        email: localStorage.getItem('userEmail')
      }
    : null,


  token: tokenStorage || null,


  isAuthenticated: !!tokenStorage,


  loading:false,
  error:null
};




// LOGIN

export const loginUser = createAsyncThunk(
'auth/loginUser',

async(credentials,{rejectWithValue})=>{


try{

const response =
await api.post('/api/auth/login',credentials);



if(response.data?.token){

const token=response.data.token;


localStorage.setItem(
'token',
token
);

localStorage.setItem(
'isAuthenticated',
'true'
);


localStorage.setItem(
'userEmail',
credentials.email
);



return {

user:{
email:credentials.email
},

token

};


}


throw new Error();


}
catch(err){

return rejectWithValue(
err.response?.data?.message ||
'Credenciales inválidas'
);

}

});




// REGISTER

export const registerUser = createAsyncThunk(
'auth/registerUser',

async(userData,{dispatch,rejectWithValue})=>{


try{


const response =
await api.post('/api/usuarios',userData);



if(response.data){


const result =
await dispatch(
loginUser({
email:userData.email,
password:userData.password
})
);



if(loginUser.fulfilled.match(result)){

return result.payload;

}


return rejectWithValue(result.payload);

}


}
catch(err){

return rejectWithValue(
err.response?.data?.message ||
'Error registrando usuario'
);

}

});





const authSlice=createSlice({

name:'auth',

initialState,


reducers:{


logout:(state)=>{


localStorage.removeItem('token');
localStorage.removeItem('isAuthenticated');
localStorage.removeItem('userEmail');
localStorage.removeItem('carritoId');


state.user=null;
state.token=null;
state.isAuthenticated=false;
state.error=null;


},


clearAuthError:(state)=>{

state.error=null;

}

},



extraReducers:(builder)=>{


builder



.addCase(loginUser.pending,(state)=>{

state.loading=true;
state.error=null;

})


.addCase(loginUser.fulfilled,(state,action)=>{

state.loading=false;

state.isAuthenticated=true;

state.user=action.payload.user;

state.token=action.payload.token;


})


.addCase(loginUser.rejected,(state,action)=>{

state.loading=false;

state.error=action.payload;

})




// register


.addCase(registerUser.pending,(state)=>{

state.loading=true;
state.error=null;

})


.addCase(registerUser.fulfilled,(state,action)=>{

state.loading=false;


state.user=action.payload.user;

state.token=action.payload.token;

state.isAuthenticated=true;


})


.addCase(registerUser.rejected,(state,action)=>{

state.loading=false;

state.error=action.payload;

})


}

});




export const {
logout,
clearAuthError
}=authSlice.actions;



export default authSlice.reducer;