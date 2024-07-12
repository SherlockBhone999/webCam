import Device from "./Device"
import { useContext , useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Context } from "../../ContextProvider"


export default function App () {
  const { allDevices, deviceInfo } = useContext(Context)
  
  const navigate = useNavigate()
  


  
  return (
    <div className="w-full h-full flex">
      <div className="w-[10%]"/>
      <div className="w-4/5 overflow-scroll bg-gray-500 rounded">
        <button onClick={()=>navigate("/setting")} className="bg-sky-400 p-2 w-full flex ">
          <p className="text-white text-[25px] ">{deviceInfo.roomName}</p>
        </button>
        {allDevices.map((obj)=> 
          <Device data={obj}/>
        )}
      </div>
    </div>
  )
}