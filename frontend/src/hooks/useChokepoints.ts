import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useReplayGuardedMutation } from './useReplayGuardedMutation'
import {
  createChokepoint,
  deleteChokepoint,
  getChokepoints,
  updateChokepoint,
} from '../api/chokepoints'
import type {
  ChokepointsParams,
  CreateChokepointBody,
  UpdateChokepointBody,
} from '../api/types'
import { fetchAllPaginated } from './fetchAllPaginated'

interface QueryOptions {
  enabled?: boolean
}

export function useChokepoints(params?: ChokepointsParams, options?: QueryOptions) {
  return useQuery({
    queryKey: ['chokepoints', params],
    queryFn: () => getChokepoints(params),
    enabled: options?.enabled ?? true,
  })
}

export function useAllChokepoints(params?: Omit<ChokepointsParams, 'page' | 'per_page'>, options?: QueryOptions) {
  return useQuery({
    queryKey: ['chokepoints', 'all', params],
    queryFn: ({ signal }) => fetchAllPaginated(getChokepoints, params, { signal }),
    enabled: options?.enabled ?? true,
  })
}

export function useCreateChokepoint() {
  const queryClient = useQueryClient()
  return useReplayGuardedMutation({
    mutationFn: (body: CreateChokepointBody) => createChokepoint(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['planning'] })
      queryClient.invalidateQueries({ queryKey: ['chokepoints'] })
    },
  })
}

export function useUpdateChokepoint() {
  const queryClient = useQueryClient()
  return useReplayGuardedMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateChokepointBody }) => updateChokepoint(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['planning'] })
      queryClient.invalidateQueries({ queryKey: ['chokepoints'] })
    },
  })
}

export function useDeleteChokepoint() {
  const queryClient = useQueryClient()
  return useReplayGuardedMutation({
    mutationFn: (id: string) => deleteChokepoint(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['planning'] })
      queryClient.invalidateQueries({ queryKey: ['chokepoints'] })
    },
  })
}
