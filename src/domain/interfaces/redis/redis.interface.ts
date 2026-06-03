export abstract class IRedisService {
  abstract del(key: string): Promise<void>
  abstract get(key: string): Promise<string | null>
  abstract ping(): Promise<string>
  abstract set(key: string, value: string, ttl?: number): Promise<void>
}
