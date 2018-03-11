export default class Quantizer {
  _ticksPerBeat: number = 480
  denominator: number = 4

  constructor(ticksPerBeat, denominator = 8) {
    this._ticksPerBeat = ticksPerBeat

    // N 分音符の N
    this.denominator = denominator
  }

  round(tick) {
    var u = this.unit
    return Math.round(tick / u) * u
  }

  ceil(tick) {
    var u = this.unit
    return Math.ceil(tick / u) * u
  }

  floor(tick) {
    var u = this.unit
    return Math.floor(tick / u) * u
  }

  get unit() {
    return this._ticksPerBeat * 4 / this.denominator
  }

}