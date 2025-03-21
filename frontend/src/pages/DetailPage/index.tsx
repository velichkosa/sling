import React from 'react';
import {useParams} from 'react-router-dom';

const SchemaDetail: React.FC = () => {
    const {id} = useParams<{ id: string }>();

    // Загрузите данные изображения по id
    // Например, можно использовать данные из API или из массива, переданного в компонент ImageGallery

    return (
        <div>
            <h1>Детали изображения {id}</h1>
            {/* Здесь будет отображение подробной информации об изображении */}
        </div>
    );
};

export default SchemaDetail;
