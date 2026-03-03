export class World {
	private totalMinutes: number
	private timeOfDayMinutes: number
	private readonly dayLengthMinutes: number
	private readonly weatherCycleMinutes: number
	private readonly dayStartMinute: number
	private readonly nightStartMinute: number

	private current_cloud: number
	private current_wind: number
	
	private readonly wind_change_rate: number
	private readonly cloud_change_rate: number

	constructor(options?: {
		startMinute?: number
		dayLengthMinutes?: number
		weatherCycleMinutes?: number
		dayStartMinute?: number
		nightStartMinute?: number
	}) {
		const startMinute = options?.startMinute ?? 360
		this.dayLengthMinutes = options?.dayLengthMinutes ?? 1440
		this.weatherCycleMinutes = options?.weatherCycleMinutes ?? 720
		this.dayStartMinute = options?.dayStartMinute ?? 360
		this.nightStartMinute = options?.nightStartMinute ?? 1080
		this.totalMinutes = 0
		this.timeOfDayMinutes = this.normalizeMinute(startMinute)

		this.current_cloud = Math.random()
		this.current_wind = Math.random()

		this.wind_change_rate = 0.01
		this.cloud_change_rate = 0.01
	}

	advanceTime(minutes: number): void {
		if (Number.isNaN(minutes) || !Number.isFinite(minutes)) {
			return
		}
		this.totalMinutes += minutes
		this.timeOfDayMinutes = this.normalizeMinute(this.timeOfDayMinutes + minutes)

		this.current_cloud = math.random() * this.cloud_change_rate + this.current_cloud * (1 - this.cloud_change_rate)
		this.current_wind = math.random() * this.wind_change_rate + this.current_wind * (1 - this.wind_change_rate)

		this.current_cloud = Math.max(0, Math.min(1, this.current_cloud))
		this.current_wind = Math.max(0, Math.min(1, this.current_wind))
	}

	getTimeOfDayMinutes(): number {
		return this.timeOfDayMinutes
	}

	isDaytime(): boolean {
		if (this.dayStartMinute < this.nightStartMinute) {
			return this.timeOfDayMinutes >= this.dayStartMinute && this.timeOfDayMinutes < this.nightStartMinute
		}
		return this.timeOfDayMinutes >= this.dayStartMinute || this.timeOfDayMinutes < this.nightStartMinute
	}

	getDaylightFactor(): number {
		const minute = this.timeOfDayMinutes
		const radians = (Math.PI * 2 * minute) / this.dayLengthMinutes
		return Math.max(0, Math.sin(radians))
	}

	getCloudiness(): number {
		return this.current_cloud
	}

	getWindiness(): number {
		return this.current_wind
	}

	private smoothNoise(t: number, offset: number): number {
		const phase = t + offset
		const base = Math.sin(phase * Math.PI * 2) * 0.5 + 0.5
		const detail = Math.sin(phase * Math.PI * 8) * 0.2
		return Math.max(0, Math.min(1, base + detail))
	}

	private normalizeMinute(minutes: number): number {
		const length = this.dayLengthMinutes
		const mod = minutes % length
		return mod < 0 ? mod + length : mod
	}
}
