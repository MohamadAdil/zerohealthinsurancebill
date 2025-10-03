// src/context/UIContext.js
import { createContext, useContext, useState, useCallback } from 'react';
import Modal from '@/components/ui/Modal';
import { toast } from 'react-toastify';

const UIContext = createContext();

export const UIProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  const showToast = useCallback((message, type = 'info') => {
    toast[type](message);
  }, []);
  const showLoading = useCallback(() => {
    setIsLoading(true);
  }, []);
  const hideLoading = useCallback(() => {
    setIsLoading(false);
  }, []);
  const openModal = useCallback((content) => {
    setModalContent(content);
    setIsModalOpen(true);
  }, []);
  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setModalContent(null);
  }, []);
  const contextValue = {
    isLoading,
    isModalOpen,
    modalContent,
    showLoading,
    hideLoading,
    showToast, // Replaces showMessage with more robust toast functionality
    openModal,
    closeModal,
  };
  return (
    <UIContext.Provider value={contextValue}>
      {children}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {modalContent}
      </Modal>
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};