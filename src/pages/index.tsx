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

export default function Home({ postsPagination }: HomeProps): JSX.Element {

  const [posts, setPosts] = useState(postsPagination?.results ?? [])
  async function fetchData() {
    try {
      const prismic = getPrismicClient({});

      const postsResponse = await prismic.getByType("aiolfiposts", {
        fetch: ['posts.title', 'posts.subtitle', 'posts.author'],
      })

      const posts: Post[] = parseResult(postsResponse.results);

      const data: PostPagination = {
        next_page: postsResponse.next_page,
        results: posts
      }

      return data;
    } catch (error) {
      console.log(error)
    }
  }

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
    </main>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({});
  const postsResponse = await prismic.getByType("aiolfiposts",
    {
      fetch: ['posts.title', 'posts.subtitle', 'posts.author'],
      pageSize: 5,
    }
  );

  console.log(postsResponse.results);

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

