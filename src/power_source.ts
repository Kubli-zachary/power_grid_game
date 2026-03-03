export abstract class PowerSource {
	readonly name: string
	readonly maxCapacityMw: number
	readonly costPerMw: number
	protected allocatedMw: number

	constructor(name: string, maxCapacityMw: number, costPerMw: number) {
		this.name = name
		this.maxCapacityMw = maxCapacityMw
		this.costPerMw = costPerMw
		this.allocatedMw = 0
	}

	allocateMw(mw: number): void {
		const clamped = Math.max(0, Math.min(mw, this.maxCapacityMw))
		this.allocatedMw = clamped
	}

	getAllocatedMw(): number {
		return this.allocatedMw
	}

	getCost(): number {
		return this.allocatedMw * this.costPerMw
	}

	abstract getProducedMw(): number
}

