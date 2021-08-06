import { FC, useState } from 'react';
import { Link } from 'react-router-dom';

interface Post {
  body: string;
  userId: number;
  title: string;
}

export const Posts: FC<{}> = ({}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [posts, setPosts] = useState<Post[]>([]);

  const handleFetchPosts = () => {
    setIsLoading(true);
    setTimeout(async () => {
      try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts`);
        const resJson: Post[] = await response.json();
        setPosts(resJson);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }, 2000);
  };

  const handleClearPosts = () => {
    setPosts([]);
  };

  return (
    <div className='page-wrap'>
      <h1 className='h1'>Posts</h1>

      <nav className='nav'>
        <Link to='/'>Main page</Link>
      </nav>
      <div className='posts-block'>
        <div className='btns'>
          <button type='button' onClick={handleFetchPosts} className='posts-get-btn'>
            Get posts
          </button>
          <button type='button' onClick={handleClearPosts} className='posts-get-btn'>
            Clear posts
          </button>
        </div>
        <ul>
          {posts.map((post: Post) => {
            const { title, body } = post;
            return (
              <li key={title}>
                <p className='post-title'>{title}</p>
                <p className='post-body'>{body}</p>
              </li>
            );
          })}
          {isLoading ? <p>Loading...</p> : null}
        </ul>
      </div>
    </div>
  );
};
