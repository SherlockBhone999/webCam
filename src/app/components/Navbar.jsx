
import { useNavigate } from "react-router-dom"
import { useEffect, useState, useContext, useRef } from "react"
import { Context } from "../ContextProvider"

import { MdHelpCenter } from "react-icons/md";
import { FaDatabase } from "react-icons/fa6";

export default function App () {
  const { deviceInfo, shortName, keys} = useContext(Context)
  const navigate = useNavigate()

  useEffect(()=>{
    const str = localStorage.getItem("deviceInfo")
    if(str === null){
      setTimeout(()=>{
        navigate("/setting")
      },1000)
    }
    
  },[])
  

  return (
    <div className=" p-2 rounded flex justify-between">
      <div className="flex-auto relative h-10">
        <button onClick={()=>navigate("/setting")} className="border-2 pl-2 pr-2 pt-1 pb-1 rounded-full bg-black border-gray-400 mt-1">
          <p className="text-sm text-white text-blue-200">{shortName}</p>
        </button>
      </div>
      
    
      <div className="">
          <button className="m-1 p-2 bg-blue-100 rounded-lg"
            onClick={()=>navigate("/help")}
          >
            <MdHelpCenter />
          </button>
          
          <button className="m-1 p-2 bg-blue-100 relative rounded-lg"
            onClick={()=>navigate("/setting")}
          > 
            <div className="flex">
              <FaDatabase className=""/>
              { keys.length > 0 &&
              <div className="absolute bg-red-600 scale-75 bottom-0 right-0 w-[50%] rounded text-white">
                <p>{keys.length}</p>
              </div>
              }
            </div>
          </button>
          
      </div>
      
    </div>
  )
}