import React, {useState} from "react";
import {ColumnDef} from "@tanstack/react-table";
import {ShiftSummary} from "@/processes/hooks/useFetchVWShiftSummary";
import {formatDuration} from "@/pages/AlertPage/model/helpers";
import {FilterContainer, FilterInputWrapper, FilterLabel, SelectInput, TextInput} from "@/shared/ui/Table/columnsStyle";
import moment from 'moment';
import {ru} from 'date-fns/locale/ru';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styled from "styled-components";
import {confirmEvent} from "@/pages/AlertPage/model/useAlertPage";
import {useQueryClient} from "react-query";
import {FaCheckCircle} from "react-icons/fa";

export interface Columns {
    filter: Record<string, string>;
    handleFilterChange: (key: string, value: string) => void;
    handleKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    inputRefs: React.MutableRefObject<Record<string, HTMLInputElement | null>>;
    sorting: { id: string; desc: boolean }[];
    handleSort: (id: string) => void;
}

type FilterConfigItem = {
    key: string;
    label: string;
    filterType: 'input' | 'select' | 'date';
    dataType: 'string' | 'bool' | 'datetime' | 'decimal' | 'number';
    filterValue?: string[]; // filterValue присутствует только для типа 'select'
};

// Массив с конфигурацией фильтров
const filterConfig: FilterConfigItem[] = [
    {key: 'id', label: '№', dataType: 'string', filterType: 'input'},
    {key: 'start_time', label: 'Начало смены', dataType: 'datetime', filterType: 'date'},
    {key: 'org', label: 'Организация', dataType: 'string', filterType: 'input'},
    {key: 'tech_gos_number', label: 'Гос. номер СПТ', dataType: 'string', filterType: 'input'},
    {key: 'tech_type', label: 'Тип СПТ', dataType: 'string', filterType: 'select', filterValue: ['АЦН', 'Трал']},
    {key: 'equipment_details', label: 'Оборудование', dataType: 'string', filterType: 'input'},
    {key: 'event_name', label: 'Текущее событие', dataType: 'string', filterType: 'input'},
    {key: 'event_start_time', label: 'Событие установлено', dataType: 'datetime', filterType: 'date'},
];

const Columns = ({
                     filter,
                     handleFilterChange,
                     handleKeyPress,
                     inputRefs,
                     sorting,
                     handleSort,
                 }: Columns): ColumnDef<ShiftSummary>[] => {
    const queryClient = useQueryClient();
    const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);

    return filterConfig.map(({key, label, dataType, filterType, filterValue}) => ({
        id: key,
        accessorKey: key,
        header: () => (
            <FilterContainer>
                <FilterLabel>{label}</FilterLabel>

                <FilterInputWrapper>
                    {filterType === "select" && (
                        <SelectInput
                            value={filter[key] || ""}
                            onChange={(e) => handleFilterChange(key, e.target.value)}
                        >
                            <option value="">Все</option>
                            {filterValue?.map((value) => (
                                <option key={value} value={value}>
                                    {value === "true" ? "Да" : value === "false" ? "Нет" : value}
                                </option>
                            ))}
                        </SelectInput>
                    )}
                    {filterType === "input" && (
                        <TextInput
                            ref={(el) => (inputRefs.current[key] = el)}
                            type="text"
                            value={filter[key] || ""}
                            onChange={(e) => handleFilterChange(key, e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                    )}
                    {filterType === "date" && (
                        <DatePicker
                            selected={filter[key] ? moment(filter[key], "DD.MM.YYYY").toDate() : null}
                            onChange={(date: Date | null) => {
                                const formattedDate = date ? moment(date).format("DD.MM.YYYY") : "";
                                handleFilterChange(key, formattedDate);
                            }}
                            dateFormat="dd.MM.YYYY"
                            locale={ru}
                            isClearable
                        />
                    )}
                </FilterInputWrapper>
            </FilterContainer>
        ),
        cell: ({getValue, row}) => {
            // Логика для упрощения условий
            const isEventName = key === "event_name";
            const isEventStartTime = key === "event_start_time";
            const isStartTime = key === "start_time";
            const isFinishTimeNotSet = !row.original.finish_time;
            const hasEventDuration = row.original.event_duration_seconds;
            const hasShiftDuration = row.original.shift_duration_seconds;
            const isEventNameOrStartTime = isEventName || isEventStartTime; // Правильное условие
            let value: any;

            // Условие для отображения кнопки
            const showConfirmButton = isFinishTimeNotSet && !row.original.event_confirmation;
            const showConfirmedLabel = isEventName && isFinishTimeNotSet && row.original.event_confirmation;

            // Условие для отображения длительности события
            const showEventDuration = isFinishTimeNotSet && hasEventDuration ? (
                <div style={{marginTop: "5px", fontSize: "14px", color: "#888"}}>
                    {formatDuration(row.original.event_duration_seconds)}
                </div>
            ) : null;

            // Условие для отображения длительности смены
            const showShiftDuration = isStartTime && hasShiftDuration ? (
                <div style={{marginTop: "5px", fontSize: "14px", color: "#888"}}>
                    {formatDuration(row.original.shift_duration_seconds)}
                </div>
            ) : null;


            if (dataType === "datetime") {
                value = new Date(getValue() as string).toLocaleString();
            } else {
                value = getValue();
            }

            const handleClick = async () => {
                try {
                    console.log(row.original);
                    const response = await confirmEvent(row.original.event_id);

                    if (response.status === 200) {
                        await queryClient.invalidateQueries(['shiftSummary']); // 🔄 Обновление данных
                    }
                } catch (error) {
                    console.error("Ошибка при подтверждении события:", error);
                }
            };

            return (
                <>
                    {/*Текущее событие*/}
                    {isEventName && (
                        <div style={{position: "relative", width: '100%', height: '100%'}}
                             onMouseEnter={() => key === "event_name" && setHoveredRowId(row.id)}
                             onMouseLeave={() => key === "event_name" && setHoveredRowId(null)}>

                            {/* Условия для отображения иконки "Подтверждено" */}
                            {showConfirmedLabel && (
                                <StyledFaCheckCircle/>
                            )}

                            {/* Центрированное содержимое с надписью */}
                            {(isEventName && !row.original.finish_time) &&
                                <EventNameLabel>
                                    {/*Отображаем текст, если это event_name или event_start_time*/}
                                    {!row.original.finish_time ? (
                                        <>
                                            {/* Условия для отображения кнопки "Подтвердить" */}
                                            {showConfirmButton && hoveredRowId === row.id
                                                ?
                                                <Button onClick={handleClick}>
                                                    Подтвердить
                                                </Button>
                                                : value
                                            }
                                        </>
                                    ) : null}
                                </EventNameLabel>
                            }
                        </div>
                    )}

                    {/*Событие установлено*/}
                    {isEventStartTime && (
                        <>
                            {!row.original.finish_time ? (
                                <>{value}</>
                            ) : null}

                            {/* Отображаем длительность события, если есть event_duration_seconds */}
                            {showEventDuration}
                        </>
                    )}


                    {/* Показать значение, если не event_name и не event_start_time */}
                    {!isEventNameOrStartTime && value}


                    {/* Отображаем длительность смены, если есть shift_duration_seconds */}
                    {showShiftDuration}
                </>
            );
        },
    }));
};

export default Columns;

const EventNameLabel = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center
`;

const Button = styled.button`
    position: absolute;
    left: 50%;
    top: 100%;
    transform: translateX(-50%);
    margin-top: 5px;
    padding: 4px 8px;
    font-size: 12px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: "pointer"
`;

const StyledFaCheckCircle = styled(FaCheckCircle)`
    position: absolute;
    top: 5px;
    right: 5px;
    color: green;
    font-size: 20px;
`;


//
// // Массив с конфигурацией фильтров
// const filterConfig: FilterConfigItem[] = [
//     {key: 'id', label: '№', dataType: 'string', filterType: 'input'},
//     {key: 'start_time', label: 'Начало смены', dataType: 'datetime', filterType: 'date'},
//     // {key: 'finish_time', label: 'Окончание смены', dataType: 'datetime', filterType: 'input'},
//     // {key: 'shift_duration_seconds', label: 'Продолжительность смены', dataType: 'decimal', filterType: 'input'},
//     {key: 'org', label: 'Организация', dataType: 'string', filterType: 'input'},
//     {key: 'tech_gos_number', label: 'Гос. номер СПТ', dataType: 'string', filterType: 'input'},
//     {key: 'tech_type', label: 'Тип СПТ', dataType: 'string', filterType: 'select', filterValue: ['АЦН', 'Трал']},
//     {key: 'equipment_details', label: 'Оборудование', dataType: 'string', filterType: 'input'},
//     // {key: 'tech_status', label: 'Состояние СПТ', dataType: 'string', filterType: 'input'},
//     {key: 'event_name', label: 'Текущее событие', dataType: 'string', filterType: 'input'},
//     {key: 'event_start_time', label: 'Событие установлено', dataType: 'datetime', filterType: 'date'},
//     // {key: 'event_finish_time', label: 'Событие изменено', dataType: 'datetime', filterType: 'input'},
//     // {key: 'event_duration_seconds', label: 'Продолжительность событие', dataType: 'decimal', filterType: 'input'},
// ];