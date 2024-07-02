import { useEffect, useContext , useState } from "react"
import { useLocation } from "react-router-dom"
import { useIndexedDB } from './forSenderPage/indexedDB/useIndexedDB';
import { Context } from "../ContextProvider"


export default function App () {
  const location = useLocation()
  const { fetchFromFileDB, fileContent, error } = useIndexedDB();
  const { browserName } = useContext(Context)
  const [ id, setId ] = useState("")
  
  useEffect(()=>{
    const id = location.pathname?.substring(10)
    setId(id)
    fetchFromFileDB(id)
    
  },[location])
  
  useEffect( ()=>{
    if(fileContent && id ){
      download(id)
      if(browserName === "Chrome"){
        setTimeout(()=>{
          window.close()
        },100)
      }
    }
  },[fileContent,id])
  
  const download = (id) => {
    const type = fileContent?.type;
    const blob = fileContent?.blob;
    const blobUrl = URL.createObjectURL(blob)
    const link = document.createElement('a');
    link.href = blobUrl;
    if(type === "image"){
      link.download = `${id}_webCam.png`
    }else{
      link.download = `${id}_webCam`
    }
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link)
    
    setTimeout(()=>{
      //setTimeout will still run even after component dismounted
      URL.revokeObjectURL(blobUrl)
    },500)
    
  }
  
  


  
  return (
    <div>
      <p>file : {id}</p>
      <p>{fileContent?.blob.size}</p>
      <button onClick={()=>download(id)} className="bg-green-400 p-2 m-1 rounded">download</button>
      { error && <p>"indexedDB error :" {error}</p>
      }
  
    </div>
  )
}