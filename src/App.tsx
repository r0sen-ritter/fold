import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

type Folder = {
  parentFolderId: string | null;
  subFolders: { [key: string]: string };
  id: string;
  name: string;
};

type FolderProps = {
  folder: Folder;
  onFolderClick: (folder: Folder) => void;
  folders: { [key: string]: Folder };
  currentFolderId: string;
};

const Folder: React.FC<FolderProps> = ({ folder, onFolderClick, folders, currentFolderId }) => {
  const handleFolderClick = () => {
    onFolderClick(folder);
  };

  return (
    <div>
      {folder.id !== currentFolderId && <div onClick={handleFolderClick}>{folder.name}</div>}
      <div>
        {Object.keys(folder.subFolders)
          .filter((subFolderId) => folders[subFolderId].parentFolderId === currentFolderId)
          .map((subFolderId) => (
            <Folder key={subFolderId} folder={folders[subFolderId]} onFolderClick={onFolderClick} folders={folders} currentFolderId={currentFolderId} />
          ))}
      </div>
    </div>
  );
};

const App = () => {
  const rootFolder: Folder = {
    parentFolderId: null,
    subFolders: {},
    id: 'root',
    name: 'root',
  };

  const [folders, setFolders] = useState<{ [key: string]: Folder }>({ root: rootFolder });
  const [currentFolderId, setCurrentFolderId] = useState<string>('root');
  const [history, setHistory] = useState<string[]>(['root']);

  const addFolder = (parentFolderId: string, name: string) => {
    const newFolder: Folder = {
      parentFolderId,
      subFolders: {},
      id: uuidv4(),
      name,
    };

    setFolders(prevFolders => {
      const updatedFolders = { ...prevFolders };
      updatedFolders[parentFolderId].subFolders = { ...updatedFolders[parentFolderId].subFolders, [newFolder.id]: newFolder.id };
      updatedFolders[newFolder.id] = newFolder;
      return updatedFolders;
    });
  };

  const handleFolderClick = (folder: Folder) => {
    setCurrentFolderId(folder.id);
    setHistory(prevHistory => [...prevHistory, folder.id]);
  };

  const handleBackClick = () => {
    if (history.length > 1) {
      setHistory(prevHistory => {
        const newHistory = [...prevHistory];
        newHistory.pop();
        return newHistory;
      });
      setCurrentFolderId(history[history.length - 2]);
    }
  };

  const handleAddFolder = () => {
    const name = window.prompt('Enter folder name');
    if (name) {
      addFolder(currentFolderId, name);
    }
  };

  const handlePathClick = (folderId: string) => {
    const folderIndex = history.indexOf(folderId);
    if (folderIndex !== -1) {
      setHistory(prevHistory => prevHistory.slice(0, folderIndex + 1));
      setCurrentFolderId(folderId);
    }
  };

  return (
    <div className="grid justify-items-center justify-center content-center mt-10">

      <div className="flex justify-items-center justify-center content-center mt-5 border-blue-500 border-2">
        {history.map((folderId, index) => (
          <React.Fragment key={folderId}>
            <div onClick={() => handlePathClick(folderId)}>{folders[folderId].name}</div>
            {index < history.length - 1 && ' / '}
          </React.Fragment>
        ))}
      </div>
      
      <div className="flex justify-items-center justify-center content-center mt-5 mb-5">
        <button onClick={handleBackClick}>Upper Folder</button>
      </div>

      <div className="flex justify-items-center justify-center content-center mt-5">
        <Folder folder={folders[currentFolderId]} onFolderClick={handleFolderClick} folders={folders} currentFolderId={currentFolderId} />
      </div>

      <div className="flex justify-items-center justify-center content-center mt-5">
        <button onClick={handleAddFolder}>Add Folder</button>
      </div>

    </div>
  );
};

export default App;