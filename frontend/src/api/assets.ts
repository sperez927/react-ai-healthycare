import { api } from './client'
import type { Asset, AssetStatus, PaginatedResponse, PaginationParams, AsOfParam } from './types'

type AssetsParams = PaginationParams & AsOfParam & {
  home_site_id?: string
  status?: string
  asset_type?: string
}

export function getAssets(params?: AssetsParams, options?: { signal?: AbortSignal }): Promise<PaginatedResponse<Asset>> {
  return api.get('/api/assets', params, options)
}

export function getAsset(id: string, params?: AsOfParam): Promise<Asset> {
  return api.get(`/api/assets/${id}`, params)
}

export function updateAssetStatus(id: string, status: AssetStatus): Promise<Asset> {
  return api.patch(`/api/assets/${id}`, { asset: { status } })
}
