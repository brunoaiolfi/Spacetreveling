import { useState } from 'react';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';

import { getPrismicClient } from '../services/prismic';
import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import { PrismicDocument } from '@prismicio/types';
import { Post } from '../models/interface/Post';
import { PostResume } from '../components/PostResume';



interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

function parseResult(result: PrismicDocument<Record<string, any>, string, string>[]): Post[] {
  const posts: Post[] = result.map(({
    data,
    uid,
    first_publication_date
  }) => ({
    data: {
      author: data.author,
      subtitle: data.subtitle,
      title: data.title,
    },
    first_publication_date,
    uid
  }))

  return posts;
}

const ACCESS_TOKEN = encodeURIComponent(process.env.PRISMIC_ACCESS_TOKEN);

export default function Home({ postsPagination }: HomeProps): JSX.Element {

  const [posts, setPosts] = useState(postsPagination?.results ?? [])
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextPage, setNextPage] = useState(postsPagination.next_page);

  const handleLoadMorePosts = (): void => {
    setLoadingMore(true);
    console.log(nextPage)
    fetch(`${nextPage}&access_token=${ACCESS_TOKEN}`)
      .then(result => result.json())
      .then(response => {
        setPosts([...posts, ...parseResult(response.results)]);
        setNextPage(response.next_page);
        setLoadingMore(false);
      })
      .catch(error => {
        setLoadingMore(false);
        alert(`Error fetching more posts: ${error.message}`);
      });
  };

  return (
    <main className={styles.container}>
      <div className={styles.posts} >
        {
          posts.map(({ data, first_publication_date, uid }) =>
          (
            <PostResume
              data={data}
              first_publication_date={first_publication_date}
              uid={uid}
            />
          ))
        }
      </div>
      {!!nextPage && (
        <button
          type="button"
          disabled={loadingMore}
          onClick={handleLoadMorePosts}
          className={styles.loadingMore}
        >
          {loadingMore ? 'Carregando...' : 'Carregar mais posts'}
        </button>
      )}
    </main>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({});
  const postsResponse = await prismic.getByType("aiolfiposts",
    {
      fetch: ['posts.title', 'posts.subtitle', 'posts.author'],
      pageSize: 1,
    }
  );


  const posts: Post[] = parseResult(postsResponse.results)

  return {
    revalidate: 60 * 60,
    props: {
      postsPagination: {
        results: posts ?? [],
        next_page: postsResponse.next_page,
      },
    },
  };
};

