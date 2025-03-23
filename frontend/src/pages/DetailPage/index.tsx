import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import Breadcrumbs, {BreadcrumbContainer, BreadcrumbItem} from "@/shared/ui/Breadcrumbs";
import {useImageById} from "@/processes/hooks/useFetchSchemesImage";
import * as Styles from './pageStyles';


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
    // const handleBreadcrumbClick = (level: "home" | "category") => {
    //     if (level === "home") {
    //         setSelectedCategory(null);
    //         setSelectedGroup(null);
    //         navigate("/");
    //     } else if (level === "category") {
    //         setSelectedGroup(null);
    //         navigate(`/catalog/${selectedCategory?.categoryId}`);
    //     }
    // };

    return (
        <Styles.Container>
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
                <Styles.LoadingText>Загрузка...</Styles.LoadingText>
            ) : isError ? (
                <Styles.ErrorText>Ошибка при загрузке данных изображения</Styles.ErrorText>
            ) : (
                <Styles.Content>
                    {/* Image and Title */}
                    <Styles.ImageWrapper>
                        <img src={imageDetails.image} alt={imageDetails.title}/>
                    </Styles.ImageWrapper>
                    <Styles.Title>{imageDetails.title}</Styles.Title>
                    {imageDetails.description && <Styles.Description>{imageDetails.description}</Styles.Description>}

                    {/* Approved Slings */}
                    {imageDetails.approvedSlings && imageDetails.approvedSlings.length > 0 && (
                        <Styles.ApprovedSlingsWrapper>
                            <h3>Используемые стропы</h3>
                            <Styles.SlingsGrid>
                                {imageDetails.approvedSlings.map((sling: any) => (
                                    <Styles.SlingCard key={sling.id}>
                                        <Styles.SlingImage src={sling.image} alt={sling.name}/>
                                        <Styles.SlingName>{sling.name}</Styles.SlingName>
                                    </Styles.SlingCard>
                                ))}
                            </Styles.SlingsGrid>
                        </Styles.ApprovedSlingsWrapper>
                    )}
                </Styles.Content>
            )}
        </Styles.Container>
    );
};

export default DetailPage;