import React, {useState, useMemo, useEffect} from 'react';
import {useCategory} from "@/processes/hooks/useFetchCategory";
import * as Styles from "./pageStyles";
import ImageGallery from "@/shared/ui/ImageGallery";
import Breadcrumbs, {BreadcrumbItem} from "@/shared/ui/Breadcrumbs";
import {useNavigate, useParams} from "react-router-dom";
import {useInView} from 'react-intersection-observer';
import {useImagesByFormFactor, useImagesByWorktype} from "@/processes/hooks/useFetchSchemesImage";

export interface Category {
    id: string
    name: string
    description: string
}

export interface SelectedCategoryType {
    categoryName: string
    subGroups: Category[]
    categoryId: 'worktype' | 'formFactor'
}

const CatalogPage: React.FC = () => {
    const navigate = useNavigate();
    const {categoryId, groupId} = useParams<{ categoryId?: string; groupId?: string }>();

    const [selectedCategory, setSelectedCategory] = useState<SelectedCategoryType>();
    const [selectedGroup, setSelectedGroup] = useState<Category>();
    const [workTypeID, setWorkTypeID] = useState<string | null>(null);
    const [formFactorID, setFormFactorID] = useState<string | null>(null);

    const {data: menuCategoryData} = useCategory();

    const categories = useMemo(() => [
        {categoryName: "По виду работ", subGroups: menuCategoryData?.workType, categoryId: "worktype"},
        {categoryName: "По форм-фактору", subGroups: menuCategoryData?.formFactor, categoryId: "formFactor"}
    ], [menuCategoryData]);

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
    }, [inView, hasNextPage, fetchNextPage]);

    useEffect(() => {
        if (inView && hasNextFormFactor) {
            fetchNextFormFactor();
        }
    }, [inView, hasNextFormFactor, fetchNextFormFactor]);

    useEffect(() => {
        if (categoryId) {
            const foundCategory = categories.find(cat => cat.categoryId === categoryId);
            if (foundCategory) {
                setSelectedCategory(foundCategory as SelectedCategoryType);
                setSelectedGroup(undefined);
            }
        } else {
            setSelectedCategory(undefined);
            setSelectedGroup(undefined);
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
                setSelectedGroup(undefined);
            }
        } else {
            // Если нет groupId, сбрасываем выбранную группу
            setSelectedGroup(undefined);
        }
    }, [groupId, selectedCategory]);

    // Формируем breadcrumbs в новом формате
    const breadcrumbItems: BreadcrumbItem[] = useMemo(() => {
        const items: BreadcrumbItem[] = [
            {
                label: 'Главная',
                href: '/'
            }
        ];

        if (selectedCategory) {
            items.push({
                label: selectedCategory.categoryName,
                href: `/catalog/${selectedCategory.categoryId}`
            });
        }

        if (selectedGroup) {
            items.push({
                label: selectedGroup.name,
                href: `/catalog/${selectedCategory?.categoryId}/${selectedGroup.id}`
            });
        }

        return items;
    }, [selectedCategory, selectedGroup]);

    if (!menuCategoryData) {
        return <div>Загрузка...</div>;
    }

    return (
        <Styles.Container>
            <Breadcrumbs items={breadcrumbItems}/>

            {selectedGroup ? (
                <ImageGallery
                    imagesDataList={
                        selectedCategory?.categoryId === "worktype"
                            ? workTypeData?.pages?.flatMap(page => page.results) || undefined
                            : formFactorData?.pages?.flatMap(page => page.results) || undefined
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