import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import styled from "styled-components";
import {BreadcrumbContainer, BreadcrumbItem} from "@/pages/SearchPage/pageStyles";
import Breadcrumbs from "@/shared/ui/Breadcrumbs";
import {useImageById} from "@/processes/hooks/useFetchSchemesImage";


const DetailPage: React.FC = () => {
    const {id} = useParams<{ id: string }>();
    const {data: imageData} = useImageById(id);

    const location = useLocation();
    const navigate = useNavigate();

    const [imageDetails, setImageDetails] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isError, setIsError] = useState<boolean>(false);


    // Определяем, откуда пришел пользователь
    const fromCatalog = location.state?.from === "catalog";
    const fromSearch = location.state?.from === "search";

    const selectedCategory = location.state?.selectedCategory || null;
    const selectedGroup = location.state?.selectedGroup || null;


    useEffect(() => {
        if (!imageData) return;

        const fetchImageDetails = async () => {
            try {
                setIsLoading(true);
                setTimeout(() => {
                    setImageDetails({
                        id,
                        title: imageData.title,
                        image: imageData.image,
                        description: imageData.description,
                        approvedSlings: imageData.approved_slings,
                    });
                    setIsLoading(false);
                }, 500);
            } catch (error) {
                setIsError(true);
                setIsLoading(false);
            }
        };

        fetchImageDetails();
    }, [imageData]);

    const handleBreadcrumbClick = (level: "home" | "category") => {
        if (level === "home") {
            navigate('/');
        } else if (level === "category") {
            navigate(`/catalog/${imageData?.categoryId}`);
        }
    };

    return (
        <Container>
                    {/* Breadcrumbs */}
            {fromCatalog && (
                <Breadcrumbs
                    selectedCategory={selectedCategory}
                    selectedGroup={selectedGroup}
                    onBreadcrumbClick={handleBreadcrumbClick} // Передаем обработчик
                />
            )}
            {fromSearch && (
                <BreadcrumbContainer>
                    <BreadcrumbItem onClick={() => navigate('/')}>Вернуться на главную</BreadcrumbItem>
                </BreadcrumbContainer>
            )}

            {isLoading ? (
                <LoadingText>Загрузка...</LoadingText>
            ) : isError ? (
                <ErrorText>Ошибка при загрузке данных изображения</ErrorText>
            ) : (
                <Content>
                    {/* Image and Title */}
                    <ImageWrapper>
                        <img src={imageDetails.image} alt={imageDetails.title}/>
                    </ImageWrapper>
                    <Title>{imageDetails.title}</Title>
                    {imageDetails.description && <Description>{imageDetails.description}</Description>}

                    {/* Approved Slings */}
                    {imageDetails.approvedSlings && imageDetails.approvedSlings.length > 0 && (
                        <ApprovedSlingsWrapper>
                            <h3>Используемые стропы</h3>
                            <SlingsGrid>
                                {imageDetails.approvedSlings.map((sling: any) => (
                                    <SlingCard key={sling.id}>
                                        <SlingImage src={sling.image} alt={sling.name}/>
                                        <SlingName>{sling.name}</SlingName>
                                    </SlingCard>
                                ))}
                            </SlingsGrid>
                        </ApprovedSlingsWrapper>
                    )}
                </Content>
            )}
        </Container>
    );
};

export default DetailPage;

// Styled Components

const Container = styled.div`
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

const LoadingText = styled.div`
    font-size: 18px;
    color: #999;
`;

const ErrorText = styled.div`
    font-size: 18px;
    color: red;
`;

const Content = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const ImageWrapper = styled.div`
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

const Title = styled.h2`
    font-size: 24px;
    color: #333;
    margin-bottom: 10px;
`;

const Description = styled.p`
    font-size: 16px;
    color: #666;
    text-align: center;
    max-width: 800px;
`;

const ApprovedSlingsWrapper = styled.div`
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

const SlingsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 15px;
    justify-items: center;
`;

const SlingCard = styled.div`
    width: 100px;
    text-align: center;
    padding: 10px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const SlingImage = styled.img`
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 8px;
    margin-bottom: 8px;
`;

const SlingName = styled.p`
    font-size: 14px;
    color: #333;
    margin: 0;
    padding: 0;
`;

