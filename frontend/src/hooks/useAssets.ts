import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useReplayGuardedMutation } from './useReplayGuardedMutation'
import { getAsset, getAssets, updateAssetStatus } from '../api/assets'
import type { AssetStatus, PaginationParams, AsOfParam } from '../api/types'
import { fetchAllPaginated } from './fetchAllPaginated'

type Params = PaginationParams & AsOfParam & {
  home_site_id?: string
  status?: string
  asset_type?: string
}

interface QueryOptions {
  enabled?: boolean
}

export function useAssets(params?: Params, options?: QueryOptions) {
  return useQuery({
    queryKey: ['assets', params],
    queryFn: () => getAssets(params),
    enabled: options?.enabled ?? true,
  })
}

export function useAllAssets(params?: Omit<Params, 'page' | 'per_page'>, options?: QueryOptions) {
  return useQuery({
    queryKey: ['assets', 'all', params],
    queryFn: ({ signal }) => fetchAllPaginated(getAssets, params, { signal }),
    enabled: options?.enabled ?? true,
  })
}

export function useAsset(id: string | undefined, params?: AsOfParam) {
  return useQuery({
    queryKey: ['assets', id, params],
    queryFn: () => getAsset(id!, params),
    enabled: Boolean(id),
  })
}

export function useUpdateAssetStatus() {
  const queryClient = useQueryClient()
  return useReplayGuardedMutation({
    mutationFn: ({ id, status }: { id: string; status: AssetStatus }) =>
      updateAssetStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] })
    },
  })
}
