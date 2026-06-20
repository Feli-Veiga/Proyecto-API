import React from 'react';
import {
BrowserRouter,
Routes,
Route,
Navigate
} from 'react-router-dom';


import Header from './components/layout/Header';
import Footer from './components/layout/Footer';


import Home from './pages/Home';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Login from './pages/Login';


import ProtectedRoute from './components/ProtectedRoute';
import CreateProduct from './pages/CreateProduct';


import './App.css';



function App(){


return (

<BrowserRouter>


<Header />


<main className="main-content">


<Routes>


<Route path="/" element={<Home/>}/>


<Route path="/products" element={<ProductList/>}/>


<Route path="/products/:id" element={<ProductDetail/>}/>


<Route

path="/cart"

element={

<ProtectedRoute>

<Cart/>

</ProtectedRoute>

}

/>



<Route path="/login" element={<Login/>}/>

<Route path="/crear-producto" element={
  <ProtectedRoute>
    <CreateProduct/>
  </ProtectedRoute>
}/>

<Route path="*" element={<Navigate to="/" replace/>}/>


</Routes>


</main>



<Footer />


</BrowserRouter>

);


}


export default App;