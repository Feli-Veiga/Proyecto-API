import axios from 'axios';
import { store } from '../store/store';



const api = axios.create({

baseURL:'http://localhost:8080',

timeout:10000,

withCredentials:false,

headers:{

'Content-Type':'application/json',

'Accept':'application/json'

}

});





api.interceptors.request.use(

(config)=>{


const token =
store.getState().auth.token;



if(token){

config.headers.Authorization =
`Bearer ${token}`;

}



return config;


},


(error)=>Promise.reject(error)

);





api.interceptors.response.use(

(response)=>response,


(error)=>{


if(error.response){


const status =
error.response.status;



if(status===401 || status===403){


localStorage.removeItem('token');

localStorage.removeItem('isAuthenticated');

localStorage.removeItem('userEmail');



if(window.location.pathname!='/login'){


window.location.href =
`/login?redirect=${encodeURIComponent(window.location.pathname)}`;

}


}

}


return Promise.reject(error);


}

);



export default api;