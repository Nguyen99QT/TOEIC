import React, { useEffect, useRef } from "react";

interface PayPalButtonProps {
    amount: number;
    onSuccess: (order: any) => void;
}

declare global {
    interface Window {
        paypal: any;
    }
}

const PayPalButton: React.FC<PayPalButtonProps> = ({ amount, onSuccess }) => {
    const paypalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const currentRef = paypalRef.current;

        if (currentRef) {
            currentRef.innerHTML = "";
        }

        const renderPayPal = async () => {
            try {
                if (window.paypal && currentRef) {
                    await window.paypal.Buttons({
                        createOrder: (data: any, actions: any) => {
                            return actions.order.create({
                                purchase_units: [
                                    {
                                        amount: {
                                            value: amount.toString(),
                                        },
                                    },
                                ],
                            });
                        },
                        onApprove: async (data: any, actions: any) => {
                            const order = await actions.order.capture();
                            console.log("✅ Thanh toán thành công:", order);
                            onSuccess(order);
                        },
                        onError: (err: any) => {
                            console.error("❌ Lỗi PayPal:", err);
                        },
                    }).render(currentRef);
                }
            } catch (err) {
                console.error("❌ Không thể render PayPal:", err);
            }
        };

        renderPayPal();

        return () => {
            if (currentRef) {
                currentRef.innerHTML = "";
            }
        };
    }, [amount, onSuccess]);

    return <div ref={paypalRef}></div>;
};

export default PayPalButton;
