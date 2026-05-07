import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useReplayGuardedMutation } from './useReplayGuardedMutation'
import { getTask, getTasks, createTask, updateTask, transitionTask, getAllowedTransitions } from '../api/tasks'
import type { PaginationParams, AsOfParam, WorkflowStatus, TransitionTaskBody, CreateTaskBody, UpdateTaskBody } from '../api/types'
import { fetchAllPaginated } from './fetchAllPaginated'

type Params = PaginationParams &
  AsOfParam & {
    site_id?: string | null
    workflow_status?: WorkflowStatus | null
    priority?: string | null
  }

interface QueryOptions {
  enabled?: boolean
}

function cleanParams<T extends Record<string, unknown>>(params: T | undefined): T | undefined {
  if (!params) return undefined
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value != null)
  ) as T
}

export function useTask(id: string | undefined, params?: AsOfParam) {
  return useQuery({
    queryKey: ['tasks', id, params],
    queryFn: () => getTask(id!, params),
    enabled: Boolean(id),
  })
}

export function useTasks(params?: Params, options?: QueryOptions) {
  return useQuery({
    queryKey: ['tasks', params],
    queryFn: () => getTasks(cleanParams(params)),
    enabled: options?.enabled ?? true,
  })
}

export function useAllTasks(params?: Omit<Params, 'page' | 'per_page'>, options?: QueryOptions) {
  return useQuery({
    queryKey: ['tasks', 'all', params],
    queryFn: ({ signal }) => fetchAllPaginated(getTasks, cleanParams(params), { signal }),
    enabled: options?.enabled ?? true,
  })
}

export function useAllowedTransitions(taskId: string | null) {
  return useQuery({
    queryKey: ['tasks', taskId, 'allowed_transitions'],
    queryFn: () => getAllowedTransitions(taskId!),
    enabled: taskId !== null,
  })
}

export function useCreateTask() {
  const queryClient = useQueryClient()
  return useReplayGuardedMutation({
    mutationFn: (body: CreateTaskBody) => createTask(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['readiness'] })
    },
  })
}

export function useUpdateTask() {
  const queryClient = useQueryClient()
  return useReplayGuardedMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateTaskBody }) =>
      updateTask(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['readiness'] })
      queryClient.invalidateQueries({ queryKey: ['planning'] })
    },
  })
}

export function useTransitionTask() {
  const queryClient = useQueryClient()

  return useReplayGuardedMutation({
    mutationFn: ({ id, body }: { id: string; body: TransitionTaskBody }) =>
      transitionTask(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['readiness'] })
      queryClient.invalidateQueries({ queryKey: ['planning'] })
    },
  })
}
