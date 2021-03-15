import * as fs from 'fs';
import { Base64 } from './helpers/base64';
import { Complex } from './helpers/complex';
import { FFT } from './helpers/ftt';
import { Statistic } from './helpers/statistic';
import { linspace } from './helpers/tools';
import { WAV } from './helpers/wav';

let readFile = (path: string) => {
    const content = fs.readFileSync(path, { encoding: 'base64' })
    const str = Base64.decode(content)

    let buffer: Uint8Array = new Uint8Array(str.length)

    for (let i = 0; i < str.length; i++) {
        buffer[i] = str.charCodeAt(i);
    }

    return buffer
}

let getFreq = (signal: number[], sampleRate: number) => {
    let fft_result = FFT.transform(signal)
    let signalRe: number[] = fft_result[0]
    let signalIm: number[] = fft_result[1]

    let c: Complex[] = Complex.zip(signalRe, signalIm)

    const N_SAMPLE = signal.length

    const frequencies: number[] = linspace(0, sampleRate, N_SAMPLE).slice(0, N_SAMPLE / 2)
    let magnitudes: number[] = c.map(x => (x.Magnitude / N_SAMPLE) * 2).slice(0, N_SAMPLE / 2)
    magnitudes[0] /= 2

    //const std = Statistic.std(magnitudes)
    const max = Statistic.max(magnitudes)
    let freq: number[] = []

    for (let i = 0; i < magnitudes.length; i++) {
        if (magnitudes[i] > (max / 2)) {
            const val = frequencies[i]
            const index = freq.findIndex(x => x >= val - 5 && x <= val + 5)
            if (index == -1)
                freq.push(val)
            else
                freq[index] = (freq[index] + val) / 2
        }
    }

    return freq.map(x => Math.floor(x))
}

let decode = (file: string) => {
    const bytes = readFile(file)
    const wav = WAV.decode(bytes)
    console.log('wav', wav)

    if (wav) {
        const fmt = wav.subChunks?.filter(x => x.chunkID == 'fmt ')
        const data = wav.subChunks?.filter(x => x.chunkID == 'data')

        if (data && data.length > 0 && fmt && fmt.length > 0) {
            const fmtChunk = fmt[0]
            const dataChunk = data[0]
            const dataContent = dataChunk.chunkContent?.data as any[]

            const sampleRate = (fmtChunk.chunkContent?.sampleRate ?? 0) as number

            if (dataContent) {
                const signal = dataContent.map(x => x.ch_1)
                const freq = getFreq(signal, sampleRate)
                console.log('FFT result', freq)
            }
        }
    }
}

decode('tmp/3_notes.wav')