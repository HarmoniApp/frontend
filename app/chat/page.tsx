import Chat from "@/components/chat";
import Navbar from "@/components/navbar";
import styles from './main.module.scss';

export default function Employees() {

    return (
        <div>
            <Navbar />
            {/* <div className={styles.overlay}></div> */}
            {/* <div className={styles.centeredText}>Funkcjonalnosc narazie nie jest dosteona. Pracujemy nad tym. Za utrudnienia przepraszamy</div> */}
            <div className={styles.chatContainer}>
                {/* TODO: change it to real userId */}
                {/* <Chat userId={47}/>  */}
                <Chat/> 
            </div>
        </div>
    )
}
