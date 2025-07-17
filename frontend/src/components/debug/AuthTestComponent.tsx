import React, { useState } from 'react';

const AuthTestComponent: React.FC = () => {
    const [testResult, setTestResult] = useState<string>('');

    const testAuth = async () => {
        setTestResult('Testing...');
        const results: string[] = [];

        try {
            // Test 1: Validate token first
            const token = localStorage.getItem('toeic_access_token');
            if (!token) {
                setTestResult('❌ No token found');
                return;
            }

            // Test 2: Try exercise submission endpoint (known working)
            try {
                const exerciseTest = await fetch('http://localhost:8080/api/exercises/4', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (exerciseTest.ok) {
                    results.push('✅ Exercise API working');
                } else {
                    results.push(`❌ Exercise API failed: ${exerciseTest.status}`);
                }
            } catch (e) {
                results.push(`❌ Exercise API error: ${e}`);
            }

            // Test 3: Try lesson completion endpoint (was failing)
            try {
                const lessonTest = await fetch('http://localhost:8080/api/lessons/2/complete?timeSpent=5', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (lessonTest.ok) {
                    results.push('✅ Lesson completion API working');
                } else {
                    const errorText = await lessonTest.text();
                    results.push(`❌ Lesson API failed: ${lessonTest.status} - ${errorText}`);
                }
            } catch (e) {
                results.push(`❌ Lesson API error: ${e}`);
            }

            setTestResult(results.join('\n'));

        } catch (error: any) {
            console.error('Test failed:', error);
            setTestResult(`❌ Test failed: ${error.message}`);
        }
    };

    if (process.env.NODE_ENV === 'production') {
        return null;
    }

    return (
        <div className="fixed bottom-4 left-4 bg-black text-white p-4 rounded z-50 max-w-sm">
            <div className="mb-2 font-bold">🔧 Auth Test</div>
            <button
                onClick={testAuth}
                className="bg-blue-600 px-3 py-1 rounded text-sm mr-2 hover:bg-blue-700"
            >
                Test Both APIs
            </button>
            <div className="text-xs mt-2 whitespace-pre-line">{testResult}</div>
        </div>
    );
};

export default AuthTestComponent;
