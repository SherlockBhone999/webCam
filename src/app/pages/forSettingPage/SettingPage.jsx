//initial setup

import DeviceInfo from "./DeviceInfo"
import { useNavigate } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import React, { useEffect, useState } from 'react';

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
            <button className="bg-blue-400 p-2 m-1 rounded"
              onClick={()=>navigate("/")}
            >
              Back
            </button>
          </div>

          <DeviceInfo />
    
        </motion.div>
    </AnimatePresence>
  )
}