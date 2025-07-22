import React, { useEffect, useRef } from "react";

const PayPalButton = ({ amount, onSuccess }) => {
    const paypalRef = useRef();

    useEffect(() => {
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

        return () => {
            if (paypalRef.current) {
                paypalRef.current.innerHTML = "";
            }
        };
    }, [amount, onSuccess]);

    return <div ref={paypalRef}></div>;
};

const PaymentPage = () => {
    const handleSuccess = (order) => {
        console.log("Thanh toán thành công:", order);
        alert("Thanh toán thành công!");
    };

    return (
        <div>
            <h1>Thanh toán</h1>
            <PayPalButton amount={10} onSuccess={handleSuccess} />
        </div>
    );
};

export default PaymentPage;
