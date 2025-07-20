import React, { useState } from "react";
import PayPalButton from "./PayPalButton";

const plans = [
    {
        id: "trial",
        name: "Dùng thử 7 ngày",
        price: 10,
        duration: "7 ngày",
        description: "Trải nghiệm tất cả tính năng trong 7 ngày.",
        featured: false,
    },
    {
        id: "6months",
        name: "Gói 6 tháng",
        price: 280,
        duration: "6 tháng",
        description: "Tiết kiệm hơn khi đăng ký dài hạn.",
        featured: true,
    },
    {
        id: "1year",
        name: "Gói 1 năm",
        price: 500,
        duration: "12 tháng",
        description: "Tiết kiệm tối đa và học không giới hạn.",
        featured: false,
    },
];

function MembershipPlans() {
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [paidOrder, setPaidOrder] = useState(null);

    const handleSelect = (planId) => {
        const plan = plans.find((p) => p.id === planId);
        setSelectedPlan(plan);
        setPaidOrder(null);
    };

    const handleSuccess = (order) => {
        setPaidOrder(order);
        alert("✅ Thanh toán thành công!");
    };

    return (
        <div className="container py-5">
            <h2 className="text-center mb-5 fw-bold">Chọn Gói Hội Viên</h2>
            <div className="row g-4">
                {plans.map((plan) => (
                    <div className="col-md-4" key={plan.id}>
                        <div
                            className={`card h-100 shadow-sm border-${plan.featured ? "primary" : "light"
                                } border-2 position-relative`}
                        >
                            {plan.featured && (
                                <span className="position-absolute top-0 start-50 translate-middle badge rounded-pill bg-primary mt-2">
                                    Đề xuất
                                </span>
                            )}
                            <div className="card-body d-flex flex-column justify-content-between">
                                <div>
                                    <h5 className="card-title text-center fw-bold">{plan.name}</h5>
                                    <h6 className="text-muted text-center">{plan.duration}</h6>
                                    <p className="text-center display-6 text-primary mt-3">${plan.price}</p>
                                    <p className="card-text text-center text-muted">{plan.description}</p>
                                </div>
                                <div className="d-grid mt-3">
                                    <button
                                        className="btn btn-outline-primary"
                                        onClick={() => handleSelect(plan.id)}
                                    >
                                        {parseFloat(paidOrder?.purchase_units?.[0]?.amount?.value) === plan.price
                                            ? "Đã thanh toán"
                                            : "Chọn gói này"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Thanh toán PayPal */}
            {selectedPlan && (
                <div className="mt-5 text-center animate__animated animate__fadeInUp">
                    <div className="card mx-auto shadow" style={{ maxWidth: "500px" }}>
                        <div className="card-body">
                            <h5 className="card-title mb-2">Thanh toán: {selectedPlan.name}</h5>
                            <p className="card-text text-muted">Giá: ${selectedPlan.price}</p>
                            <PayPalButton
                                key={selectedPlan.id} // tránh lỗi re-render
                                amount={selectedPlan.price}
                                onSuccess={handleSuccess}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Thông báo sau khi thanh toán */}
            {paidOrder && (
                <div className="alert alert-success mt-4 text-center fw-bold">
                    🎉 Giao dịch thành công – Mã đơn hàng: {paidOrder.id}
                </div>
            )}
        </div>
    );
}

export default MembershipPlans;
