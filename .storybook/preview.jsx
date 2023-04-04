import React from 'react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export const decorators = [
  (story) => (
    <QueryClientProvider client={queryClient}>
      {story()}
      <ReactQueryDevtools />
    </QueryClientProvider>
  ),
];
