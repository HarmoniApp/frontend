import Chat from "@/components/chat";
import Navbar from "@/components/navbar";
import styles from '@/styles/components/pages.module.scss';

export default function ChatPage() {
    return (
        <div className={styles.pageContainer}>
            <Navbar />
            <Chat/> 
        </div>
    )
}