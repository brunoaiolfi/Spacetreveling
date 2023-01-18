import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';

import { getPrismicClient } from '../../services/prismic';

import { FiLoader } from 'react-icons/fi';
import { RichText } from 'prismic-dom';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import Info from '../../components/Info';
import Banner from '../../components/Banner';
import { formatDate } from '../../utils/dates';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  const router = useRouter();

  if (router.isFallback) {
    return (
      <>
        <main className={styles.loading}>
          <FiLoader />
          <span>Carregando...</span>
        </main>
      </>
    );
  }


  const averageWordsPerMinute = Number(
    process.env.AVERAGE_WORDS_PER_MINUTE ?? 200
  );

  const postWords = post.data.content.reduce(
    (acc, c) =>
      acc +
      c.heading.split(' ').length +
      RichText.asText(c.body).split(' ').length,
    0
  );


  const timeReading = Math.ceil(postWords / averageWordsPerMinute);

  return (
    <>
      <Banner src={post.data.banner.url} alt="post banner" />
      <main className={commonStyles.container}>
        <div className={styles.postContainer}>
          <p className={styles.postTitle}>{post.data.title}</p>
          <div className={styles.infos}>
            <Info
              image="calendar"
              text={formatDate(post.first_publication_date)}
            />
            <Info image="user" text={post.data.author} />
            <Info image="clock" text={`${timeReading} min`} />
          </div>
          {post.data.content.map(content => (
            <div key={content.heading} className={styles.postContent}>
              <p className={styles.contentHeading}>{content.heading}</p>
              <div
                dangerouslySetInnerHTML={{
                  __html: RichText.asHtml(content.body),
                }}
              />
            </div>
          ))}
        </div>
      </main>
    </>
  )
}


export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient({});
  const posts = await prismic.getByType('aiolfiposts',
    { pageSize: 1 }
  );
  const paths = posts.results.map(p => ({ params: { slug: p.uid } }));

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps = async ({ params }) => {
  const { slug } = params;

  const prismic = getPrismicClient({});
  const response = await prismic.getByUID('aiolfiposts', slug as string, {});
  console.log("response:")
  console.log(response)

  const post: Post = {
    uid: response.uid,
    first_publication_date: response.first_publication_date,
    data: {
      ...response.data
    }
  }

  return {
    props: {
      post
    },
    revalidate: 60 * 60 * 6
  }
};
