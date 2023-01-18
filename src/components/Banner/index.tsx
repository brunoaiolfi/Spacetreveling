import styles from './banner.module.scss';

interface BannerProps {
    src: string;
    alt: string;
}

export default function Banner({ src, alt }: BannerProps) {
    return <div className={styles.banner}>
        <img src={src} alt={alt} />
    </div>

}
