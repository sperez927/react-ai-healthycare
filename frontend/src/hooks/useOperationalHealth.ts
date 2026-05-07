import { useQuery } from '@tanstack/react-query'
import { getFeedHealth, getOperationalHealth } from '../api/operational_health'

interface QueryOptions {
  enabled?: boolean
  refetchInterval?: number | false
}

export function useFeedHealth(options?: QueryOptions) {
  return useQuery({
    queryKey: ['feedHealth'],
    queryFn: getFeedHealth,
    refetchInterval: options?.refetchInterval ?? 30_000,
    enabled: options?.enabled ?? true,
  })
}

export function useOperationalHealth(options?: QueryOptions) {
  return useQuery({
    queryKey: ['operationalHealth'],
    queryFn: getOperationalHealth,
    refetchInterval: options?.refetchInterval ?? 30_000,
    enabled: options?.enabled ?? true,
  })
}
