import { Post } from "../../models/interface/Post";
import Link from 'next/link';
import { formatDate } from "../../utils/dates";

export function PostResume({ data, first_publication_date, uid }: Post) {
    return (
        <Link href={`/posts/${uid}`} key={uid}>
            <a key={uid}>
                <strong>{data.title}</strong>
                <p>{data.subtitle}</p>
                <footer>
                    <section>
                        <span>
                            {formatDate(first_publication_date)}
                        </span>
                    </section>
                    <section>
                        <span>
                            {data.author}
                        </span>
                    </section>
                </footer>
            </a>
        </Link>
    )
}