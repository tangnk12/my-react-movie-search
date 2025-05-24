import { useState } from 'react'
import { useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'


const Card=({title})=>{
   const [hasLiked, setHasLiked]=useState(false);
   const [count,setCount]=useState(0);

   useEffect(()=>{
 console.log(`${title} has been liked: ${hasLiked}`);
   },[hasLiked]);

  //  useEffect(()=>{
  //   console.log('Card Render')
  //  });

  return(
    <div className="card" onClick={()=>setCount(count+1)} >
       {/* <div className="card" onClick={(prevState)=>setCount(prevState+1)} ></div> */}
      <h2>{title}<br/>{count||null}</h2>
      <button onClick={()=>setHasLiked(!hasLiked)}>
        {hasLiked?'Liked':'Like'}
      </button>
    </div>
  )
  // setHasLiked()=>{

  // }

}

const App =() =>{
 
  // const [hasLiked, setHasLiked]=useState(false);
  return (
  <div className="card-container">
    
     <Card title="Star Wars" rating ={5} isCool={true} ></Card>
     <Card title="Avatar"></Card>
     <Card title="The Lion King"></Card>
    
  </div>
  )
}




export default App
