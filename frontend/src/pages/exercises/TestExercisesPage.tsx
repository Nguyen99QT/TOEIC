import React from 'react';

const TestExercisesPage: React.FC = () => {
    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#f8fafc',
            padding: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '1rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                textAlign: 'center'
            }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>
                    Test Exercises Page
                </h1>
                <p style={{ color: '#6b7280' }}>
                    This is a minimal test page to check if the routing works.
                </p>
                <p style={{ color: '#6b7280', marginTop: '1rem' }}>
                    If you see this, the import/export issue is resolved.
                </p>
            </div>
        </div>
    );
};

export default TestExercisesPage;
