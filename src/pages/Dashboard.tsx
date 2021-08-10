import { AxiosResponse } from 'axios';
import React, { ChangeEvent, FC, useState } from 'react';
import axios from '../services/api';

const API_KEY = 'your key';
interface GetData {
  data?: any;
}

export const Dashboard: FC = () => {
  const [searchValue, setSearchValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // const response: AxiosResponse<any> = await axios.get(
      //   `v2/everything?q=${searchValue}&apiKey=${API_KEY}`,
      // );
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
        <button type='submit' disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Search'}
        </button>
      </form>
    </div>
  );
};
