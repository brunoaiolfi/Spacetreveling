import { Post } from "../../models/interface/Post";
import Link from 'next/link';
import { formatDate } from "../../utils/dates";
import styles from "./postResume.module.scss"
import Info from "../Info";

export function PostResume({ data, first_publication_date, uid }: Post) {
    return (
        <>
            <Link href={`/post/${uid}`} key={uid}>
                <a key={uid} className={styles.container}>
                    <strong className={styles.title}>{data.title}</strong>
                    <p className={styles.description}>{data.subtitle}</p>
                    <footer className={styles.footer}>
                        <Info
                            image="calendar"
                            text={formatDate(first_publication_date)}
                        />
                        <Info image="user" text={data.author} />
                    </footer>
                </a>
            </Link>
        </>
    )
}