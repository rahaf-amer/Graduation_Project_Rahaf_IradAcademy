
import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from './login';
import Register from './register';
import Posts from './posts';
import SubmitPost from './submitPost';
import PostDetails from './postDetails';
import Footer from './footer';



function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/posts/:id" element={<PostDetails />} />
        <Route path="/submitPost" element={<SubmitPost />} />
        
      </Routes>
     
    </BrowserRouter>
    
    

  );

}

export default App;
