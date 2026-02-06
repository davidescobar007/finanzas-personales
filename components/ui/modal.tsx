import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

const Modal = ({ isOpen, onClose, title, children, className }: ModalProps) => {
  const originalOverflowRef = React.useRef("");

  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  React.useEffect(() => {
    if (isOpen) {
      originalOverflowRef.current = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = originalOverflowRef.current || "auto";
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      <div
        className={cn(
          "relative z-[101] w-full max-w-md rounded-3xl bg-white shadow-2xl animate-in zoom-in-95 duration-300 slide-in-from-bottom-4 flex flex-col max-h-[85vh] border-2 border-gray-100",
          className
        )}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100 flex-shrink-0 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-3xl">
          <h2 className="text-xl font-bold text-gray-900 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white hover:shadow-md text-gray-500 hover:text-gray-700 transition-all duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">{children}</div>
      </div>
    </div>
  );
};

export { Modal };
