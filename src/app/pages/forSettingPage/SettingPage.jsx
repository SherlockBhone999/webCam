
import DeviceInfo from "./DeviceInfo"
import DBItems from "./DBItems"
import { useNavigate, useLocation } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import React, { useEffect, useState , useContext } from 'react';
import { Context } from "../../ContextProvider"

import { IoMdReturnLeft } from "react-icons/io";


const pageVariants2 = {
  initial : { opacity : 0, scale : 0.9 },
  animate : { opacity : 1, scale : 1 } ,
  exit :{ opacity : 0, scale : 0.5 }
}

const pageTransition2 = {
  type: "spring",
  ease: "easeOut",
  duration: 0.2,
}

import { useIndexedDB } from '../forSenderPage/indexedDB/useIndexedDB';



export default function App () {
  const navigate = useNavigate()
  const location = useLocation()
  const { setDeviceInfo } = useContext(Context)
  
  useEffect(()=>{
    if(location.pathname.includes("setting")){
      setDeviceInfo(prevv => {
        return {...prevv,
          status : "",
        }
      })
    }
  },[location])
  
  return (
    <AnimatePresence>
        <motion.div className="w-screen h-screen bg-gray-200"
          initial = "initial"
          animate = "animate"
          exit = "exit"
          variants = {pageVariants2}
          transition={pageTransition2}
        >
          <div className="flex justify-end bg-green-50">
            <button className="bg-blue-200 p-2 m-1 rounded border-2 border-black"
              onClick={()=>navigate(-1)}
            >
              <IoMdReturnLeft />
            </button>
          </div>
          
          <DeviceInfo />
          
          <DBItems />
          
        </motion.div>
    </AnimatePresence>
  )
}