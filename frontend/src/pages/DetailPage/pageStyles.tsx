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
    width: 80%;
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

export const ApprovedSlingsWrapper = styled.div`
    width: 100%;
    margin-top: 40px;
    padding: 20px;
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

    h3 {
        font-size: 18px;
        color: #333;
        margin-bottom: 15px;
        text-align: center;
    }
`;

export const SlingsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 15px;
    justify-items: center;
`;

export const SlingCard = styled.div`
    width: 100px;
    text-align: center;
    padding: 10px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

export const SlingImage = styled.img`
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 8px;
    margin-bottom: 8px;
`;

export const SlingName = styled.p`
    font-size: 14px;
    color: #333;
    margin: 0;
    padding: 0;
`;
