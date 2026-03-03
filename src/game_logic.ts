



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
import { PowerSource } from "./power_sources/power_source";
import { Solar } from "./power_sources/solar";


class GameLogic {
    world: World;
    powerSources: Map<string, PowerSource>;

    constructor(world: World) {
        this.world = world;
        this.powerSources = new Map();
    }

    advanceTime(deltaTime: number) {
        this.world.advanceTime(deltaTime);
        for (const powerSource of this.powerSources.values()) {
            powerSource.updateProduction(deltaTime, this.world);
        }
        
}
