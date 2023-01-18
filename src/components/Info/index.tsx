import styles from './info.module.scss';

interface InfoProps {
  image?: 'calendar' | 'user' | 'clock';
  text: string;
}

export default function Info({ image, text }: InfoProps) {
  return (
    <div className={styles.infoContainer}>
      <img src={`/images/${image}.svg`} alt="publication date" />
      <span>{text}</span>
    </div>
  );
}
