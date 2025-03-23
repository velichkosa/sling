import React, {useState, useMemo, useEffect} from 'react';
import {useCategory} from "@/processes/hooks/useFetchCategory";
import * as Styles from "./pageStyles";
import ImageGallery from "@/shared/ui/ImageGallery";
import {useImagesByFormFactor, useImagesByWorktype} from "@/processes/hooks/useFetchSchemesImage";
import Breadcrumbs from "@/shared/ui/Breadcrumbs";
import {useLocation, useNavigate, useParams} from "react-router-dom";

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

    const { categoryId, groupId } = useParams<{ categoryId?: string; groupId?: string }>();

    const [selectedCategory, setSelectedCategory] = useState<SelectedCategoryType | null>(null);
    const [selectedGroup, setSelectedGroup] = useState<Category | null>(null);
    const [workTypeID, setWorkTypeID] = useState<string | null>(null);
    const [formFactorID, setFormFactorID] = useState<string | null>(null);

    const { data: menuCategoryData } = useCategory();
    const { data: workTypeData, isFetching } = useImagesByWorktype(workTypeID, 1, 20);  // Initial page load
    const { data: formFactorData } = useImagesByFormFactor(formFactorID);

    const categories = useMemo(() => [
        { categoryName: "По виду работ", subGroups: menuCategoryData?.workType, categoryId: "worktype" },
        { categoryName: "По форм-фактору", subGroups: menuCategoryData?.formFactor, categoryId: "formFactor" }
    ], [menuCategoryData]);

    // Track page state for infinite scroll
    const [page, setPage] = useState(1);

    useEffect(() => {
        if (categoryId) {
            const foundCategory: any = categories.find(cat => cat.categoryId === categoryId);
            if (foundCategory) {
                setSelectedCategory(foundCategory);
                setSelectedGroup(null);
            }
        }
    }, [categoryId, categories]);

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

    // To protect against errors when data isn't loaded yet
    if (!menuCategoryData) {
        return <div>Загрузка...</div>;
    }

    return (
        <Styles.Container>
            <Breadcrumbs
                selectedCategory={selectedCategory}
                selectedGroup={selectedGroup}
                onBreadcrumbClick={handleBreadcrumbClick}
            />

            {selectedGroup ? (
                <ImageGallery
                    imagesDataList={selectedCategory?.categoryId === "worktype" ? workTypeData?.results : formFactorData}
                    from="catalog"
                    selectedCategory={selectedCategory}
                    selectedGroup={selectedGroup}
                    page={page}  // Pass the current page state
                    setPage={setPage}  // Pass setter function to update page
                />
            ) : selectedCategory ? (
                <Styles.Grid>
                    {selectedCategory.subGroups && selectedCategory.subGroups.length > 0 ? (
                        selectedCategory.subGroups.map((group, index) => (
                            <Styles.Card key={index} onClick={() => handleGroupClick(group)}>
                                <Styles.GroupName>{group.name}</Styles.GroupName>
                            </Styles.Card>
                        ))
                    ) : (
                        <div>Группы не найдены</div>
                    )}
                </Styles.Grid>
            ) : (
                <Styles.Grid>
                    {categories.length > 0 ? (
                        categories.map((category, index) => (
                            <Styles.Card key={index} onClick={() => handleCategoryClick(category)}>
                                <Styles.GroupName>{category.categoryName}</Styles.GroupName>
                            </Styles.Card>
                        ))
                    ) : (
                        <div>Категории не найдены</div>
                    )}
                </Styles.Grid>
            )}
        </Styles.Container>
    );
};
export default CatalogPage;
