import { AlertCircle, AlertTriangle, CheckCircle } from "lucide-react";

/**
 * Reusable confirmation modal component for actions that need confirmation
 */
const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = "Confirm", 
  cancelText = "Cancel",
  type = "default" // default, danger, success
}) => {
  if (!isOpen) return null;
  
  // Modal type styling
  const iconColor = type === "danger" ? "text-red-500" : 
                   type === "success" ? "text-green-500" : 
                   "text-blue-500";
                   
  const confirmButtonStyle = type === "danger" ? 
    "bg-red-600 hover:bg-red-700" : 
    type === "success" ? 
    "bg-green-600 hover:bg-green-700" : 
    "bg-blue-600 hover:bg-blue-700";
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div 
        className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4 sm:mx-0"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start mb-4 gap-4">
          {type === "danger" ? (
            <AlertTriangle className={`h-6 w-6 ${iconColor} flex-shrink-0`} />
          ) : type === "success" ? (
            <CheckCircle className={`h-6 w-6 ${iconColor} flex-shrink-0`} /> 
          ) : (
            <AlertCircle className={`h-6 w-6 ${iconColor} flex-shrink-0`} />
          )}
          
          <div>
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            <p className="text-gray-600 mt-1">{message}</p>
          </div>
        </div>
        
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2 text-white rounded ${confirmButtonStyle} transition-colors`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;