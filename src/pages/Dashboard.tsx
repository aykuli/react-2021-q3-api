import { AxiosResponse } from 'axios';
import React, { ChangeEvent, FC, useState } from 'react';
import { Articles } from '../components/Articles';
import axios from '../services/api';
import { Article, GET200_Articles, SortType } from '../types';

const API_KEY = 'your key';

export const Dashboard: FC = () => {
  const [searchValue, setSearchValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [arts, setArts] = useState<Article[]>([]);
  const [sortBy, setSortBy] = useState<SortType>(SortType.popularity);
  const [page, setPage] = useState<number>(1);

  const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response: AxiosResponse<GET200_Articles> = await axios.get(
        `v2/everything?q=${searchValue}&apiKey=${API_KEY}&sortBy=${sortBy}&pageSize=10&page=${page}`,
      );
      setArts(response.data.articles);
    } catch (err: any) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchValue(value);
  };

  return (
    <div className='page-wrap'>
      <form className='search-gr' onSubmit={handleSubmit}>
        <label htmlFor='search'>
          <input id='search' type='text' value={searchValue} onChange={handleChange} className='input' />
        </label>
        <div style={{}} className='radios'>
          <label>
            <input
              type='radio'
              value={SortType.relevancy}
              checked={sortBy === SortType.relevancy}
              onChange={() => setSortBy(SortType.relevancy)}
            />{' '}
            relevancy
          </label>
          <label>
            <input
              type='radio'
              value={SortType.popularity}
              checked={sortBy === SortType.popularity}
              onChange={() => setSortBy(SortType.popularity)}
            />{' '}
            popularity
          </label>
          <label>
            <input
              type='radio'
              value={SortType.publishedAt}
              checked={sortBy === SortType.publishedAt}
              onChange={() => setSortBy(SortType.publishedAt)}
            />{' '}
            publishedAt
          </label>
        </div>
        <div>
          <input type='date' />
        </div>
        <button type='submit' disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Search'}
        </button>
      </form>
      <Articles articles={arts} page={page} onChangePage={(pageFromInput: number) => setPage(pageFromInput)} />
    </div>
  );
};
