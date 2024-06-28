
import GroupName from "../../components/GroupName"
import Devices from "./Devices"
import NotiBox from "./NotiBox"

import Camera from "../forSenderPage/Camera"

import { useNavigate, useLocation } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import { useState, useEffect, useContext } from "react"
import { Context } from "../../ContextProvider"


const pageVariants2 = {
  initial : { opacity : 0, scale : 0.9 },
  animate : { opacity : 1, scale : 1 } ,
  exit :{ opacity : 0, scale : 0.5 }
}

const pageTransition2 = {
  type: "spring",
  ease: "easeOut",
  duration: 0.5,
}

function App () {
  const navigate = useNavigate()
  
  return (
    <AnimatePresence>
  
        <motion.div className="w-full h-full flex flex-col"
        initial = "initial"
        animate = "animate"
        exit = "exit"
        variants = {pageVariants2}
        transition={pageTransition2}
        >
          
          <div className="flex-auto bg-gray-400">
            <div className="w-full h-full flex flex-col pb-1">
              <div className="flex justify-between">
                <div className="flex-auto m-1">
                  <NotiBox />
                </div>
                
                <button className="m-1 p-2 bg-gray-300 rounded"
                  onClick={()=>navigate("/")}                >
                  Back
                </button>
              </div>
              
              <div className="flex-auto bg-yellow-50 overflow-scroll ml-1 mr-1">
                <Devices />
              </div>
              
            </div>
          </div>
          
          
        </motion.div>
      
    </AnimatePresence>
  )
}

export default function App2 (){
  const { setDeviceInfo } = useContext(Context)
  const location = useLocation()
  
  useEffect(()=>{
    if(location.pathname.includes("receiver")){
      setDeviceInfo(prevv => {
        return {
          ...prevv,
          status : "receiving"
        }
      })
    }
  },[location])
  
  return (
    <div className="w-screen h-screen flex flex-col">
      <GroupName />
      <div className="flex-auto">
        <App />
      </div>
      
      <div className="fixed bottom-10 left-10">
        <Camera />
      </div>

    </div>
  )
}