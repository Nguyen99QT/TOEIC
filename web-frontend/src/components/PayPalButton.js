import React, { useEffect, useRef } from "react";

const PayPalButton = ({ amount, onSuccess }) => {
    const paypalRef = useRef();

    useEffect(() => {
        // Ngăn lỗi: Clear mọi thứ trong container trước khi render lại
        if (paypalRef.current) {
            paypalRef.current.innerHTML = "";
        }

        const renderPayPal = async () => {
            try {
                if (window.paypal && paypalRef.current) {
                    await window.paypal.Buttons({
                        createOrder: (data, actions) => {
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
                        onApprove: async (data, actions) => {
                            const order = await actions.order.capture();
                            console.log("✅ Thanh toán thành công:", order);
                            onSuccess(order);
                        },
                        onError: (err) => {
                            console.error("❌ Lỗi PayPal:", err);
                        },
                    }).render(paypalRef.current);
                }
            } catch (err) {
                console.error("❌ Không thể render PayPal:", err);
            }
        };

        renderPayPal();

        // Cleanup khi component bị gỡ
        return () => {
            if (paypalRef.current) {
                paypalRef.current.innerHTML = "";
            }
        };
    }, [amount, onSuccess]);

    return <div ref={paypalRef}></div>;
};

export default PayPalButton;
