import React from "react";
import CloseIcon from "./icons/close";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed z-50 inset-0 bg-black bg-opacity-60 overflow-y-auto min-h-screen w-full flex justify-center items-center">
      <div className="p-5 relative border shadow-lg rounded-lg bg-white">
        <button
          onClick={onClose}
          className="absolute top-0 right-0 m-4 text-light-gray hover:text-light-blue transition-all duration-300"
        >
          <CloseIcon className="w-6 h-6" />
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
