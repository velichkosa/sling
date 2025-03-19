// Обработчик генерации PDF с QR-кодами
import {jsPDF} from "jspdf";
import {config} from "@/app/config";
import QRCode from "qrcode";

export const handleGeneratePDF = async (id: string, gosNum: string) => {
    const doc = new jsPDF();

    // *** Font Embedding ***
    doc.setFont('Roboto-Regular');

    // Название листа по центру
    const title = `QR-коды для ${gosNum}`;
    const pageWidth = doc.internal.pageSize.getWidth();
    doc.setFontSize(16); // Размер шрифта для заголовка
    doc.text(title, pageWidth / 2, 20, {align: 'center'}); // Центрируем текст

    // Пример текста для QR-кодов
    const qrTexts = [
        {text: 'На линии', url: `${config.apiUrl}/qr-event?actionType=shifts&action=start&tech_id=${id}`},
        {
            text: 'На задании',
            url: `${config.apiUrl}/qr-event?actionType=shift_events&tech_id=${id}&event_id=b327ac8c-bd0b-44e1-9ebc-dd0fbede5d79`,
        },
        {
            text: 'Ожидание',
            url: `${config.apiUrl}/qr-event?actionType=shift_events&tech_id=${id}&event_id=8e7ff19a-192f-4149-a2a3-2c25e1a2739f`,
        },
        {text: 'Сход с линии', url: 'ХУЙ ТЕБЕ'}, // Замени текст на нужный URL
    ];

    // Генерация QR-кодов и добавление их в PDF
    for (let i = 0; i < qrTexts.length; i++) {
        const qrDataURL = await QRCode.toDataURL(qrTexts[i].url);
        const x = (i % 2) * 100 + 10; // Позиция по X (два QR-кода в строке)
        const y = Math.floor(i / 2) * 100 + 30; // Позиция по Y (два QR-кода в колонке), добавили отступ для заголовка

        // Добавляем QR-код
        doc.addImage(qrDataURL, 'PNG', x, y, 80, 80);

        // Добавляем подпись
        doc.text(qrTexts[i].text, x + 25, y + 85);
    }

    // Сохраняем PDF
    doc.save(`qr-codes-${id}.pdf`);
};