import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import {title} from "@/shared/ui/title";
import {useCategory} from "@/processes/hooks/useFetchCategory";

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

            {/* Отображение контента */}
            {selectedGroup ? (
                <Description>{selectedGroup.description}</Description>
            ) : selectedCategory ? (
                <Grid>
                    {selectedCategory.subGroups.map((group: any, index: number) => (
                        <Card key={index} onClick={() => handleGroupClick(group)}>
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

const Container = styled.div`
    padding: 20px;
    background-color: #f7f7f7;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    overflow: hidden;
`;

const Title = styled.h1`
    font-size: 2rem;
    color: #333;
    margin-bottom: 20px;
`;

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 20px;
    width: 100%;
    max-width: 1000px;
    transition: opacity 0.4s ease, transform 0.4s ease;
`;

const Card = styled.div`
    background: rgba(255, 255, 255, 0.8);
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    }
`;

const GroupName = styled.span`
    font-size: 1.2rem;
    color: #333;
`;

const BreadcrumbContainer = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    font-size: 1.3rem;
    color: #555;
    font-weight: 500;
`;

const BreadcrumbItem = styled.div<{ $current?: boolean }>`
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

const Arrow = styled.span`
    font-size: 1.3rem;
    color: #555;
    margin: 0 5px;
    transition: transform 0.3s ease;

    &:hover {
        transform: scale(1.2);
        color: #1a73e8;
    }
`;

const Description = styled.div`
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

export default SearchPage;