import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import Header from "../Header";
import { X } from "lucide-react";

type Props = {
    children: React.ReactNode;
    isOpen: boolean;
    onClose: () => void;
    name: string;
    headerRight?: React.ReactNode;
    hideClose?: boolean;
    hideHeader?: boolean;
};

const Modal = ({ children, isOpen, onClose, name, headerRight, hideClose, hideHeader }: Props) => {
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div 
            className="fixed inset-0 z-50 flex h-full w-full items-center justify-center overflow-y-auto bg-black/40 backdrop-blur-sm p-4 animate-fade-in"
            onClick={onClose}
        >
            <div 
                className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-lg bg-white shadow-lg dark:bg-dark-secondary animate-scale-in"
                onClick={(e) => e.stopPropagation()}
            >
                {!hideHeader && (
                    <div className="flex-shrink-0 px-4 py-3 border-b border-gray-200 dark:border-stroke-dark">
                        <Header
                            name={name}
                            buttonComponent={
                                <div className="flex items-center gap-2">
                                    {headerRight}
                                    {!hideClose && (
                                        <button
                                            className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-800 text-white hover:bg-gray-700 dark:bg-white dark:text-gray-800 dark:hover:bg-gray-200"
                                            onClick={onClose}
                                        >
                                            <X size={18} />
                                        </button>
                                    )}
                                </div>
                            }
                            isSmallText
                        />
                    </div>
                )}
                <div className="flex-1 overflow-y-auto p-4">
                    {children}
                </div>
            </div>
        </div>,
        document.body,
    );
};

export default Modal;
