import React, {useEffect, useRef, useState} from 'react';
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    ColumnSort,
} from '@tanstack/react-table';
import 'react-datepicker/dist/react-datepicker.css';


import {HeaderCell, StyledTable, TableScrollable, TableWrapper} from "@/shared/ui/Table/tableStyle";

export type SortingState = ColumnSort[]

interface TableProps {
    useDataHook: (params: {
        sortBy: string;
        sortOrder: "asc" | "desc";
        filters: { [key: string]: string };
    }) => {
        data: any[] | undefined;
        isLoading: boolean;
        isError: boolean;
        refetch: () => void;
    };
    Columns: (params: {
        filter: { [key: string]: string };
        handleFilterChange: (field: string, value: string) => void;
        handleKeyPress: (e: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>) => void;
        inputRefs: React.MutableRefObject<{ [key: string]: HTMLInputElement | null }>;
        sorting: SortingState;
        handleSort: (columnId: string) => void;

    }) => any[];
    paramTypes?: string;
}

const Table: React.FC<TableProps> = ({useDataHook, Columns}) => {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [filter, setFilter] = useState<{ [key: string]: string }>({});
    const filterRefs = useRef<{ [key: string]: string }>({});
    const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
    const [doRefetch, setDoRefetch] = useState<boolean>(false)

    // Получение данных и фильтры
    const {data, isLoading, isError, refetch} = useDataHook({
        sortBy: sorting[0]?.id ?? "",
        sortOrder: sorting[0]?.desc ? "desc" : "asc",
        filters: filter,
    });

    const handleSort = (columnId: string) => {
        setSorting((prev) => {
            const currentSort = prev.find(sort => sort.id === columnId);
            if (currentSort) {
                return currentSort.desc
                    ? prev.filter(sort => sort.id !== columnId) // Удаляем, если уже отсортировано по убыванию
                    : prev.map(sort =>
                        sort.id === columnId ? {...sort, desc: true} : sort
                    );
            }
            return [{id: columnId, desc: false}]; // Добавляем сортировку по возрастанию
        });
    };

    const handleFilterChange = (field: string, value: string) => {

        // Обновляем значение фильтра
        setFilter((prevFilters) => ({
            ...prevFilters,
            [field]: value  // Обновляем фильтр на основе введенного значения
        }));

        // Возвращаем фокус на поле после изменения фильтра
        setTimeout(() => {
            if (inputRefs.current[field]) {
                inputRefs.current[field]?.focus();
            }
        }, 3);

        // if (['created_at', 'cable_input', 'razryadka'].includes(field) || ['true', 'false'].includes(value)) {
        //     setDoRefetch(!doRefetch);
        // }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (e.key === 'Enter') {
            refetch()
        }
    };

    const resetFilters = () => {
        setFilter({});
        filterRefs.current = {};
        setDoRefetch(!doRefetch)
    };


    const columns = Columns({
        filter,
        handleFilterChange,
        handleKeyPress,
        inputRefs,
        sorting,
        handleSort,
    });

    // Используем новую конфигурацию useReactTable
    const table = useReactTable({
        columns,
        data: data ?? [],
        state: {sorting},
        getCoreRowModel: getCoreRowModel(),
        manualSorting: true,
        onSortingChange: setSorting,
    });

    useEffect(() => {
        refetch()
    }, [sorting, doRefetch]);


    if (isLoading) return <p>Loading...</p>;
    if (isError) return <p>Error loading well information.</p>;

    return (
        <TableWrapper>
            {/* Блок с кнопками */}
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>

                {/* Кнопка для сброса фильтров */}
                {Object.keys(filter).length > 0 &&
                    <button
                        onClick={resetFilters}
                        style={{
                            backgroundColor: '#f44336',  // Красный цвет для сброса
                            color: 'white',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                            transition: 'background-color 0.3s, transform 0.3s',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        Сбросить фильтры
                    </button>}
            </div>

            <TableScrollable>
                <StyledTable>
                    <thead style={{position: 'sticky'}}>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <th
                                    key={header.id}
                                    colSpan={header.colSpan}
                                    style={{width: `${header.column.getSize()}px`}}
                                >
                                    <HeaderCell $canSort={header.column.getCanSort()}>
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </HeaderCell>
                                </th>
                            ))}
                        </tr>
                    ))}
                    </thead>
                    <tbody>
                    {table.getRowModel().rows.map(row => (
                        <tr key={row.id}>
                            {row.getVisibleCells().map(cell => (
                                <td key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </StyledTable>
            </TableScrollable>
        </TableWrapper>
    );

}

export default Table;
