export interface Post {
    uid?: string;
    first_publication_date: string | null;
    data: {
      title: string;
      subtitle: string;
      author: string;
    };
  }