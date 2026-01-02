'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, XCircle, Home, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';

interface PaymentStatusData {
    paymentId: string;
    orderId: string;
    gatewayOrderId: string;
    gatewayPaymentId: string;
    amount: number;
    currency: string;
    status: string;
    paymentMethod: string;
    paymentTime: string;
    participant: {
        _id: string;
        name: string;
        email: string;
        phone: string;
        status: string;
    };
    organization: {
        _id: string;
        name: string;
    };
    createdAt: string;
    updatedAt: string;
}

interface PaymentStatusResponse {
    success: boolean;
    message: string;
    data?: PaymentStatusData;
    status?: number;
    error?: {
        code: string;
        details: string;
    };
}

const StatusContent = () => {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');
    const [loading, setLoading] = useState(true);
    const [paymentData, setPaymentData] = useState<PaymentStatusResponse | null>(null);

    useEffect(() => {
        const fetchPaymentStatus = async () => {
            if (!orderId) {
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/events/payment-status/${orderId}`);
                setPaymentData(response.data);
            } catch (error) {
                console.error('Error fetching payment status:', error);
                if (axios.isAxiosError(error) && error.response) {
                    setPaymentData(error.response.data);
                } else {
                    setPaymentData({
                        success: false,
                        message: 'Failed to fetch payment status',
                        error: {
                            code: 'FETCH_ERROR',
                            details: 'Unable to connect to the server.'
                        }
                    });
                }
            } finally {
                setLoading(false);
            }
        };

        fetchPaymentStatus();
    }, [orderId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-4">
                <div className="glass-panel p-8 rounded-[2rem] border border-white/10 text-center">
                    <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
                    <p className="text-white text-lg">Checking payment status...</p>
                </div>
            </div>
        );
    }

    if (!orderId) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-4">
                <div className="glass-panel p-8 rounded-[2rem] border border-white/10 text-center max-w-md">
                    <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-black text-white mb-2">Invalid Request</h2>
                    <p className="text-gray-400 mb-6">No order ID provided</p>
                    <Link href="/" className="w-full inline-flex items-center justify-center gap-2 bg-transparent border border-white/10 hover:bg-white/5 text-gray-400 hover:text-white font-bold py-4 rounded-xl transition-all">
                        <Home size={18} /> Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    const isSuccess = paymentData?.success && paymentData?.data?.status === 'success';
    const message = paymentData?.message || '';
    const participant = paymentData?.data?.participant;
    const paymentInfo = paymentData?.data;

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

                {/* Payment Details for Success */}
                {isSuccess && paymentInfo && (
                    <div className="space-y-4 mb-8 text-left">
                        {participant && (
                            <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Participant Details</p>
                                <div className="space-y-1">
                                    <p className="text-white font-semibold">{participant.name}</p>
                                    <p className="text-sm text-gray-400">{participant.email}</p>
                                    <p className="text-sm text-gray-400">{participant.phone}</p>
                                    <p className="text-xs text-green-500 uppercase tracking-wider mt-2">
                                        Status: {participant.status}
                                    </p>
                                </div>
                            </div>
                        )}
                        
                        <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Payment Information</p>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-400 text-sm">Amount</span>
                                    <span className="text-white font-semibold">₹{paymentInfo.amount}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400 text-sm">Payment Method</span>
                                    <span className="text-white text-sm">{paymentInfo.paymentMethod}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400 text-sm">Payment ID</span>
                                    <span className="text-white text-xs font-mono">{paymentInfo.gatewayPaymentId}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Order ID</p>
                            <p className="text-white font-mono text-sm break-all">{paymentInfo.orderId}</p>
                        </div>
                    </div>
                )}

                {/* Error Details */}
                {!isSuccess && paymentData?.error && (
                    <div className="bg-red-500/10 rounded-xl p-4 mb-8 border border-red-500/20 text-left">
                        <p className="text-xs text-red-400 uppercase tracking-wider mb-1">Error Code</p>
                        <p className="text-white font-mono text-sm mb-3">{paymentData.error.code}</p>
                        <p className="text-sm text-gray-300">{paymentData.error.details}</p>
                    </div>
                )}

                {/* Transaction ID fallback */}
                {!isSuccess && !paymentData?.error && orderId && (
                    <div className="bg-white/5 rounded-xl p-4 mb-8 border border-white/5">
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Order ID</p>
                        <p className="text-white font-mono">{orderId}</p>
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
