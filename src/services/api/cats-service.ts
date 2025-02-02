import { Cat } from '@/domain/cat'
import { BaseAPIService } from './base-api-service'

interface GetCommand {
  id: string
}

export class CatsService extends BaseAPIService {
  constructor(baseUrl?: string) {
    super(baseUrl);
  }
  async get (params: GetCommand): Promise<Cat | null> {
    return await this._fetchGET(`${this.baseUrl}/cats/${params.id}`)
  }

  async delete (id: string): Promise<Cat | null> {
    return this._fetchDELETE(`${this.baseUrl}/cats/${id}`)
  }

  async all(keyWords?: string): Promise<{ cats: Cat[] } | null> {
    return this._fetchGET(`${this.baseUrl}/cats${keyWords ? `?keyWords=${keyWords}` : ''}`)
  }

  async update(id: string, cat: Cat): Promise<Cat | null> {
    return this._fetchPUT(`${this.baseUrl}/cats/${id}`, cat);
  }

  async create(cat: Cat): Promise<Cat | null> {
    return this._fetchPOST(`${this.baseUrl}/cats`, cat);
  }
}
