import { useQuery } from '@tanstack/react-query'
import { getSites } from '../api/sites'
import type { PaginationParams, AsOfParam } from '../api/types'
import { fetchAllPaginated } from './fetchAllPaginated'

type Params = PaginationParams & AsOfParam

interface QueryOptions {
  enabled?: boolean
}

export function useSites(params?: Params, options?: QueryOptions) {
  return useQuery({
    queryKey: ['sites', params],
    queryFn: () => getSites(params),
    enabled: options?.enabled ?? true,
  })
}

export function useAllSites(params?: Omit<Params, 'page' | 'per_page'>, options?: QueryOptions) {
  return useQuery({
    queryKey: ['sites', 'all', params],
    queryFn: ({ signal }) => fetchAllPaginated(getSites, params, { signal }),
    enabled: options?.enabled ?? true,
  })
}
