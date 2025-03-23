import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import styled from "styled-components";
import {BreadcrumbContainer, BreadcrumbItem} from "@/pages/SearchPage/pageStyles";
import Breadcrumbs from "@/shared/ui/Breadcrumbs";
import {useImageById} from "@/processes/hooks/useFetchSchemesImage";

const DetailPage: React.FC = () => {
    const {id} = useParams<{ id: string }>();
    const {data: imageData} = useImageById(id)

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
        if (!imageData) {
            return
        }
        const fetchImageDetails = async () => {
            try {
                setIsLoading(true);
                setTimeout(() => {
                    setImageDetails({
                        id,
                        title: imageData.title,
                        image: imageData.image,
                        description: imageData.description
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

    // Функция для навигации при клике на хлебные крошки
    const handleBreadcrumbClick = (level: "home" | "category") => {
        if (level === "home") {
            navigate("/");
        } else if (level === "category" && selectedCategory) {
            navigate(`/catalog/${selectedCategory.categoryId}`);
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

            {/* Image Details Content */}
            {isLoading ? (
                <div>Загрузка...</div>
            ) : isError ? (
                <div>Ошибка при загрузке данных изображения</div>
            ) : (
                <div>
                    <img src={imageDetails.image} alt={imageDetails.title}
                         style={{maxWidth: '100%', marginBottom: '20px'}}/>
                    <h2>{imageDetails.title}</h2>
                    <p>{imageDetails.description}</p>
                </div>
            )}
        </Container>
    );
};

export default DetailPage;


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
