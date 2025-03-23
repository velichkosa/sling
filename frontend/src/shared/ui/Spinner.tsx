import React from 'react';

export const Spinner = () => {
    return (
        <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '24px'
        }}>
            Загрузка...
        </div>
    );
};
