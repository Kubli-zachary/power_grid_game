import { PowerSource } from './power_source'
import { World } from '../world'

export class Battery extends PowerSource {
  static MAX_MW: number = 500
  static MAX_MWH: number = 2000
  static DEFAULT_RATE_LIMIT_MW: number = 250

  private maxStoredMwh: number
  private storedMwh: number
  private rateLimitMw: number

  constructor(
    name: string = 'Battery',
    maxCapacityMw: number = Battery.MAX_MW,
    costPerMw: number = 0,
    maxStoredMwh: number = Battery.MAX_MWH,
    rateLimitMw: number = Battery.DEFAULT_RATE_LIMIT_MW,
    initialStoredMwh: number = Battery.MAX_MWH,
  ) {
    super(name, maxCapacityMw, costPerMw)
    this.maxStoredMwh = Math.max(0, maxStoredMwh)
    this.rateLimitMw = Math.max(0, rateLimitMw)
    this.storedMwh = Math.max(0, Math.min(initialStoredMwh, this.maxStoredMwh))
  }

  getStoredMwh(): number {
    return this.storedMwh
  }

  updateProduction(deltaTime: number, world: World): number {
    void world
    if (Number.isNaN(deltaTime) || !Number.isFinite(deltaTime) || deltaTime <= 0) {
      return this.getProduction()
    }

    const hours = deltaTime / 60
    const maxByRate = Math.min(this.allocatedMw, this.rateLimitMw)
    const maxByEnergy = this.storedMwh / hours
    const outputMw = Math.max(0, Math.min(maxByRate, maxByEnergy, this.maxCapacityMw))

    this.inputMw = outputMw
    this.storedMwh = Math.max(0, this.storedMwh - outputMw * hours)

    return this.getProduction()
  }
}
