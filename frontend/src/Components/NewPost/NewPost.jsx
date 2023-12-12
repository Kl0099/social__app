import React, { useEffect, useState } from 'react'
import {useDispatch, useSelector} from "react-redux"
import './newpost.css'
import {Button } from "@mui/material"
import {Typography} from "@mui/material"
import { useAlert } from 'react-alert'
import { createNewPost } from '../../Actions/Post'
import { loadUser } from '../../Actions/User'


const NewPost = () => {
	const [image,setImage] = useState(null)
	const [caption,setCaption] = useState("")
	const { loading,error ,message} = useSelector((state)=>state.like)
	const dispatch = useDispatch();
	const alert = useAlert();
	const handleImageChange = (e)=>{
		const file = e.target.files[0];
		const Reader = new FileReader();
		Reader.readAsDataURL(file);
		Reader.onload = ()=>{
			if(Reader.readyState === 2){
				setImage(Reader.result);
			}
		}
	
		
	}
	const submithandler = async (e)=>{
		e.preventDefault();
	await	dispatch(createNewPost(caption,image));
		dispatch(loadUser());
	}

	useEffect(()=>{
		if(error){
			alert.error(error);
			dispatch({type : "clearError"});
		  }
		  if(message){
			alert.success(message);
			dispatch({type : "clearMessages"});
		  }


	},[dispatch , error , message , alert])
  return (
	<div className='newPost'>
		<form  className='newPostForm' onSubmit={submithandler}>
		<Typography>New Post form</Typography>
		{
			image && <img src={image} alt="post" />
		}
		<input type="file" accept='image/*' onChange={handleImageChange}/>
		<input type="text" placeholder='caption......'
		value={caption}
		onChange={(e)=>setCaption(e.target.value)}
		/>
		<Button disabled={loading} type='submit'>Post</Button>
			
		</form>

	</div>
  )
}

export default NewPost