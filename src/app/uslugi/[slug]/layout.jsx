import { services } from '@/constants/services';

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const service = services.find(s => s.id === slug);

    if (!service) {
        return {
            title: 'Услуга не найдена | Kreo',
        };
    }

    // Метаданные для услуги "Сайты"
    if (slug === 'sites') {
        return {
            title: 'Создание сайтов под ключ | Разработка лендингов, корпоративных сайтов, интернет-магазинов | Kreo',
            description: 'Разработка сайтов под ключ: лендинги, корпоративные сайты, интернет-магазины. Современный дизайн, высокая скорость загрузки, SEO-оптимизация. Создаем сайты, которые приносят результат и увеличивают продажи. Адаптивная верстка, интеграции с CRM и платежными системами.',
            keywords: 'создание сайтов, разработка сайтов, лендинг, корпоративный сайт, интернет-магазин, веб-разработка, сайт под ключ, разработка сайта, создание лендинга, разработка интернет-магазина, PWA приложение, адаптивный сайт, SEO-оптимизация сайта',
            openGraph: {
                title: 'Создание сайтов под ключ | Kreo',
                description: 'Разработка сайтов: лендинги, корпоративные сайты, интернет-магазины. Современный дизайн, высокая скорость, SEO-оптимизация.',
                type: 'website',
                locale: 'ru_RU',
            },
            alternates: {
                canonical: `/uslugi/${slug}`,
            },
        };
    }

    return {
        title: `${service.title} | Kreo`,
        description: service.description,
    };
}

export default function ServiceLayout({ children }) {
    return children;
}


