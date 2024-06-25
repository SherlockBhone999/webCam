// src/useIndexedDB.js


import { useState, useCallback } from 'react';
import { saveFile, getFile , deleteFile, countFiles, getAllKeys, clearAllItems } from './indexedDB';

export function useIndexedDB() {
  const [error, setError] = useState(null);
  const [fileContent, setFileContent] = useState(null);
  const [filesCount, setFilesCount ] = useState(null)
  const [keys, setKeys] = useState([])

  const saveToFileDB = useCallback(async (file,id) => {
    try {
      const message = await saveFile(file,id);
      console.log(message);
    } catch (err) {
      console.error('Error saving file:', err);
      setError(err.message || 'Error saving file');
    }
  }, []);

  const fetchFromFileDB = useCallback(async (id) => {
    try {
      const item = await getFile(id);
      //const content = data.content;
      setFileContent(item);
    } catch (err) {
      console.error('Error fetching file:', err);
      setError(err.message || 'Error fetching file');
    }
  }, []);
  
  const getFilesCount = useCallback( async () => {
    try {
      const count = await countFiles()
      setFilesCount(count)
    } catch (err) {
      console.error("Error counting files :", err )
      setError(err.message || "Error counting files")
    }
  } , [] );
  
  const deleteItemInDB = useCallback(async (id) => {
    try {
      const message = await deleteFile(id)
      console.log(message)
    } catch (err) {
      console.error('Error deleting file:', err);
      setError(err.message || 'Error deleting file');
    }
  }, []);
  
  const getAllIds = useCallback( async () => {
    try {
      const arr = await getAllKeys()
      setKeys(arr)
    } catch (err) {
      console.error("Error getting files ids :", err )
      setError(err.message || "Error getting files ids")
    }
  } , [] );
  
  const clearDB = useCallback( async () => {
    try {
      const message = await clearAllItems()
      console.log(message)
    } catch (err) {
      console.error("Error clearing dB :", err )
      setError(err.message || "Error clearing dB")
    }
  } , [] );

  return { saveToFileDB, fetchFromFileDB, fileContent, error, getFilesCount, deleteItemInDB, filesCount, getAllIds , keys, clearDB };
}





