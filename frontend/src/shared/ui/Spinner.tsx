import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinnerWrapper = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.6); /* Лёгкая полупрозрачность */
    backdrop-filter: blur(8px);
    width: 60px;
    height: 60px;
    border-radius: 50%;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); /* Мягкая тень */
`;

const SpinnerCircle = styled.div`
    width: 35px;
    height: 35px;
    border: 5px solid rgba(0, 0, 0, 0.1);
    border-top: 5px solid #007bff; /* Яркий акцент */
    border-radius: 50%;
    animation: ${spin} 1s linear infinite;
`;

export const Spinner = () => {
    return (
        <SpinnerWrapper>
            <SpinnerCircle />
        </SpinnerWrapper>
    );
};
