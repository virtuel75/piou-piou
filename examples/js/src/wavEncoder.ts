import { BitConverter, DefaultBitPerElement } from "./byteConverter"

export enum ChannelType {
    MONO = 1,
    STEREO = 2
}

export enum SampleRateType {
    RATE_8000 = 8000,
    RATE_44100 = 44100,
    RATE_48000 = 48000,
    RATE_96000 = 96000
}

export enum BitsPerSampleType {
    BIT_8 = 8,
    BIT_16 = 16,
    BIT_32 = 32
}

export enum SoundWaveType {
    SIN,
    COS,
    SQUARE,
}

export interface WAVEncoderResult {
    header: number[]
    data: number[]
    bitsPerSample: BitsPerSampleType,
    numberOfSample: number,
    isCorrect: boolean
}

export interface Wave {
    data: number[],
    numChannel: number,
    sampleRate: number,
    bitsPerSample: number,
    byteRate: number,
    blockAlign: number
}

export class WaveBuilder {
    private readonly _numChannels: number
    private readonly _sampleRate: number
    private readonly _bitsPerSample: number

    public get NumChannel(): number { return this._numChannels }
    public get SampleRate(): number { return this._sampleRate }
    public get BitsPerSample(): number { return this._bitsPerSample }
    public get ByteRate(): number { return this.SampleRate * this.NumChannel * (this.BitsPerSample / 8) }
    public get BlocAlign(): number { return this.NumChannel * (this.BitsPerSample / 8) }

    public constructor(
        numChannels: ChannelType = ChannelType.MONO,
        sampleRate: SampleRateType = SampleRateType.RATE_44100,
        bitsPerSample: BitsPerSampleType = BitsPerSampleType.BIT_8) {
        this._numChannels = (numChannels as number)
        this._sampleRate = (sampleRate as number)
        this._bitsPerSample = (bitsPerSample as number)
    }

    private _sinFormula = (w: number, t: number, phase: number = 0) => {
        return Math.sin((w * t) + phase)
    }

    private _cosFormula = (w: number, index: number, phase: number = 0) => {
        return Math.sin((w * index) + phase)
    }

    public generateData = (frequency: number, duration: number, amplitude: number = 100, soundWaveType: SoundWaveType = SoundWaveType.SIN) => {
        const w: number = 2 * Math.PI * frequency
        const p: number = 1 / frequency
        const max_amplitude: number = Math.pow(2, (this.BitsPerSample - 1)) - 1
        let data: number[] = []

        amplitude = (amplitude * max_amplitude) / 100
        amplitude = amplitude < max_amplitude ? amplitude : max_amplitude

        for (let i = 0; i < this.SampleRate * duration; i++) {
            const t: number = i * (1 / this.SampleRate)
            let value: number = 0

            switch (soundWaveType) {
                case SoundWaveType.COS:
                    value = amplitude * this._cosFormula(w, t)
                    break;
                default:
                    value = amplitude * this._sinFormula(w, t)
                    break;
            }

            if (this.BitsPerSample == BitsPerSampleType.BIT_8) {
                value += max_amplitude
            }

            const intergerValue: number = Math.round(value)

            for (let j = 0; j < this.NumChannel; j++) {
                data.push(intergerValue)
            }
        }

        const wave: Wave = {
            data: data,
            bitsPerSample: this.BitsPerSample,
            blockAlign: this.BlocAlign,
            byteRate: this.ByteRate,
            numChannel: this.NumChannel,
            sampleRate: this.SampleRate
        }

        return wave
    }
}

export class WAVEncoder {
    // chunk descriptor
    public static readonly CHUNK_ID: string = 'RIFF'
    public static readonly FORMAT: string = 'WAVE'

    // 'fmt ' sub-chunk
    public static readonly SUBCHUNK_1_ID: string = 'fmt '
    public static readonly AUDIO_FORMAT: number = 1

    // 'data' sub-chunk
    public static readonly SUBCHUNK_2_ID: string = 'data'

    public constructor() {
    }

    public static generateSound = (data: Wave | Wave[]) => {
        let soundData: number[] = []
        let chunkSize: number = 0
        const subchunk1Size: number = 16
        let subchunk2Size: number = 0
        let bitsPerSample: number = 0
        let isDataCorrect: boolean = false
        let wavDataArray: Wave[] = []

        if (data) {
            if (!Array.isArray(data)) {
                wavDataArray = [data]
            } else {
                wavDataArray = [...data]
            }
            isDataCorrect = wavDataArray.every((val, i, arr) => {
                return val.bitsPerSample == arr[0].bitsPerSample && val.numChannel == arr[0].numChannel && val.sampleRate == arr[0].sampleRate
            })
        }

        let header: number[] = []

        if (isDataCorrect) {
            for (let i = 0; i < wavDataArray.length; i++) {
                for (let j = 0; j < wavDataArray[i].data.length; j++) {
                    soundData.push(wavDataArray[i].data[j])
                }
            }

            subchunk2Size = soundData.length * (wavDataArray[0].bitsPerSample / 8)

            chunkSize = 4 + (8 + subchunk1Size) + (8 + subchunk2Size)
            bitsPerSample = wavDataArray[0].bitsPerSample

            // build file data
            // -> chunk info
            // chunk ID (big-endian) - 4 bytes
            header.push(...BitConverter.stringToBlocsOfBits(WAVEncoder.CHUNK_ID))
            // chunk size (litlle-endian) - 4 bytes
            header.push(...BitConverter.unsignedNumberToBlocsOfBits(chunkSize, DefaultBitPerElement.DEFAULT_8_BITS, 4).reverse())
            // format (big-endian) - 4 bytes
            header.push(...BitConverter.stringToBlocsOfBits(WAVEncoder.FORMAT))

            // -> sub chunk 1 info
            // sub chunk 1 ID (bif-endian) - 4 bytes
            header.push(...BitConverter.stringToBlocsOfBits(WAVEncoder.SUBCHUNK_1_ID))
            // sub chunk 1 size (litlle-endian) - 4 bytes
            header.push(...BitConverter.unsignedNumberToBlocsOfBits(subchunk1Size, DefaultBitPerElement.DEFAULT_8_BITS, 4).reverse())
            // audio format (litlle endian) - 2 bytes
            header.push(...BitConverter.unsignedNumberToBlocsOfBits(WAVEncoder.AUDIO_FORMAT, DefaultBitPerElement.DEFAULT_8_BITS, 2).reverse())
            // number of channel (litlle endian) - 2 bytes
            header.push(...BitConverter.unsignedNumberToBlocsOfBits(wavDataArray[0].numChannel, DefaultBitPerElement.DEFAULT_8_BITS, 2).reverse())
            // sample rate (litlle endian) - 4 bytes
            header.push(...BitConverter.unsignedNumberToBlocsOfBits(wavDataArray[0].sampleRate, DefaultBitPerElement.DEFAULT_8_BITS, 4).reverse())
            // byterate (litlle endian) - 4 bytes
            header.push(...BitConverter.unsignedNumberToBlocsOfBits(wavDataArray[0].byteRate, DefaultBitPerElement.DEFAULT_8_BITS, 4).reverse())
            // block align (little endian) - 2 bytes
            header.push(...BitConverter.unsignedNumberToBlocsOfBits(wavDataArray[0].blockAlign, DefaultBitPerElement.DEFAULT_8_BITS, 2).reverse())
            // bits per sample (litlle endian) - 2 bytes
            header.push(...BitConverter.unsignedNumberToBlocsOfBits(bitsPerSample, DefaultBitPerElement.DEFAULT_8_BITS, 2).reverse())

            // -> sub chunk 2
            // sub chunk 2 ID (big-endian) - 4 bytes
            header.push(...BitConverter.stringToBlocsOfBits(WAVEncoder.SUBCHUNK_2_ID))
            // sub chunk 2 size (litlle endian) - 4 bytes
            header.push(...BitConverter.unsignedNumberToBlocsOfBits(subchunk2Size, DefaultBitPerElement.DEFAULT_8_BITS, 4).reverse())
            // data (litlle endian) - subchunk2Size bytes
            //soundData.reverse()
        } else {
            console.warn('Error : data is not correct')
        }

        const result: WAVEncoderResult = {
            header: header,
            data: soundData,
            bitsPerSample: bitsPerSample,
            isCorrect: isDataCorrect,
            numberOfSample: subchunk2Size
        }

        return result
    }

}