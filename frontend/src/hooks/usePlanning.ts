import { useQuery } from '@tanstack/react-query'
import { getPlanning } from '../api/planning'
import { useReplay } from '../context/ReplayContext'

interface QueryOptions {
  enabled?: boolean
}

export function usePlanning(options?: QueryOptions) {
  const { asOf } = useReplay()
  const enabled = options?.enabled ?? true

  return useQuery({
    queryKey: ['planning', { as_of: asOf ?? null }],
    queryFn: () => getPlanning({ as_of: asOf }),
    enabled,
    // Planning data is re-fetched on task/task-transition/posture/doctrine/
    // chokepoint SSE events in AppShell, so a 60s stale window avoids
    // redundant background polls.
    staleTime: 60_000,
  })
}
