import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import styled from "styled-components";

const SchemaDetail: React.FC<{
    breadcrumbState: any;
    setBreadcrumbState: (state: any) => void;
}> = ({ breadcrumbState, setBreadcrumbState }) => {
    const {id} = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [imageDetails, setImageDetails] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isError, setIsError] = useState<boolean>(false);

    const { selectedCategory, selectedGroup } = breadcrumbState;

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

    const handleBreadcrumbClick = (level: 'home' | 'category' | 'group') => {
        if (level === 'home') {
            // Clear breadcrumb state and navigate to home
            setBreadcrumbState({
                selectedCategory: null,
                selectedGroup: null
            });
            navigate('/');
        } else if (level === 'category') {
            // Keep category but clear group and navigate to category view
            setBreadcrumbState({
                ...breadcrumbState,
                selectedGroup: null
            });
            navigate('/');
        } else if (level === 'group') {
            // Keep both category and group and navigate back to the group view
            navigate('/');
        }
    };

    return (
        <Container>
            {/*<Title>{imageDetails?.title || 'Детали изображения'}</Title>*/}

            {/* Breadcrumb with added image level */}
            <BreadcrumbContainer>
                <BreadcrumbItem onClick={() => handleBreadcrumbClick('home')}>Главная</BreadcrumbItem>
                {selectedCategory && (
                    <>
                        <Arrow>›</Arrow>
                        <BreadcrumbItem onClick={() => handleBreadcrumbClick('category')}>
                            {selectedCategory.categoryName}
                        </BreadcrumbItem>
                    </>
                )}
                {selectedGroup && (
                    <>
                        <Arrow>›</Arrow>
                        <BreadcrumbItem onClick={() => handleBreadcrumbClick('group')}>
                            {selectedGroup.name}
                        </BreadcrumbItem>
                    </>
                )}
                <Arrow>›</Arrow>
                <BreadcrumbItem $current>{imageDetails?.title || `Изображение ${id}`}</BreadcrumbItem>
            </BreadcrumbContainer>

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
                            style={{ maxWidth: '100%', marginBottom: '20px' }}
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
