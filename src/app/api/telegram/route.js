import { NextResponse } from 'next/server';

/**
 * API endpoint для отправки заявок в Telegram бота
 * POST /api/telegram
 */
export async function POST(request) {
    try {
        const body = await request.json();
        const { name, email, phone, message } = body;

        // Валидация данных
        if (!name || !email || !phone) {
            return NextResponse.json(
                { error: 'Необходимо заполнить все обязательные поля' },
                { status: 400 }
            );
        }

        // Получаем токен бота и chat_id из переменных окружения
        const botToken = process.env.TELEGRAM_BOT_TOKEN;
        const chatId = process.env.TELEGRAM_CHAT_ID;

        if (!botToken || !chatId) {
            console.error('TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID не настроены');
            return NextResponse.json(
                { error: 'Сервис временно недоступен. Пожалуйста, свяжитесь с нами напрямую.' },
                { status: 500 }
            );
        }

        // Формируем сообщение для Telegram
        const telegramMessage = `
🆕 *Новая заявка с сайта*

👤 *Имя:* ${name}
📧 *Email:* ${email}
📱 *Телефон:* ${phone}
💬 *Сообщение:*
${message || 'Не указано'}

---
_Время отправки: ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })}_
        `.trim();

        // Отправляем сообщение в Telegram
        const telegramApiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
        
        const response = await fetch(telegramApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: telegramMessage,
                parse_mode: 'Markdown',
            }),
        });

        const data = await response.json();

        if (!response.ok || !data.ok) {
            console.error('Ошибка отправки в Telegram:', data);
            return NextResponse.json(
                { error: 'Ошибка при отправке заявки. Пожалуйста, попробуйте позже.' },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { success: true, message: 'Заявка успешно отправлена!' },
            { status: 200 }
        );

    } catch (error) {
        console.error('Ошибка обработки заявки:', error);
        return NextResponse.json(
            { error: 'Произошла ошибка при обработке заявки' },
            { status: 500 }
        );
    }
}

