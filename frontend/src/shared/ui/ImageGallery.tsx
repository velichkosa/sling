import React from "react";
import {Link} from "react-router-dom";
import styled from "styled-components";
import {SlingScheme} from "@/processes/hooks/useFetchSchemesImage";
import {Category, SelectedCategoryType} from "@/pages/CatalogPage";



interface ImageGalleryProps {
    imagesDataList: SlingScheme[];
    from: "catalog" | "search";
    selectedCategory?: SelectedCategoryType;
    selectedGroup?: Category;
    refObserver: (node?: Element | null) => void;
    isFetchingNextPage: boolean;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
                                                       imagesDataList,
                                                       from,
                                                       selectedCategory,
                                                       selectedGroup,
                                                       refObserver,
                                                       isFetchingNextPage
                                                   }) => {
    if (!imagesDataList) return null;

    const handleClick = () => {
        localStorage.setItem('prevPath', window.location.href)
        console.log('Текущее местоположение:', window.location.href);
    };

    return (
        <GalleryContainer>
            {imagesDataList.length === 0 ? (
                <Message>Изображений не найдено.</Message>
            ) : (
                imagesDataList.map((image: SlingScheme, index) => {
                    const isLastElement = index === imagesDataList.length - 1;
                    return (
                        <Link
                            to={`/image/${image.id}`}
                            key={image.id}
                            state={{from, selectedCategory, selectedGroup}}
                            ref={isLastElement ? refObserver : undefined} // ref только у последнего элемента
                            onClick={handleClick}
                        >
                            <ImageCard>
                                <Image src={image.image} alt={image.title}/>
                                <Overlay>
                                    <ImageTitle>{image.title}</ImageTitle>
                                </Overlay>
                            </ImageCard>
                        </Link>
                    );
                })
            )}

            {isFetchingNextPage && <p>Загружаю...</p>}
        </GalleryContainer>
    );
};

export default ImageGallery;


// Styled-components
const GalleryContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); /* Подстраивается в зависимости от ширины окна */
    gap: 20px;
    width: 100%;
    padding: 20px;
    transition: opacity 0.4s ease, transform 0.4s ease;
`;

const ImageCard = styled.div`
    position: relative;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
    transition: transform 0.3s ease, box-shadow 0.3s ease;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    }
`;

const Image = styled.img`
    width: 100%;
    height: 200px;
    object-fit: cover;
    object-position: bottom; /* Масштабирование по нижнему краю */
    display: block;
    filter: brightness(0.9);
    transition: filter 0.3s ease;

    ${ImageCard}:hover & {
        filter: brightness(1);
    }
`;

const Overlay = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.5);
    color: white;
    padding: 10px;
    text-align: center;
    opacity: 0.8;
    transition: opacity 0.3s ease;

    ${ImageCard}:hover & {
        opacity: 1;
    }
`;

const ImageTitle = styled.p`
    margin: 0;
    font-size: 14px;
`;

const Message = styled.p`
    text-align: center;
    font-size: 16px;
    color: #666;
    margin: 20px 0;
`;
