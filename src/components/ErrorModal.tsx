import React from 'react';
import { XCircle, X } from 'lucide-react';
import { RegistrationError } from '../types/auth';

interface ErrorModalProps {
    isOpen: boolean;
    onClose: () => void;
    error: RegistrationError | null;
}

const ErrorModal: React.FC<ErrorModalProps> = ({ isOpen, onClose, error }) => {
    if (!isOpen || !error) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            <div className="relative bg-[#1A1A1A] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="p-6">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                            <XCircle className="w-6 h-6 text-red-500" />
                        </div>

                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-white mb-2">
                                Registration Failed
                            </h3>

                            <p className="text-gray-300 mb-4">
                                {error.message || "An unexpected error occurred. Please try again."}
                            </p>

                            {error.details && error.details.length > 0 && (
                                <div className="bg-red-500/10 rounded-lg p-3 border border-red-500/20 mb-4">
                                    <ul className="text-sm text-red-400 list-disc list-inside space-y-1">
                                        {error.details.map((detail, index) => (
                                            <li key={index}>
                                                <span className="font-semibold">{detail.field}:</span> {detail.issue}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div className="flex justify-end">
                                <button
                                    onClick={onClose}
                                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                                >
                                    Dismiss
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ErrorModal;
