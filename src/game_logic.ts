



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

type PowerSourceKey = "solar" | "wind" | "gas" | "battery";
type PowerState = {
    allocationMw: number;
    producedMw: number;
    maxCapacityMw: number;
    costPerMw: number;
};


class GameLogic {
    world: World;
    powerSources: Map<PowerSourceKey, PowerState>;

    constructor(world: World) {
        this.world = world;
        this.powerSources = new Map<PowerSourceKey, PowerState>([
            ["solar", { allocationMw: 0, producedMw: 0, maxCapacityMw: 900, costPerMw: 15 }],
            ["wind", { allocationMw: 0, producedMw: 0, maxCapacityMw: 800, costPerMw: 22 }],
            ["gas", { allocationMw: 0, producedMw: 0, maxCapacityMw: 1000, costPerMw: 85 }],
            ["battery", { allocationMw: 0, producedMw: 0, maxCapacityMw: 600, costPerMw: 45 }],
        ]);
    }

    advanceTime(deltaTime: number) {
        this.world.advanceTime(deltaTime);
        for (const [key, source] of this.powerSources.entries()) {
            const next = this.calculateProducedMw(key, source.allocationMw);
            source.producedMw = next;
        }
    }

    setPowerSourceAllocation(sourceName: string, allocationMw: number) {
        const key = sourceName as PowerSourceKey;
        const source = this.powerSources.get(key);
        if (!source) {
            return;
        }
        const clamped = Math.max(0, Math.min(allocationMw, source.maxCapacityMw));
        source.allocationMw = clamped;
        source.producedMw = this.calculateProducedMw(key, clamped);
    }

    getPowerSourceProduced(sourceName: string): number {
        const source = this.powerSources.get(sourceName as PowerSourceKey);
        return source ? source.producedMw : 0;
    }

    getPowerSourceMaxCapacity(sourceName: string): number {
        const source = this.powerSources.get(sourceName as PowerSourceKey);
        return source ? source.maxCapacityMw : 0;
    }

    getPowerSourceCost(sourceName: string): number {
        const source = this.powerSources.get(sourceName as PowerSourceKey);
        return source ? source.costPerMw : 0;
    }

    private calculateProducedMw(sourceName: PowerSourceKey, allocationMw: number): number {
        // Dummy values until the full simulation is wired in.
        switch (sourceName) {
            case "solar":
                return allocationMw * 0.75;
            case "wind":
                return allocationMw * 0.6;
            case "gas":
                return allocationMw * 0.9;
            case "battery":
                return allocationMw * 0.5;
            default:
                return 0;
        }
    }
}

export { GameLogic };
