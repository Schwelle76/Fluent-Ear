import React from 'react';
import SettingsPanel from './SettingsPanel';
import './Sidebar.css';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'active' : ''}`} onClick={onClose}></div>

      <div className={`sidebar ${isOpen ? 'active' : ''}`}>
        <button className="close-button" onClick={onClose}>×</button>
        <SettingsPanel />
      </div>
    </>
  );
};

export default Sidebar;
