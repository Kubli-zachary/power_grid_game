
import { PowerSource } from './power_source'
import { World } from '../world'

export class Solar extends PowerSource {
    static MAX_MW: number = 1000

    updateProduction(deltaTime: number, world: World): number {
        this.inputMw = world.getDaylightFactor() * world.getCloudiness() * this.MAX_MW
    }
}