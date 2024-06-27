import { useEffect } from "react"
import { useLocation } from "react-router-dom"
import { useIndexedDB } from './forSenderPage/indexedDB/useIndexedDB';


import { format } from 'date-fns';


export default function App () {
  const location = useLocation()
  const { fetchFromFileDB, fileContent, error, deleteItemInDB } = useIndexedDB();
  
  useEffect(()=>{
    const id = location.pathname.substring(10)
    fetchFromFileDB(id)
  },[])
  
  useEffect(()=>{
    const id = location.pathname.substring(10)
    if(fileContent){
      download()
      
      setTimeout(()=>{
        deleteItemInDB(id)
        window.close()
      },20)
    }
  },[fileContent])
  
  const generateFilename = () => {
    const now = new Date();
    const formattedDate = format(now, 'hh-mm_dd-MM-yyyy');
    return `${formattedDate}_webCam`;
  };
  
  const download = () => {
    const type = fileContent.type;
    const blobUrl = fileContent.blobUrl
    const link = document.createElement('a');
    link.href = blobUrl;
    if(type === "image"){
      link.download = `${generateFilename()}.png`
    }else{
      link.download = `${generateFilename()}`
    }
    document.body.appendChild(link);
    link.click();
    link.remove();
    
  }
  
  


  
  return (
    <div>
      <p>downloading...</p>
      <button onClick={download}>download</button>
      { error && <p>"indexedDB error :" {error}</p>
      }
  
    </div>
  )
}