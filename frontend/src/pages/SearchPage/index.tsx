import React, {useState, useEffect} from 'react';
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
import ImageGallery from "@/pages/SearchPage/ui/ImageGallery";

const SearchPage: React.FC = () => {

    const {data: menuCategoryData, isLoading, isError, refetch} = useCategory();

    //  Меню Основные категории
    const categories = [
        {
            categoryName: 'По виду работ', subGroups: menuCategoryData?.workType
        },
        {
            categoryName: 'По форм-фактору', subGroups: menuCategoryData?.formFactor
        }
    ];

    const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
    const [selectedGroup, setSelectedGroup] = useState<any | null>(null);

    useEffect(() => {
        document.title = title.search;
    }, []);

    const handleCategoryClick = (category: any) => {
        setSelectedCategory(category);
        setSelectedGroup(null);
    };

    const handleGroupClick = (group: any) => {
        setSelectedGroup(group);
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
                            <BreadcrumbItem $current>{selectedGroup.groupName}</BreadcrumbItem>
                        </>
                    )}
                </BreadcrumbContainer>
            ) : <BreadcrumbContainer><BreadcrumbItem/></BreadcrumbContainer>}

            {/*/!* Отображение контента *!/*/}
            {selectedGroup ? (
                // <Description>{selectedGroup.description}</Description>
                <ImageGallery worktypeId={selectedGroup.id}/>
            ) : selectedCategory ? (
                    <Grid>
                        {selectedCategory.subGroups.map((group: any, index: number) => (
                                <Card key={index} onClick={() => handleGroupClick(group)}>
                                    <GroupName>{group.name}</GroupName>
                                </Card>
                            )
                        )}
                    </Grid>
                ) :
                (
                    <Grid>
                        {categories.map((category, index) => (
                            <Card key={index} onClick={() => handleCategoryClick(category)}>
                                <GroupName>{category.categoryName}</GroupName>
                            </Card>
                        ))}
                    </Grid>
                )
            }

        </Container>
    );
};

export default SearchPage;