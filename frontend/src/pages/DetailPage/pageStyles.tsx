import styled from "styled-components";

export const Container = styled.div`
    padding: 20px;
    background-color: #f7f7f7;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    overflow: auto;
    max-width: 900px;
    margin: 0 auto;
`;

export const LoadingText = styled.div`
    font-size: 18px;
    color: #999;
`;

export const ErrorText = styled.div`
    font-size: 18px;
    color: red;
`;

export const Content = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

export const ImageWrapper = styled.div`
    width: 100%;
    margin-bottom: 20px;
    max-width: 800px;
    overflow: hidden;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

    img {
        width: 100%;
        height: auto;
        border-radius: 10px;
    }
`;

export const Title = styled.h2`
    font-size: 24px;
    color: #333;
    margin-bottom: 10px;
`;

export const Description = styled.p`
    font-size: 16px;
    color: #666;
    text-align: center;
    max-width: 800px;
`;
