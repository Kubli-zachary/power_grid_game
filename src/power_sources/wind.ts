
import { PowerSource } from './power_source'
import { World } from '../world'

export class Wind extends PowerSource {
    static MAX_MW: number = 1000

    updateProduction(deltaTime: number, world: World): number {
        this.inputMw = world.getWindiness() * this.MAX_MW
    }
}