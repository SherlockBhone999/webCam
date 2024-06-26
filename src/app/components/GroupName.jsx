
import { useNavigate, useLocation } from "react-router-dom"
import { useEffect, useState, useContext } from "react"
import { Context } from "../ContextProvider"

export default function App () {
  const { deviceInfo} = useContext(Context)
  const navigate = useNavigate()
  const location = useLocation()
  
  const [ isBtnHidden, setIsBtnHidden ] = useState(true)
  
  useEffect(()=>{
    const str = localStorage.getItem("deviceInfo")
    if(str === null){
      setTimeout(()=>{
        navigate("/setting")
      },1000)
    }
    
    const p = location.pathname 
    if(p === "/"){
      setIsBtnHidden(false)
    }else{
      setIsBtnHidden(true)
    }
  },[location])
  
  return (
    <div className="bg-blue-400 m-1 p-2 rounded flex justify-between">
      <div className="flex-auto relative h-10">
        <button onClick={()=>navigate("/setting")} className="">
          <p className="text-lg">{deviceInfo.deviceName}</p>
          <div className="absolute bottom-0 left-7">
            <p className="text-xs">{deviceInfo.roomName}</p>
          </div>
        </button>
      </div>
      
      { !isBtnHidden &&
      <div className="">
          <button className="m-1 p-1 bg-blue-100"
            onClick={()=>navigate("/help")}
          >
            <p>help</p>
          </button>
          
          <button className="m-1 p-1 bg-blue-100"
            onClick={()=>navigate("/setting")}
          >
            <p>setting</p>
          </button>
          
      </div>
      }
    </div>
  )
}