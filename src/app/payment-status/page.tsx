'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, XCircle, Home, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const StatusContent = () => {
    const searchParams = useSearchParams();
    const status = searchParams.get('status');
    const message = searchParams.get('message');
    const transactionId = searchParams.get('transactionId');

    const isSuccess = status === 'success';

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-20 pointer-events-none">
                <div className={`absolute top-1/4 left-10 w-96 h-96 ${isSuccess ? 'bg-green-600' : 'bg-red-600'} rounded-full blur-[150px]`}></div>
                <div className={`absolute bottom-1/4 right-10 w-96 h-96 ${isSuccess ? 'bg-blue-600' : 'bg-orange-600'} rounded-full blur-[150px]`}></div>
            </div>

            <div className="max-w-md w-full glass-panel p-8 rounded-[2rem] border border-white/10 relative z-10 text-center animate-in zoom-in-95 duration-500">
                <div className="mb-6 flex justify-center">
                    {isSuccess ? (
                        <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center animate-bounce">
                            <CheckCircle className="w-10 h-10 text-green-500" />
                        </div>
                    ) : (
                        <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center animate-shake">
                            <XCircle className="w-10 h-10 text-red-500" />
                        </div>
                    )}
                </div>

                <h2 className="text-3xl font-black text-white mb-2">
                    {isSuccess ? 'Payment Successful!' : 'Payment Failed'}
                </h2>

                <p className="text-gray-400 mb-8">
                    {message || (isSuccess
                        ? "Your registration has been confirmed. Welcome to the event!"
                        : "Something went wrong with your transaction. Please try again.")}
                </p>

                {transactionId && (
                    <div className="bg-white/5 rounded-xl p-4 mb-8 border border-white/5">
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Transaction ID</p>
                        <p className="text-white font-mono">{transactionId}</p>
                    </div>
                )}

                <div className="flex flex-col gap-3">
                    {isSuccess ? (
                        <Link href="/" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2">
                            Go to Dashboard <ArrowRight size={18} />
                        </Link>
                    ) : (
                        <Link href="/register" className="w-full bg-white hover:bg-gray-200 text-black font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2">
                            Try Again
                        </Link>
                    )}

                    <Link href="/" className="w-full bg-transparent border border-white/10 hover:bg-white/5 text-gray-400 hover:text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2">
                        <Home size={18} /> Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default function PaymentStatusPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>}>
            <StatusContent />
        </Suspense>
    );
}
