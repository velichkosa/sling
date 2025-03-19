import styled from "styled-components";



export const FilterContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    padding: 4px 0;
`;

export const FilterLabel = styled.span`
    font-size: small;
    font-weight: bold;
    //white-space: nowrap; /* Чтобы лейблы не переносились */
`;

export const FilterInputWrapper = styled.div`
    display: flex;
    justify-content: flex-start;
`;

export const SelectInput = styled.select`
    width: 100px;
    padding: 4px;
    border-radius: 4px;
    border: 1px solid #ccc;
    background-color: #fff;
`;

export const TextInput = styled.input`
    width: 100px;
    padding: 1px;
    border-radius: 4px;
    border: 1px solid #ccc;
    background-color: #fff;
    font-weight: normal;
    font-size: small;
`;