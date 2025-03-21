import React, {useState, useEffect, useMemo} from 'react';
import {title} from "@/shared/ui/title";
import {useCategory} from "@/processes/hooks/useFetchCategory";
import {
    Container,
    Title,
    Grid,
    Card,
    GroupName,
    BreadcrumbContainer,
    BreadcrumbItem,
    Arrow,
    Description,
} from "./pageStyles";
import ImageGallery from "@/shared/ui/ImageGallery";
import {useImagesByFormFactor, useImagesByWorktype} from "@/processes/hooks/useFetchSchemesImage";

interface Category {
    id: string
    name: string
    description: string
}

interface SelectedCategoryType {
    categoryName: string
    subGroups: Category[]
    categoryId: 'worktype' | 'formFactor'
}

const CatalogPage: React.FC = () => {
    const [workTypeID, setWorkTypeID] = useState<string | null>(null);
    const [formFactorID, setFormFactorID] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<SelectedCategoryType | null>(null);
    const [selectedGroup, setSelectedGroup] = useState<Category | null>(null);

    useEffect(() => {
        document.title = title.search;
    }, []);

    const {
        data: menuCategoryData,
        isLoading: menuCategoryIsLoading,
        isError: menuCategoryIsError,
    } = useCategory();

    const {
        data: workTypeData,
        isLoading: workTypeIsLoading,
        isError: workTypeIsError
    } = useImagesByWorktype(workTypeID);

    const {
        data: formFactorData,
        isLoading: formFactorIsLoading,
        isError: formFactorIsError
    } = useImagesByFormFactor(formFactorID);

    const categories = useMemo(() => [
        {
            categoryName: 'По виду работ',
            subGroups: menuCategoryData?.workType,
            categoryId: 'worktype',
        },
        {
            categoryName: 'По форм-фактору',
            subGroups: menuCategoryData?.formFactor,
            categoryId: 'formFactor',
        }
    ], [menuCategoryData]);

    const isLoading = workTypeIsLoading || formFactorIsLoading;
    const isError = workTypeIsError || formFactorIsError;

    const handleCategoryClick = (category: any) => {
        setSelectedCategory(category);
        setSelectedGroup(null);
    };

    const handleGroupClick = (group: Category, categoryId: SelectedCategoryType['categoryId']) => {
        setSelectedGroup(group);

        // Загружаем изображения в зависимости от категории
        if (categoryId === 'worktype') {
            setWorkTypeID(group.id);
        } else if (categoryId === 'formFactor') {
            setFormFactorID(group.id);
        }
    };

    const handleBreadcrumbClick = (level: 'home' | 'category') => {
        if (level === 'home') {
            setSelectedCategory(null);
            setSelectedGroup(null);
        } else if (level === 'category') {
            setSelectedGroup(null);
        }
    };

    return (
        <Container>
            <Title>{selectedCategory ? selectedCategory.categoryName : 'Выберите категорию'}</Title>

            {/* Breadcrumb */}
            {(selectedCategory || selectedGroup) ? (
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
                            {selectedGroup.name && <BreadcrumbItem $current>{selectedGroup.name}</BreadcrumbItem>}
                        </>
                    )}
                </BreadcrumbContainer>
            ) : <BreadcrumbContainer><BreadcrumbItem/></BreadcrumbContainer>}

            {/* Content Display */}
            {isLoading ? (
                "Загрузка"
            ) : isError ? (
                "Ошибка при загрузке данных"
            ) : selectedGroup ? (
                <ImageGallery
                    imagesDataList={selectedCategory?.categoryId === 'worktype' ? workTypeData : formFactorData}/>
            ) : selectedCategory ? (
                <Grid>
                    {selectedCategory.subGroups.map((group: any, index: number) => (
                        <Card key={index} onClick={() => handleGroupClick(group, selectedCategory.categoryId)}>
                            <GroupName>{group.name}</GroupName>
                        </Card>
                    ))}
                </Grid>
            ) : (
                <Grid>
                    {categories.map((category, index) => (
                        <Card key={index} onClick={() => handleCategoryClick(category)}>
                            <GroupName>{category.categoryName}</GroupName>
                        </Card>
                    ))}
                </Grid>
            )}
        </Container>
    );
};

export default CatalogPage;