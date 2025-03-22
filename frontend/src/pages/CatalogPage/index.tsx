import React, {useState, useMemo, useEffect} from 'react';
import {useCategory} from "@/processes/hooks/useFetchCategory";
import {
    Container,
    Grid,
    Card,
    GroupName,
} from "./pageStyles";
import ImageGallery from "@/shared/ui/ImageGallery";
import {useImagesByFormFactor, useImagesByWorktype} from "@/processes/hooks/useFetchSchemesImage";
import Breadcrumbs from "@/shared/ui/Breadcrumbs";
import {useNavigate, useParams} from "react-router-dom";

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
    const navigate = useNavigate();
    const {categoryId, groupId} = useParams<{ categoryId?: string; groupId?: string }>();

    const [selectedCategory, setSelectedCategory] = useState<SelectedCategoryType | null>(null);
    const [selectedGroup, setSelectedGroup] = useState<Category | null>(null);
    const [workTypeID, setWorkTypeID] = useState<string | null>(null);
    const [formFactorID, setFormFactorID] = useState<string | null>(null);

    const {data: menuCategoryData} = useCategory();
    const {data: workTypeData} = useImagesByWorktype(workTypeID);
    const {data: formFactorData} = useImagesByFormFactor(formFactorID);

    const categories = useMemo(() => [
        {categoryName: "По виду работ", subGroups: menuCategoryData?.workType, categoryId: "worktype"},
        {categoryName: "По форм-фактору", subGroups: menuCategoryData?.formFactor, categoryId: "formFactor"}
    ], [menuCategoryData]);

    // При загрузке страницы проверяем, есть ли categoryId в URL и устанавливаем категорию
    useEffect(() => {
        if (categoryId) {
            const foundCategory = categories.find(cat => cat.categoryId === categoryId);
            if (foundCategory) {
                setSelectedCategory(foundCategory);
                setSelectedGroup(null);
            }
        }
    }, [categoryId, categories]);

    // При загрузке страницы проверяем, есть ли groupId в URL и устанавливаем группу
    useEffect(() => {
        if (groupId && selectedCategory && selectedCategory.subGroups) {
            const foundGroup = selectedCategory.subGroups.find(group => group.id === groupId);
            if (foundGroup) {
                setSelectedGroup(foundGroup);
                if (selectedCategory.categoryId === "worktype") {
                    setWorkTypeID(groupId);
                } else if (selectedCategory.categoryId === "formFactor") {
                    setFormFactorID(groupId);
                }
            } else {
                // Если группа не найдена, можно сбросить selectedGroup или показать ошибку
                setSelectedGroup(null);
            }
        }
    }, [groupId, selectedCategory]);


    const handleCategoryClick = (category: any) => {
        setSelectedCategory(category);
        setSelectedGroup(null);
        navigate(`/catalog/${category.categoryId}`);
    };

    const handleGroupClick = (group: Category) => {
        setSelectedGroup(group);
        navigate(`/catalog/${selectedCategory?.categoryId}/${group.id}`);

        if (selectedCategory?.categoryId === "worktype") {
            setWorkTypeID(group.id);
        } else if (selectedCategory?.categoryId === "formFactor") {
            setFormFactorID(group.id);
        }
    };

    const handleBreadcrumbClick = (level: "home" | "category") => {
        if (level === "home") {
            setSelectedCategory(null);
            setSelectedGroup(null);
            navigate("/");
        } else if (level === "category") {
            setSelectedGroup(null);
            navigate(`/catalog/${selectedCategory?.categoryId}`);
        }
    };

    // Защищаемся от ошибки, если данные еще не загружены
    if (!menuCategoryData) {
        return <div>Загрузка...</div>; // Можно добавить спиннер или сообщение о загрузке
    }


    return (
        <Container>
            <Breadcrumbs
                selectedCategory={selectedCategory}
                selectedGroup={selectedGroup}
                onBreadcrumbClick={handleBreadcrumbClick}
            />

            {selectedGroup ? (
                <ImageGallery
                    imagesDataList={selectedCategory?.categoryId === "worktype" ? workTypeData : formFactorData}/>
            ) : selectedCategory ? (
                // Проверяем, что subGroups существуют
                <Grid>
                    {selectedCategory.subGroups && selectedCategory.subGroups.length > 0 ? (
                        selectedCategory.subGroups.map((group, index) => (
                            <Card key={index} onClick={() => handleGroupClick(group)}>
                                <GroupName>{group.name}</GroupName>
                            </Card>
                        ))
                    ) : (
                        <div>Группы не найдены</div> // Выводим сообщение, если нет групп
                    )}
                </Grid>
            ) : (
                <Grid>
                    {categories.length > 0 ? (
                        categories.map((category, index) => (
                            <Card key={index} onClick={() => handleCategoryClick(category)}>
                                <GroupName>{category.categoryName}</GroupName>
                            </Card>
                        ))
                    ) : (
                        <div>Категории не найдены</div> // Выводим сообщение, если нет категорий
                    )}
                </Grid>
            )}
        </Container>
    );
};

export default CatalogPage;
