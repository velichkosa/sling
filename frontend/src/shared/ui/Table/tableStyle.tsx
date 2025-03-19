import styled from "styled-components";

export const TableWrapper = styled.div`
    margin: 20px 0;
    height: calc(100vh - 176px);
    display: flex;
    flex-direction: column;
    width: 100%;
    @media (max-width: 768px) {
        width: 100vw;
    }
`;

export const TableScrollable = styled.div`
    flex: 1; /* Растягивает область таблицы */
    overflow-x: auto;
    overflow-y: auto; /* Добавляем вертикальную прокрутку */
    border: 1px solid #ddd;
    border-radius: 8px;
`;

export const StyledTable = styled.table`
    width: 100%;
    height: 100%; /* Таблица занимает доступное пространство */
    border-collapse: collapse;
    text-align: left;

    th,
    td {
        padding: 12px;
        border: 1px solid #ddd;
        vertical-align: middle;
        word-wrap: break-word;
    }

    thead th {
        background-color: #f9fafb;
        color: #333;
        font-weight: bold;
        position: sticky;
        top: 0;
        z-index: 1;
    }

    tbody tr:nth-child(even) {
        background-color: #f8f8f8;
    }

    tbody tr:hover {
        background-color: #f1f5f9;
    }

    td {
        font-size: 14px;
    }
`;

export interface HeaderCellProps {
    $canSort: boolean;
}

export const HeaderCell = styled.div<HeaderCellProps>`
    cursor: ${({ $canSort }) => ($canSort ? "pointer" : "default")};
    display: flex;
    align-items: center;

    &:hover {
        ${({ $canSort }) => $canSort && "text-decoration: underline;"}
    }
`;

export const PaginationStyle = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 16px;

    button {
        padding: 8px 12px;
        margin: 0 4px;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.3s;

        &:hover {
            background-color: #0056b3;
        }

        &:disabled {
            background-color: #e2e6ea;
            cursor: not-allowed;
        }
    }
`;
