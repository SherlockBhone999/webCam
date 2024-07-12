import Navbar from "../../components/Navbar"
import { useNavigate, useLocation } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useContext } from "react"
import { ReactTyped } from "react-typed"
import Devices from "./Devices"
import { Context } from "../../ContextProvider"
import Camera from "./Camera"

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

function App () {
  const navigate = useNavigate()
  const { deviceInfo } = useContext(Context)
  return (
    <AnimatePresence>
        <motion.div className="w-full h-full "
          initial = "initial"
          animate = "animate"
          //exit = "exit"
          variants = {pageVariants2}
          transition={pageTransition2}
        >
            <div className="w-full h-full flex flex-col relative">
              <div className="absolute top-0 right-0">
                <button className="bg-gray-200 m-1 p-2 rounded border-2 border-black mr-2" 
                  onClick={()=>navigate("/")}
                  >
                  <IoMdReturnLeft />
                </button>
              </div>
              
              <div className="h-1/5 w-full flex justify-center items-center">
                <div>
                  <div className="flex">
                    <p className="mr-1 text-cyan-400 text-lg"> camera streaming    </p>
                    <ReactTyped
                      strings={[" ",' . ', " . . ", ' . . . ']}
                      typeSpeed={40}
                      backSpeed={50}
                      showCursor={false}
                      loop
                      className="text-cyan-400 text-lg"
                    />   
                  </div>
                  { deviceInfo.peerId === "" && <p className="text-black"> peer server not connected</p> }
                </div>
              </div>
              
              
              <div className="flex-auto  overflow-scroll p-1 pl-3">
                
                <Devices />
              </div>
              

            </div>
            
            <div className="fixed bottom-5 left-5">
              <Camera />
            </div>
            
          
        </motion.div>
    </AnimatePresence>
  )
}

export default function App2 (){
  const { setDeviceInfo } = useContext(Context)
  const location = useLocation()
  
  useEffect(()=>{
    if(location.pathname.includes("sender")){
      setDeviceInfo(prevv => {
        return {
          ...prevv,
          status : "sending"
        }
      })
    }
  },[location])
  
  return (
    <div className="w-screen h-screen flex flex-col bg-gray-700">
      <Navbar />
      <div className="flex-auto">
        <App />
      </div>
    </div>
  )
}