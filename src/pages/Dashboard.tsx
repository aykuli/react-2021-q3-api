import React, { FC } from 'react';
import { Link } from 'react-router-dom';

export const Dashboard: FC = () => {
  return (
    <div className='page-wrap'>
      <h1 className='h1'>Dashboard</h1>

      <nav className='nav'>
        <Link to='/posts'>Posts</Link>
      </nav>
    </div>
  );
};
