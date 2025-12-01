
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import CustomCursor from '@/components/CustomCursor';
import { CONTACTS } from '@/constants';

export default function Layout({ children }) {
    return (
                <div className="bg-white text-gray-900 font-sans flex flex-col min-h-screen cursor-none">
                    <CustomCursor />
            <motion.header 
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="px-6 md:px-12 py-8"
            >
                <div className="flex justify-start items-center">
                    <Link to="/" className="font-bold text-lg text-black">
                        Kreo
                    </Link>
                </div>
            </motion.header>

            <main className="flex-grow flex flex-col justify-center">
                {children}
            </main>

            <motion.footer 
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="px-6 md:px-12 py-8"
            >
                <div className="flex justify-between items-center text-xs text-gray-500 border-t border-gray-200 pt-6">
                    <a href={`mailto:${CONTACTS.email}`} className="hover:text-black transition-colors">{CONTACTS.email}</a>
                    <p>© 2024 Kreo</p>
                </div>
            </motion.footer>
        </div>
    );
}
