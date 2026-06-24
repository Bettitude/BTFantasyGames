import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime:    10 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export const STALE = {
  LIVE:       30 * 1000,
  PLAYER:     5  * 60 * 1000,
  FIXTURES:   10 * 60 * 1000,
  STANDINGS:  30 * 60 * 1000,
  PLAYERS:    60 * 60 * 1000,
};
