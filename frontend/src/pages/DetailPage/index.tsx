import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import styled from "styled-components";

const SchemaDetail: React.FC = () => {
    const {id} = useParams<{ id: string }>();
    const [imageDetails, setImageDetails] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isError, setIsError] = useState<boolean>(false);


    useEffect(() => {
        // Fetch image details
        const fetchImageDetails = async () => {
            try {
                setIsLoading(true);
                // Replace with your actual API call
                // For example: const response = await api.getImageById(id);
                // For now, mocking with setTimeout
                setTimeout(() => {
                    // Mock data - replace with actual API response
                    setImageDetails({
                        id,
                        title: `Изображение ${id}`,
                        image: "https://placeholder.com/300",
                        description: "Подробное описание изображения"
                    });
                    setIsLoading(false);
                }, 500);
            } catch (error) {
                setIsError(true);
                setIsLoading(false);
            }
        };

        fetchImageDetails();
    }, [id]);


    return (
        <Container>
            {/*<Title>{imageDetails?.title || 'Детали изображения'}</Title>*/}

            {/* Image Details Content */}
            {isLoading ? (
                <div>Загрузка...</div>
            ) : isError ? (
                <div>Ошибка при загрузке данных изображения</div>
            ) : (
                <div>
                    <div>
                        <img
                            src={imageDetails.image}
                            alt={imageDetails.title}
                            style={{maxWidth: '100%', marginBottom: '20px'}}
                        />
                    </div>
                    <h2>{imageDetails.title}</h2>
                    <p>{imageDetails.description}</p>
                    {/* Add more details as needed */}
                </div>
            )}
        </Container>
    );
};
export default SchemaDetail;


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
