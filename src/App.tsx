import { v4 as uuidv4 } from 'uuid';
import { useState} from 'react';
import Modal from 'react-modal';

type Folder = {
    parentFolderId: string | null;
    childFolderId: string[];
    id: string;
    name: string;
}

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '30%',
    height: '30%',
    borderRadius: '20px'
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)'
  }
};

const App = () => {

  const [folders, setFolders] = useState<Folder[]>([
    {id:"root", parentFolderId:"", childFolderId:["1","2"], name:"Home"},
    {id:"1", parentFolderId:"root", childFolderId:["3"], name:"First Child 1"},
    {id:"2", parentFolderId:"root", childFolderId:[], name:"First Child 2"},
    {id:"3", parentFolderId:"1", childFolderId:[], name:"Child of First Child 1"}
  ]);
  const [currentFolderId, setCurrentFolderId] = useState<string>('root');
  const [newFolderName, setNewFolderName] = useState<string>('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState<Folder | null>(null);

  const handleFolderClick = (id: string) => {
    setCurrentFolderId(id);
  }

  const currentFolder = folders.find(folder => folder.id === currentFolderId);
  const childFolders = currentFolder ? folders.filter(folder => currentFolder.childFolderId.includes(folder.id)) : [];

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

  const getFolderPath = (folderId: string): Folder[] => {
    let path: Folder[] = [];
    let currentFolder = folders.find(folder => folder.id === folderId);
  
    while (currentFolder) {
      path = [currentFolder, ...path];
      currentFolder = folders.find(folder => folder.id === (currentFolder as Folder).parentFolderId);
    }
  
    return path;
  }

  const handleDelete = () => {
    if (folderToDelete) {
      const deleteFolderAndChildren = (folderId: string) => {
        const folder = folders.find(f => f.id === folderId);
        if (folder) {
          folder.childFolderId.forEach(deleteFolderAndChildren);
          setFolders(folders => folders.filter(f => f.id !== folderId));
        }
      };
      deleteFolderAndChildren(folderToDelete.id);
    }
    closeModal();
  };

  const openModal = (folder: Folder) => {
    setFolderToDelete(folder);
    setModalIsOpen(true);
  };
  
  const closeModal = () => {
    setModalIsOpen(false);
  };
  
  return (
    <div className="grid grid-cols-1 mt-10 max-w-4xl mx-auto">

      <div className="flex justify-items-center p-2 w-2/4 m-auto shadow-sm justify-center content-center mt-5 border-2 rounded">
      <input className='rounded text-center mx-auto' type="text" value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)} placeholder="New Folder Name" />
        <button className='m-auto shadow-md hover:text-white hover:scale-110 transition duration-150 hover:bg-blue-400 rounded p-2' onClick={handleAddFolder}>Add Folder</button>
      </div>

      <div className="flex justify-items-center p-2 shadow-sm w-auto justify-center content-center mt-5 border-2 rounded">
      {getFolderPath(currentFolderId).map((folder, index, array) => (
        <span key={folder.id}>
          <button className='m-auto shadow-md hover:text-white hover:scale-110 transition duration-150 hover:bg-blue-400 rounded p-2' onClick={() => handleFolderClick(folder.id)}>{folder.name}</button>
          {index < array.length - 1 && ' / '}
        </span>
      ))}
      </div>

      <div className="p-1 min-h-10 min-w-20 mt-5 grid grid-cols-3 shadow-sm border-2 rounded" style={{
        gap: "1rem"
      }}>

        {childFolders.map(folder => (
          <div className='p-2 justify-items-center m-2 border-1 shadow-md hover:scale-105 transition duration-300 justify-between flex rounded' key={folder.id} onClick={() => handleFolderClick(folder.id)}>
            <div className='flex gap-2'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
</svg>

            {folder.name}
            </div>
            
            <button className='float-right border-red-600 border-2 p-2 rounded hover:scale-105 transition duration-150 hover:bg-red-600 hover:text-white' onClick={(e) => {e.stopPropagation(); openModal(folder);}}>Delete</button>
          </div>
        ))}

        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Delete Folder Confirmation"
          style={customStyles}
        >
          <h2>Are you sure you want to delete this folder and all its contents?</h2>
          <div style={{ display: 'flex', gap: '5rem', justifyContent:'center', marginTop: '20px' }}>
            <button style={{ padding: '12px', borderRadius: '5px', backgroundColor: 'blue', color: 'white' }} onClick={closeModal}>No</button>
            <button style={{ padding: '10px', borderRadius: '5px', backgroundColor: 'red', color: 'white' }} onClick={handleDelete}>Yes</button>
          </div>
        </Modal>
      </div>

    </div>
  );
}

export default App