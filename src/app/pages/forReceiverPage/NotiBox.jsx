
import { ReactTyped } from "react-typed"
import { useState, useEffect, useContext, useRef } from "react"
import { Context } from "../../ContextProvider"


export default function App () {
  const [notiArr, setNotiArr] = useState([""])
  const { socket } = useContext(Context)
  
  useEffect(()=>{
    socket.on("displayFeedback", message => {
      const arr = [message, ""]
      setNotiArr(arr)
    })
    
  },[])
  
  const handleComplete = () => {
    setNotiArr([""])
  }
  
  
  return (
  <div className="">
    <div className="w-11/12 bg-blue-200 p-2 rounded-full relative"
    >
      <div className="w-full h-full bg-yellow-200 flex"
    
      > 
        <ReactTyped
          strings={notiArr}
          typeSpeed={10}
          backSpeed={10}
          showCursor={false}
          //loop
          onComplete={handleComplete}
        />          
      <p>_</p>
      </div>
      <div className="absolute top-0 right-0 w-1/12 h-full bg-blue-400" />
      <button onClick={()=>{
    
        setNotiArr(["Tablet saved a photo",""])
      
      }}>click</button>
    </div>
  </div>
  )
}