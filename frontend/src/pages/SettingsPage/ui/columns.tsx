import React from "react";
import {CellContext, ColumnDef} from "@tanstack/react-table";
import {SPT} from "@/processes/hooks/useFetchSPT";
import "@/shared/assets/Roboto.js"
import {FilterContainer, FilterInputWrapper, FilterLabel, SelectInput, TextInput} from "@/shared/ui/Table/columnsStyle";
import {handleGeneratePDF} from "@/pages/SettingsPage/models/generatePDF";

type FilterConfigItem = {
    key: string;
    label: string;
    filterType: 'input' | 'select';
    dataType: 'string' | 'bool' | 'datetime' | 'decimal' | 'number';
    filterValue?: string[];
};

// Массив с конфигурацией фильтров
const filterConfig: FilterConfigItem[] = [
    // {key: 'id', label: 'ID', dataType: 'string', filterType: 'input'},
    {key: 'org', label: 'Организация', dataType: 'string', filterType: 'input'},
    {key: 'gos_num', label: 'Гос.№', dataType: 'string', filterType: 'input'},
    {key: 'type', label: 'Тип СПТ', dataType: 'string', filterType: 'select', filterValue: ['АЦН', 'Трал']},
    {key: 'type_full', label: 'Параметры', dataType: 'string', filterType: 'input'},
    {key: 'equipment', label: 'Оборудование', dataType: 'string', filterType: 'input'},
    {key: 'status', label: 'Состояние СПТ', dataType: 'string', filterType: 'input'},
];

export interface Columns {
    filter: Record<string, string>;
    handleFilterChange: (key: string, value: string) => void;
    handleKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    inputRefs: React.MutableRefObject<Record<string, HTMLInputElement | null>>;
    sorting: { id: string; desc: boolean }[];
    handleSort: (id: string) => void;
}


const Columns = ({
                     filter,
                     handleFilterChange,
                     handleKeyPress,
                     inputRefs,
                     sorting,
                     handleSort,
                 }: Columns): ColumnDef<SPT>[] => {

    // Добавляем столбец с порядковым номером
    const indexColumn: ColumnDef<SPT> = {
        id: 'index', // Уникальный ключ для столбца
        header: () => (
            <div style={{textAlign: 'center', fontWeight: 'bold'}}>№</div>
        ),
        cell: ({row}) => (
            <div style={{textAlign: 'center'}}>
                {row.index + 1} {/* Индекс строки начинается с 0, поэтому добавляем 1 */}
            </div>
        ),
        size: 50, // Ширина столбца (опционально)
    };

    // Колонка с кнопкой "Генерировать QR"
    const qrColumn: ColumnDef<SPT> = {
        id: 'generateQR',
        header: () => <div style={{textAlign: 'center', fontWeight: 'bold'}}>Действия</div>,
        cell: ({row}: CellContext<SPT, any>) => (
            <div style={{textAlign: 'center'}}>
                <button
                    style={{
                        backgroundColor: '#007bff',
                        color: '#fff',
                        border: 'none',
                        padding: '5px 10px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                    }}
                    onClick={() => handleGeneratePDF(row.original.id, row.original.gos_num)}
                >
                    QR
                </button>
            </div>
        ),
        size: 100, // Ширина колонки
    };

    // Основные столбцы из filterConfig
    const filterColumns = filterConfig.map(({key, label, dataType, filterType, filterValue}) => ({
        id: key,
        accessorKey: key,
        header: () => (
            <FilterContainer>
                <FilterLabel>{label}</FilterLabel>
                <FilterInputWrapper>
                    {filterType === 'select' &&
                        <SelectInput
                            value={filter[key] || ''}
                            onChange={(e) => {
                                handleFilterChange(key, e.target.value);
                            }}
                        >
                            <option value="">Все</option>
                            {filterValue?.map((value) => (
                                <option key={value} value={value}>
                                    {value === 'true' ? 'Да' : value === 'false' ? 'Нет' : value}
                                </option>
                            ))}
                        </SelectInput>
                    }
                    {filterType === 'input' &&
                        <TextInput
                            ref={(el) => (inputRefs.current[key] = el)}
                            type="text"
                            value={filter[key] || ''}
                            onChange={(e) => handleFilterChange(key, e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                    }
                </FilterInputWrapper>
            </FilterContainer>
        ),
        cell: ({getValue}: CellContext<SPT, any>) => {
            let value: any;

            if (dataType === 'datetime') {
                value = new Date(getValue() as string).toLocaleString();
            } else {
                value = getValue();
            }

            return <div style={{textAlign: 'center'}}>{value}</div>;
        },
    }));

    // Объединяем все столбцы
    return [indexColumn, ...filterColumns, qrColumn];
};

export default Columns;
