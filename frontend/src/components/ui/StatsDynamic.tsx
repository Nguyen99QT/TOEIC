import React, { useEffect, useState } from 'react';

const getRandom = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

const StatsDynamic: React.FC = () => {
    const [students, setStudents] = useState(10000);
    const [questions, setQuestions] = useState(500);
    const [success, setSuccess] = useState(95);
    const [rating, setRating] = useState(4.9);

    useEffect(() => {
        const interval = setInterval(() => {
            setStudents(s => Math.max(9000, s + getRandom(-5, 10)));
            setQuestions(q => Math.max(400, q + getRandom(-1, 3)));
            setSuccess(su => Math.max(90, Math.min(99, su + getRandom(-1, 1))));
            setRating(r => Math.max(4.5, Math.min(5, +(r + (Math.random() - 0.5) * 0.02).toFixed(2))));
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 bg-[#131a26] text-center py-8 rounded-lg">
            <div>
                <span className="text-blue-400 text-3xl font-bold">{students.toLocaleString()}+</span>
                <div className="text-gray-300">Active Students</div>
            </div>
            <div>
                <span className="text-green-400 text-3xl font-bold">{questions}+</span>
                <div className="text-gray-300">Practice Questions</div>
            </div>
            <div>
                <span className="text-purple-400 text-3xl font-bold">{success}%</span>
                <div className="text-gray-300">Success Rate</div>
            </div>
            <div>
                <span className="text-yellow-400 text-3xl font-bold">{rating}</span>
                <div className="text-gray-300">Average Rating</div>
            </div>
        </div>
    );
};

export default StatsDynamic;
