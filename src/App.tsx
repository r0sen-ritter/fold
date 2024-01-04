import { v4 as uuidv4 } from 'uuid';
import { useState } from 'react';

type Folder = {
    parentFolderId: string | null;
    childFolderId: string[];
    id: string;
    name: string;
}

const App = () => {
  const [folders, setFolders] = useState<Folder[]>([
    {id:"root", parentFolderId:"", childFolderId:["1","2"], name:"Home"},
    {id:"1", parentFolderId:"root", childFolderId:["3"], name:"b"},
    {id:"2", parentFolderId:"root", childFolderId:[], name:"c"},
    {id:"3", parentFolderId:"1", childFolderId:[], name:"d"}
  ]);
  const [currentFolderId, setCurrentFolderId] = useState<string>('root');
  const [newFolderName, setNewFolderName] = useState<string>('');

  const handleAddFolder = () => {
    if (newFolderName.trim() !== '') {
      const newFolder: Folder = {
        id: uuidv4(),
        parentFolderId: currentFolderId,
        childFolderId: [],
        name: newFolderName
      };
      const updatedFolders = folders.map(folder => 
        folder.id === currentFolderId 
          ? {...folder, childFolderId: [...folder.childFolderId, newFolder.id]} 
          : folder
      );
      setFolders([...updatedFolders, newFolder]);
      setNewFolderName(''); 
    }
  }

  const handleFolderClick = (id: string) => {
    setCurrentFolderId(id);
  }

  const getFolderPath = (folderId: string): Folder[] => {
    let path: Folder[] = [];
    let currentFolder = folders.find(folder => folder.id === folderId);
  
    while (currentFolder) {
      path = [currentFolder, ...path];
      currentFolder = folders.find(folder => folder.id === (currentFolder as Folder).parentFolderId);
    }
  
    return path;
  }

  const currentFolder = folders.find(folder => folder.id === currentFolderId);
  const childFolders = currentFolder ? folders.filter(folder => currentFolder.childFolderId.includes(folder.id)) : [];

  return (
    <div className="grid grid-cols-1 mt-10 max-w-4xl mx-auto">

      <div className="flex justify-items-center p-2 w-2/4 m-auto bg-blue-500 justify-center content-center mt-5 border-blue-500 border-2 rounded">
      <input className='rounded' type="text" value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)} placeholder="      New Folder Name" />
        <button className='m-auto border-black p-2' onClick={handleAddFolder}>Add Folder</button>
      </div>

      <div className="flex justify-items-center p-2 bg-blue-200 w-auto justify-center content-center mt-5 border-2 rounded">
      {getFolderPath(currentFolderId).map((folder, index, array) => (
        <span key={folder.id}>
          <button onClick={() => handleFolderClick(folder.id)}>{folder.name}</button>
          {index < array.length - 1 && ' / '}
        </span>
      ))}
      </div>

      <div className="p-1 min-h-10 min-w-20 mt-5 grid grid-cols-3 border-blue-500 border-2 rounded" style={{
        gap: "1rem"
      }}>
        
        {childFolders.map(folder => (
          <div className='p-2 justify-items-center m-2 border-blue-500 border-2 rounded' key={folder.id} onClick={() => handleFolderClick(folder.id)}>
            {folder.name}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App