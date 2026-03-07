import { PowerSource } from './power_source'
import { World } from '../world'

export class Solar extends PowerSource {
    static MAX_MW: number = 1000

    updateProduction(deltaTime: number, world: World): number {
        if (Number.isNaN(deltaTime) || !Number.isFinite(deltaTime)) {
            return this.getProduction()
        }

        const rawInput =
            world.getDaylightFactor() * world.getCloudiness() * Solar.MAX_MW
        this.inputMw = Math.max(0, Math.min(this.maxCapacityMw, rawInput))
        return this.getProduction()
    }
}