import { api } from './client'
import type { QueryParams } from './client'

export interface Vessel {
  id: string
  mmsi: string
  name: string | null
  vessel_type: string | null
  flag: string | null
  destination: string | null
  lat: string | number
  lng: string | number
  speed: string | number | null
  heading: string | number | null
  first_seen_at: string
  last_seen_at: string
  loitering_since: string | null
  dark: boolean
  loitering: boolean
  last_signal_id: string | null
}

export interface VesselTrack {
  id: string
  lat: string | number
  lng: string | number
  speed: string | number | null
  heading: string | number | null
  occurred_at: string
}

export interface VesselsParams extends QueryParams {
  mmsi?: string
  loitering?: boolean
  dark_hours?: number
  per_page?: number
  page?: number
}

export function getVessels(params?: VesselsParams): Promise<{ data: Vessel[]; meta: Record<string, number> }> {
  return api.get('/api/vessels', params)
}

export function getVessel(id: string): Promise<Vessel> {
  return api.get(`/api/vessels/${id}`)
}

export function getVesselTracks(id: string, params?: { from?: string; to?: string; limit?: number }): Promise<{ data: VesselTrack[] }> {
  return api.get(`/api/vessels/${id}/tracks`, params)
}
