
import Devices from "./Devices"
import Navbar from '../../components/Navbar'

import { GrSend } from "react-icons/gr";
import { MdCallReceived } from "react-icons/md";


import { useNavigate, useLocation } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import { useContext , useEffect } from "react"
import { Context } from "../../ContextProvider"

const pageVariants = {
  initial : { opacity : 0, scale : 1, y : "5%" },
  animate : { opacity : 1, scale : 1, y : "0%" } ,
  exit :{ opacity : 0, scale : 0.5 }
}

const pageTransition = {
  type: "spring",
  ease: "easeOut",
  duration: 0.2,
}


const Container = () => {
  const { deviceInfo, setDeviceInfo } = useContext(Context)
  const navigate = useNavigate()

  return (
    <AnimatePresence>
      <motion.div 
        initial = "initial"
        animate = "animate"
        exit = "exit"
        variants = {pageVariants}
        transition={pageTransition}
        className="w-full h-full"
      >
        <div className="w-full h-full flex flex-col justify-between ">

          { deviceInfo?.socketId ?
            <div className=" p-1 flex justify-center items-center">
              
              <div className="">
                <button className="bg-blue-300 rounded mr-1 ml-1 p-4"
                  onClick={()=>{
                    navigate("/sender")
                  }}
                >
                  <GrSend className="scale-[200%]"/>
  
                </button>
                <p className="flex justify-center text-sky-200 text-xs"> send </p>
              </div>
              
              <div>
                <button className="bg-blue-300 rounded mr-1 ml-1 p-4 "
                  onClick={()=>{
                    navigate("/receiver")
                  }}
                >
                  <MdCallReceived className="scale-[200%]"/>
                </button>
                <p className="flex justify-center text-sky-200 text-xs">receive</p>
              </div>
            </div>
          :
          <p className="p-1 text-white">cannot connect to server. Please wait 50 seconds or more.</p>
          }
          <div className="h-[5%]"/>
          <div className="flex-auto">
            <Devices />
          </div>
          <div className="h-5" />
        
        </div>
      </motion.div>
    </AnimatePresence>
  )
}



export default function App () {
  const location = useLocation()
  const { setDeviceInfo } = useContext(Context)
  
  useEffect(()=>{
    if(location.pathname === "/"){
      setDeviceInfo(prevv => {
        return {
          ...prevv,
          status : ""
        }
      })
    }
  },[location])
  return (
    <div className="w-screen h-screen bg-gray-700 flex flex-col">
      <Navbar /> 
      <div className="h-[10%]"/>
      <div className="flex-auto ">
        <Container />
      </div>
    </div>
  )
}