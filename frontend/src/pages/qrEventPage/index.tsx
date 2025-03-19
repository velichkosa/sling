import React, {useEffect, useState} from "react";
import {useSearchParams} from "react-router-dom";
import {axiosInstance} from "@/processes/api/axiosConfig";
import axios from "axios";
import {config} from "@/app/config";

const QrEventPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const tech_id = searchParams.get("tech_id");
            const event_id = searchParams.get("event_id");
            const actionType = searchParams.get("actionType");
            const action = searchParams.get("action") ?? "";

            if (!tech_id) {
                setError("Отсутствуют необходимые параметры");
                setLoading(false);
                return;
            }

            try {
                if (actionType === 'shifts') {
                    const response = await axios.get(`${config.apiUrl}/api/v1/${actionType}/qr/${action}`, {
                        params: {tech_id, event_id},
                    });
                    setData(response.data);
                } else {
                    const response = await axios.get(`/api/v1/${actionType}/qr/`, {
                        params: {tech_id, event_id},
                    });
                    setData(response.data);
                }


            } catch (err) {
                setError("Ошибка загрузки данных");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [searchParams]);

    if (loading) return <div>Загрузка...</div>;
    if (error) return <div style={{color: "red", textAlign: "center"}}>{error}</div>;

    return (
        <div style={{
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh"
        }}>
            <h1>Данные события</h1>
            <pre style={{background: "#f4f4f4", padding: "10px", borderRadius: "5px"}}>
                {data.message}
            </pre>

            {/* Показываем изображение при успешном запросе */}
            {data && (
                <img
                    src="/zbs.jpeg"
                    alt="Успешно"
                    style={{marginTop: "20px", maxWidth: "300px", borderRadius: "10px"}}
                />
            )}
        </div>
    );
};

export default QrEventPage;
