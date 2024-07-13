
import { useNavigate } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useContext } from "react"
import { Context } from "../ContextProvider"

import { IoMdReturnLeft } from "react-icons/io";

import headCameraImg from "../../assets/headCam.png"

const Line = () => {
  return (
    <div>
      <p>_____________________________</p>
    </div>
  )
}


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

export default function App () {
  const navigate = useNavigate()
  const { setDeviceInfo } = useContext(Context)
  useEffect(()=>{
    if(location.pathname.includes("help")){
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
          <div className="flex justify-end">
            <button className="bg-blue-300 p-3 m-2 rounded"
              onClick={()=>navigate("/")}            >
              <IoMdReturnLeft />
            </button>
          </div>
          
          <p className="mb-4 text-lg font-bold pl-1">How this website works :</p>
          
          <p className="pl-2">It's like webcam. A device can access the camera of another device in the same Room.</p>
          
          <p className="pl-2">Choose between send and receive. Receiver device gets Camera stream from Sender device.</p>
          
          <Line />
          
          <p className="pl-2">Keep your room name private, so that other cannot send you their Camera stream</p>
          
          <Line />
          
          <p className="pl-2">To make it faster, files will be saved on Sender device. In Chrome browser, download will be initiated immediately after Camera captured. You can also do manual download. Make sure to clean up database regularly. </p>
          
          <Line />

          
          <p className="pl-2">Devices on the same network only consume minimum internet data</p>
          
          <Line />
          
          <p className="text-red-600 text-lg pl-2">Sometimes if you exit the Connection without closing properly, sending Camera stream might not work, just try a second time or refresh the page.</p>
          
          <Line />
          
          <div className="flex justify-center mt-2">
            <img src={headCameraImg} className="w-[200px] border-2 border-black rounded"/>
          </div>
        </motion.div>
    </AnimatePresence>
  )
}