



/// Backend

// recieve calls to forward to game logic classes
// eg if you slide the solar slider down to 20 megawatts
// then the react front end makes a call like game.solar.allocate_mw(20)
// views are updated by calls like game.solar.get_produced

// Resource class
//   allocated amount (kilowatts)
//   produced amount (kilowatts)
//   cost per allocation // constant


// QUESTION
    /// Say solar has a max capacity of 40 megawatts
    ///  sun availability is at 75%
    ///  solar allocation is at 30 MW
    ///  is 30 MW produced or .75 * 30 MW produced

import { World } from "./world";
import { Solar } from "./power_sources/solar";
import { Wind } from "./power_sources/wind";
import { Gas } from "./power_sources/gas";
import { Battery } from "./power_sources/battery";
import { PowerSource } from "./power_sources/power_source";

type PowerSourceKey = "solar" | "wind" | "gas" | "battery";
class GameLogic {
    world: World;
    powerSources: Map<PowerSourceKey, PowerSource>;

    constructor(world: World) {
        this.world = world;
        this.powerSources = new Map<PowerSourceKey, PowerSource>([
            ["solar", new Solar("Solar", 900, 15)],
            ["wind", new Wind("Wind", 800, 22)],
            ["gas", new Gas("Gas", 1000, 85)],
            ["battery", new Battery("Battery", 600, 45)],
        ]);
    }

    advanceTime(deltaTime: number) {
        this.world.advanceTime(deltaTime);
        for (const source of this.powerSources.values()) {
            source.updateProduction(deltaTime, this.world);
        }
    }

    setPowerSourceAllocation(sourceName: string, allocationMw: number) {
        const key = sourceName as PowerSourceKey;
        const source = this.powerSources.get(key);
        if (!source) {
            return;
        }
        source.setAllocMw(allocationMw);
        source.updateProduction(0, this.world);
    }

    getPowerSourceProduced(sourceName: string): number {
        const source = this.powerSources.get(sourceName as PowerSourceKey);
        return source ? source.getProduction() : 0;
    }

    getPowerSourceMaxCapacity(sourceName: string): number {
        const source = this.powerSources.get(sourceName as PowerSourceKey);
        return source ? source.getMaxCapacity() : 0;
    }

    getPowerSourceCost(sourceName: string): number {
        const source = this.powerSources.get(sourceName as PowerSourceKey);
        return source ? source.getCost() : 0;
    }
}

export { GameLogic };
