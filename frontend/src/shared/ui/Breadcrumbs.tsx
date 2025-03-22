import React from "react";
import styled from "styled-components";

const BreadcrumbContainer = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 16px;
`;

const BreadcrumbItem = styled.span<{ $current?: boolean }>`
    cursor: ${({$current}) => ($current ? "default" : "pointer")};
    font-weight: ${({$current}) => ($current ? "bold" : "normal")};
    color: ${({$current}) => ($current ? "#000" : "#007BFF")};

    &:not(:last-child):after {
        content: "›";
        margin: 0 8px;
    }
`;

interface BreadcrumbsProps {
    selectedCategory: { categoryName: string } | null;
    selectedGroup: { name: string } | null;
    onBreadcrumbClick: (level: "home" | "category") => void;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({selectedCategory, selectedGroup, onBreadcrumbClick}) => {
    return (
        <BreadcrumbContainer>
            <BreadcrumbItem onClick={() => onBreadcrumbClick("home")}>Главная</BreadcrumbItem>
            {selectedCategory && (
                <>
                    <BreadcrumbItem onClick={() => onBreadcrumbClick("category")}>
                        {selectedCategory.categoryName}
                    </BreadcrumbItem>
                </>
            )}
            {selectedGroup && <BreadcrumbItem $current>{selectedGroup.name}</BreadcrumbItem>}
        </BreadcrumbContainer>
    );
};

export default Breadcrumbs;
