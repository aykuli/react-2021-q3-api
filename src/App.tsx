import React, { FC, Suspense } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Posts } from './pages/Posts';
import { Dashboard } from './pages/Dashboard';

const navData = [
  {
    Component: <Dashboard />,
    path: '/',
  },

  {
    Component: <Posts />,
    path: '/posts',
  },
];
export const App: FC = () => {
  return (
    <div className='App'>
      <Suspense fallback={<div>Loading...</div>}>
        <Switch>
          {navData.map(({ Component, path }): JSX.Element => {
            return (
              <Route path={path} exact key={path.toString()}>
                {Component}
              </Route>
            );
          })}
          <Redirect to='/' />
        </Switch>
      </Suspense>
    </div>
  );
};
