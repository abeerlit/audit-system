import React, { useEffect, useState } from "react";
import CloseIcon from "./icons/close";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  const [animateModal, setAnimateModal] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setAnimateModal(true);
    } else {
      setAnimateModal(false);
    }
  }, [isOpen]);

  return (
    isOpen && (
      <div
        className="fixed z-50 inset-0 bg-black bg-opacity-50 overflow-y-auto min-h-screen w-full flex justify-center items-center"
      >
        <div
          className={`p-5 relative border shadow-lg rounded-lg bg-white transition-all duration-500 linear 
            ${animateModal ? " opacity-100" : " opacity-0"}
          `}
        >
          <button
            onClick={onClose}
            className="absolute top-0 right-0 m-4 text-light-gray hover:text-light-blue transition-colors duration-300"
          >
            <CloseIcon className="w-6 h-6" />
          </button>
          {children}
        </div>
      </div>
    )
  );
};

export default Modal;
