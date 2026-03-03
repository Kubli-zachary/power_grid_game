export type WeatherState = 'clear' | 'cloudy' | 'rain' | 'storm'

export class World {
	private totalHours: number
	private timeOfDayHours: number
	private readonly dayLengthHours: number
	private readonly weatherCycleHours: number
	private readonly weatherStates: WeatherState[]
	private readonly dayStartHour: number
	private readonly nightStartHour: number

	constructor(options?: {
		startHour?: number
		dayLengthHours?: number
		weatherCycleHours?: number
		weatherStates?: WeatherState[]
		dayStartHour?: number
		nightStartHour?: number
	}) {
		const startHour = options?.startHour ?? 6
		this.dayLengthHours = options?.dayLengthHours ?? 24
		this.weatherCycleHours = options?.weatherCycleHours ?? 12
		this.weatherStates = options?.weatherStates ?? ['clear', 'cloudy', 'rain', 'storm']
		this.dayStartHour = options?.dayStartHour ?? 6
		this.nightStartHour = options?.nightStartHour ?? 18

		this.totalHours = 0
		this.timeOfDayHours = this.normalizeHour(startHour)
	}

	tick(hours: number): void {
		if (Number.isNaN(hours) || !Number.isFinite(hours)) {
			return
		}

		this.totalHours += hours
		this.timeOfDayHours = this.normalizeHour(this.timeOfDayHours + hours)
	}

	getTimeOfDayHours(): number {
		return this.timeOfDayHours
	}

	isDaytime(): boolean {
		if (this.dayStartHour < this.nightStartHour) {
			return this.timeOfDayHours >= this.dayStartHour && this.timeOfDayHours < this.nightStartHour
		}

		return this.timeOfDayHours >= this.dayStartHour || this.timeOfDayHours < this.nightStartHour
	}

	getDaylightFactor(): number {
		const hour = this.timeOfDayHours
		const radians = (Math.PI * 2 * hour) / this.dayLengthHours

		return Math.max(0, Math.sin(radians))
	}

	getWeather(): WeatherState {
		const index = Math.floor(this.totalHours / this.weatherCycleHours) % this.weatherStates.length

		return this.weatherStates[index]
	}

	getWeatherFactor(): number {
		const weather = this.getWeather()

		switch (weather) {
			case 'clear':
				return 1
			case 'cloudy':
				return 0.75
			case 'rain':
				return 0.55
			case 'storm':
				return 0.35
			default:
				return 1
		}
	}

	private normalizeHour(hours: number): number {
		const length = this.dayLengthHours
		const mod = hours % length

		return mod < 0 ? mod + length : mod
	}
}



