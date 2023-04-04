import * as React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { SearchArgs, getSearchQuery } from '../search/get';

export const SearchExample: React.FC<SearchArgs> = (props) => {
  const queryClient = useQueryClient();
  const query = useQuery(getSearchQuery(props));

  return (
    <div>
      <div>
        <button
          onClick={() => {
            queryClient.invalidateQueries();
          }}
        >
          Invalidate Query
        </button>

        <button onClick={() => query.refetch()}>Fetch Query</button>
      </div>

      {query.isError ? (
        <pre>
          <label style={{ color: 'red', fontWeight: 700, fontSize: '1.5rem' }}>
            Error
          </label>
          <br />
          {JSON.stringify(query.error ?? {}, null, 2) as React.ReactNode}
        </pre>
      ) : (
        <pre>
          <label
            style={{ color: 'green', fontWeight: 700, fontSize: '1.5rem' }}
          >
            Data
          </label>
          <br />
          {query.isLoading
            ? 'Loading...'
            : JSON.stringify(query.data ?? {}, null, 2)}
        </pre>
      )}
    </div>
  );
};
