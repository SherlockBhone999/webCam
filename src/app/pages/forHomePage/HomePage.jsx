
import Devices from "./Devices"
import GroupName from '../../components/GroupName'


import { useNavigate } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import { useContext } from "react"
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
            <div className=" p-1 flex justify-center ">
              <button className="bg-blue-300 w-20 h-20 rounded mr-1 ml-1"
                onClick={()=>{
                  setDeviceInfo(prevv => {
                    return { ...prevv, status : "sending"}
                  })
                  navigate("/sender")
                }}
              >
                <p>send</p>
              </button>
                
              <button className="bg-blue-300 w-20 h-20 rounded mr-1 ml-1"
                onClick={()=>{
                  setDeviceInfo(prevv => {
                    return {...prevv, status : "receiving"}
                  })
                  navigate("/receiver")
                }}
              >
                <p >receive</p>
              </button>
            </div>
          :
          <p className="p-1">cannot connect to server. Please wait 50seconds or more.</p>
          }
          <div className="flex-auto">
            <Devices />
          </div>
        
        
        </div>
      </motion.div>
    </AnimatePresence>
  )
}



export default function App () {

  return (
    <div className="w-screen h-screen bg-gray-200 flex flex-col">
      <GroupName /> 
      <div className="flex-auto">
        <Container />
      </div>
    </div>
  )
}