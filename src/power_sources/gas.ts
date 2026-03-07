import { PowerSource } from './power_source'
import { World } from '../world'

export class Gas extends PowerSource {
  static MAX_MW: number = 1000
  static DEFAULT_RAMP_MW_PER_MIN: number = 40

  private rampMwPerMinute: number

  constructor(
    name: string = 'Gas',
    maxCapacityMw: number = Gas.MAX_MW,
    costPerMw: number = 85,
    rampMwPerMinute: number = Gas.DEFAULT_RAMP_MW_PER_MIN,
  ) {
    super(name, maxCapacityMw, costPerMw)
    this.rampMwPerMinute = Math.max(0, rampMwPerMinute)
  }

  updateProduction(deltaTime: number, world: World): number {
    void world
    if (Number.isNaN(deltaTime) || !Number.isFinite(deltaTime)) {
      return this.getProduction()
    }

    const targetMw = this.allocatedMw
    const maxDelta = this.rampMwPerMinute * deltaTime
    const difference = targetMw - this.inputMw

    if (Math.abs(difference) <= maxDelta) {
      this.inputMw = targetMw
    } else {
      this.inputMw += Math.sign(difference) * maxDelta
    }

    return this.getProduction()
  }
}
