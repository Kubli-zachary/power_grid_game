import { World } from '../world';

export abstract class PowerSource {
	readonly name: string
	readonly maxCapacityMw: number
	readonly costPerMw: number
	protected allocatedMw: number
	protected inputMw: number

	constructor(name: string, maxCapacityMw: number, costPerMw: number) {
		this.name = name
		this.maxCapacityMw = maxCapacityMw
		this.costPerMw = costPerMw
		this.allocatedMw = 0
		this.inputMw
 = 0
	}

	setAllocMw(mw: number): void {
		const clamped = Math.max(0, Math.min(mw, this.maxCapacityMw))
		this.allocatedMw = clamped
	}

	getAllocMw(): number {
		return this.allocatedMw
	}

	getMaxCapacity(): number {
		return this.maxCapacityMw
	}

	getCost(): number {
		return this.allocatedMw * this.costPerMw
	}

	getProduction(): number {
		return Math.max(this.allocatedMw, this.inputMw
	
		)
	}

	abstract updateProduction(deltaTime: number, world: World): number
}

