import styled from "styled-components";

export const Container = styled.div`
    padding: 20px;
    background-color: #f7f7f7;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    overflow: auto;
`;

export const Title = styled.h1`
    font-size: 2rem;
    color: #333;
    margin-bottom: 20px;
`;

export const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 20px;
    width: 100%;
    max-width: 1000px;
    transition: opacity 0.4s ease, transform 0.4s ease;
`;

export const Card = styled.div`
    background: rgba(255, 255, 255, 0.8);
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    }
`;

export const GroupName = styled.span`
    font-size: 1.2rem;
    color: #333;
`;

export const BreadcrumbContainer = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    font-size: 1.3rem;
    color: #555;
    font-weight: 500;
`;

export const BreadcrumbItem = styled.div<{ $current?: boolean }>`
    color: ${(props) => (props.$current ? '#1a73e8' : '#333')};
    font-weight: ${(props) => (props.$current ? 'bold' : 'normal')};
    cursor: ${(props) => (props.$current ? 'default' : 'pointer')};
    position: relative;
    padding: 5px 10px;
    transition: color 0.3s ease;

    &:hover {
        color: ${(props) => (props.$current ? '#1a73e8' : '#0073e6')};
    }
`;

export const Arrow = styled.span`
    font-size: 1.3rem;
    color: #555;
    margin: 0 5px;
    transition: transform 0.3s ease;

    &:hover {
        transform: scale(1.2);
        color: #1a73e8;
    }
`;

export const Description = styled.div`
    margin-top: 20px;
    font-size: 1rem;
    color: #444;
    max-width: 800px;
    text-align: center;
    padding: 20px;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    opacity: 0;
    transform: translateY(30px);
    animation: fadeInUp 0.5s forwards;

    @keyframes fadeInUp {
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
