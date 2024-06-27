import Device from "./Device"

import { Context } from '../../ContextProvider'
import { useContext, useState, useEffect , useRef } from "react"
import { AnimatePresence, motion } from "framer-motion"

const pageVariants = {
  initial : { opacity : 0, scale : 1, y : "5%" },
  animate : { opacity : 1, scale : 1, y : "0%" } ,
  exit :{ opacity : 0, scale : 0.5 }
}

const pageTransition = {
  type: "spring",
  ease: "easeOut",
  duration: 0.25,
}


export default function Devices(){
  const { allDevices } = useContext(Context)
  const [ sendingDevices, setSendingDevices ] = useState([])
  const [ isActive, setIsActive] = useState(true)
  const [doAnimation, setDoAnimation] = useState(true)
  
  useEffect(()=>{
    
    
    const arr = []
    allDevices.map(obj => {
      if(obj.status === "sending" ){
        arr.push(obj)
      }
    })
    setSendingDevices(arr)
    
  },[allDevices])
  
  

  useEffect(()=>{
    if(doAnimation){
      setIsActive(false)
      setTimeout(()=>{
        setIsActive(true)
      },500)
    }
  },[sendingDevices, doAnimation])
    
  
  return (
    <AnimatePresence>
      { isActive &&
        <motion.div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 m-2"
          initial = "initial"
          animate = "animate"
          exit = "exit"
          variants = {pageVariants}
          transition={pageTransition}    
        >
          { sendingDevices.length === 0 &&
            <p>Waiting for video streams...</p>
          }
          { sendingDevices.map((obj,index) => 
            <Device
              data={obj}
              index={index}
              sendingDevices={sendingDevices}
              setSendingDevices={setSendingDevices}
              setDoAnimation={setDoAnimation}
            />
          )}

        </motion.div>
      }
    </AnimatePresence>
  )
}
