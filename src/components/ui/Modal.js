// src/components/ui/Modal.js
import React from 'react';

/**
 * Reusable Modal component.
 * @param {boolean} isOpen - Controls the visibility of the modal.
 * @param {function} onClose - Function to call when the modal needs to be closed.
 * @param {React.ReactNode} children - The content to display inside the modal.
 */
function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null; // Don't render if not open

  return (
    <div className="fixed inset-0 bg-[#00000040] bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 relative transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full max-h-[90vh] overflow-y-auto">
      
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors duration-200"
        aria-label="Close modal"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
  
      {/* Modal Content */}
      <div className="mt-2">
        {children}
      </div>
  
    </div>
  </div>
  );
}

export default Modal;