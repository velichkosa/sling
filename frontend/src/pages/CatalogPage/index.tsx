import React, {useState, useMemo, useEffect} from 'react';
import {useCategory} from "@/processes/hooks/useFetchCategory";
import * as Styles from "./pageStyles";
import ImageGallery from "@/shared/ui/ImageGallery";
import {useImagesByFormFactor, useImagesByWorktype} from "@/processes/hooks/useFetchSchemesImage";
import Breadcrumbs from "@/shared/ui/Breadcrumbs";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {useInView} from 'react-intersection-observer';

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

    const {
        data: workTypeData,
        fetchNextPage: fetchNextPage,
        hasNextPage: hasNextPage,
        isFetchingNextPage: isFetchingNextPage
    } = useImagesByWorktype(workTypeID, 10);

    const {
        data: formFactorData,
        fetchNextPage: fetchNextFormFactor,
        hasNextPage: hasNextFormFactor,
        isFetchingNextPage: isFetchingNextFormFactor
    } = useImagesByFormFactor(formFactorID, 10);


    const {ref, inView} = useInView();

    useEffect(() => {
        if (inView && hasNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage]);

    useEffect(() => {
        if (inView && hasNextFormFactor) {
            fetchNextFormFactor();
        }
    }, [inView, hasNextFormFactor]);

    const categories = useMemo(() => [
        {categoryName: "По виду работ", subGroups: menuCategoryData?.workType, categoryId: "worktype"},
        {categoryName: "По форм-фактору", subGroups: menuCategoryData?.formFactor, categoryId: "formFactor"}
    ], [menuCategoryData]);

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
        if (groupId && selectedCategory?.subGroups) {
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

    // const handleCategoryClick = (category: any) => {
    //     setSelectedCategory(category);
    //     setSelectedGroup(null);
    //     navigate(`/catalog/${category.categoryId}`);
    // };
    //
    // const handleGroupClick = (group: Category) => {
    //     setSelectedGroup(group);
    //     navigate(`/catalog/${selectedCategory?.categoryId}/${group.id}`);
    //
    //     if (selectedCategory?.categoryId === "worktype") {
    //         setWorkTypeID(group.id);
    //     } else if (selectedCategory?.categoryId === "formFactor") {
    //         setFormFactorID(group.id);
    //     }
    // };

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
                    imagesDataList={
                        selectedCategory?.categoryId === "worktype"
                            ? workTypeData?.pages?.flatMap(page => page.results) || []
                            : formFactorData?.pages?.flatMap(page => page.results) || []
                    }
                    from="catalog"
                    selectedCategory={selectedCategory}
                    selectedGroup={selectedGroup}
                    refObserver={ref}
                    isFetchingNextPage={
                        selectedCategory?.categoryId === "worktype" ? isFetchingNextPage : isFetchingNextFormFactor
                    }
                />
            ) : selectedCategory ? (
                <Styles.Grid>
                    {selectedCategory.subGroups?.length > 0 ? (
                        selectedCategory.subGroups.map((group, index) => (
                            <Styles.Card key={index}
                                         onClick={() => navigate(`/catalog/${selectedCategory.categoryId}/${group.id}`)}>
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
                            <Styles.Card key={index} onClick={() => navigate(`/catalog/${category.categoryId}`)}>
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
