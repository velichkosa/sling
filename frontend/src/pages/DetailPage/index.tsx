import React, {useEffect, useState, useMemo} from 'react';
import {useLocation, useParams} from 'react-router-dom';
import Breadcrumbs, {BreadcrumbItem} from "@/shared/ui/Breadcrumbs";
import {Sling, useImageById} from "@/processes/hooks/useFetchSchemesImage";
import * as Styles from './pageStyles';
import {Spinner} from "@/shared/ui/Spinner";

interface DetailImage {
    id: string
    title: string
    image: string
    description: string
    approvedSlings: Sling[]
}

const DetailPage: React.FC = () => {
    const {id} = useParams<{ id: string }>();
    const {data: imageData} = useImageById(id);

    const location = useLocation();

    const [imageDetails, setImageDetails] = useState<DetailImage>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isError, setIsError] = useState<boolean>(false);

    // Сохраняем state в локальный state, чтобы не потерять его
    const [pageState, setPageState] = useState({
        fromCatalog: location.state?.from === "catalog",
        fromSearch: location.state?.from === "search",
        selectedCategory: location.state?.selectedCategory || null,
        selectedGroup: location.state?.selectedGroup || null
    });

    // Определяем, откуда пришел пользователь
    const {fromCatalog, fromSearch, selectedCategory, selectedGroup} = pageState;

    useEffect(() => {
        // Обновляем локальный state только если пришли новые данные через location.state
        if (location.state) {
            setPageState({
                fromCatalog: location.state.from === "catalog",
                fromSearch: location.state.from === "search",
                selectedCategory: location.state.selectedCategory || null,
                selectedGroup: location.state.selectedGroup || null
            });
        }
    }, [location.state]);

    useEffect(() => {
        if (!imageData) return;

        const fetchImageDetails = async () => {
            try {
                setIsLoading(true);
                setTimeout(() => {
                    setImageDetails({
                        id: id ?? '',
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
    }, [imageData, id]);

    // Формируем breadcrumbs в новом формате
    const breadcrumbItems: BreadcrumbItem[] = useMemo(() => {
        const items: BreadcrumbItem[] = [
            {
                label: 'Главная',
                href: '/'
            }
        ];

        if (fromCatalog && selectedCategory) {
            items.push({
                label: selectedCategory.categoryName,
                href: `/catalog/${selectedCategory.categoryId}`
            });

            if (selectedGroup) {
                items.push({
                    label: selectedGroup.name,
                    href: `/catalog/${selectedCategory.categoryId}/${selectedGroup.id}`
                });
            }
        } else if (fromSearch) {
            items.push({
                label: 'Результаты поиска',
                href: '/search'
            });
        }

        if (imageDetails) {
            items.push({
                label: imageDetails.title,
                href: `/image/${imageDetails.id}`
            });
        }

        return items;
    }, [fromCatalog, fromSearch, selectedCategory, selectedGroup, imageDetails]);

    return (
        <Styles.Container>
            {/* Breadcrumbs - показываем всегда, когда есть данные */}
            {imageDetails && (
                <Breadcrumbs items={breadcrumbItems}/>
            )}

            {isLoading ? (
                <Styles.LoadingText>Загрузка...<Spinner/></Styles.LoadingText>
            ) : isError ? (
                <Styles.ErrorText>Ошибка при загрузке данных изображения</Styles.ErrorText>
            ) : (
                <Styles.Content>
                    {/* Image and Title */}
                    <Styles.ImageWrapper>
                        <img src={imageDetails?.image} alt={imageDetails?.title}/>
                    </Styles.ImageWrapper>
                    <Styles.Title>{imageDetails?.title}</Styles.Title>
                    {imageDetails?.description && <Styles.Description>{imageDetails.description}</Styles.Description>}

                    {/* Approved Slings */}
                    {imageDetails?.approvedSlings && imageDetails?.approvedSlings.length > 0 && (
                        <Styles.ApprovedSlingsWrapper>
                            <h3>Используемые стропы</h3>
                            <Styles.SlingsGrid>
                                {imageDetails?.approvedSlings.map((sling: Sling) => (
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