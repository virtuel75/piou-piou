import * as fs from 'fs'
import { Base64 } from './helpers/base64'
import { BitSeparator } from './helpers/bitSeparator'
import { WavAnalyser } from './helpers/wavAnalyser'
import { BitsPerSampleType, SampleRateType, Wave, WaveBuilder, WAVEncoder, WAVEncoderResult } from './helpers/wavEncoder'

let _encodeObjectForAudio = (data: any) => {
    // stringifying the object
    const object = { type: typeof (data), data: data }
    const jsonObject = JSON.stringify(object)
    const encodedObject = encodeURI(jsonObject)

    // transform to base64
    const base64 = Base64.encode(encodedObject)

    return base64
}

let _generateFrequencyShiftAudio = (bytes: number[]) => {
    const phaseShift: number = 0
    const amplitude: number = 90
    const freqRange = 18000 - 100

    const wb: WaveBuilder = new WaveBuilder(1, SampleRateType.RATE_44100, BitsPerSampleType.BIT_8)
    let notes: Wave[] = []

    for (let i = 0; i < bytes.length; i++) {
        const val = bytes[i]
        const freq: number = val * (freqRange / 64) + 100
        const note = wb.generatePeriod(freq, phaseShift, amplitude)
        notes.push(note)
    }

    console.log('Generating sound')
    const wave = WAVEncoder.generateSound(notes)
    return wave
}

let _generatePhaseShiftAudio = (bytes: number[]) => {
    console.log('Converting data array into binary array')
    let binary: number[] = []
    for (let i = 0; i < bytes.length; i++) {
        const val = bytes[i]
        binary.push(...BitSeparator.split(val, 1, 6))
    }

    const wb: WaveBuilder = new WaveBuilder(1, SampleRateType.RATE_44100, BitsPerSampleType.BIT_8)
    let notes: Wave[] = []

    const freq: number = 523.25
    const amplitude: number = 90

    console.log('Converting data into binary array')
    for (let i = 0; i < binary.length; i++) {
        const phase: number = binary[i] == 0 ? 0 : Math.PI
        const note = wb.generatePeriod(freq, phase, amplitude)
        notes.push(note)
    }

    console.log('Generating sound')
    const wave = WAVEncoder.generateSound(notes)
    return wave
}

let _createWaveFile = (wavData: WAVEncoderResult) => {
    if (wavData.isCorrect) {
        console.log('Data length :', wavData.data.length)

        const output_folder: string = 'output_temp/'
        const currentDate = new Date().toJSON().replace(/[:.]/g, '_')
        const filename: string = "sound_" + currentDate + ".wav"

        const output_path = output_folder + filename

        if (!fs.existsSync(output_folder)) {
            fs.mkdirSync(output_folder)
        }

        // write the output file
        fs.writeFileSync(output_path, Uint8Array.from(wavData.data), { encoding: null })
    }
}

let createFreqShiftAudio = () => {
    const message: string = "Hello world"

    const base64 = _encodeObjectForAudio(message)

    // get array of value from base64
    let values: number[] = []
    for (let i = 0; i < base64.length; i++) {
        const char: string = base64[i]
        const val: number = Base64.keyStr.indexOf(char)
        values.push(val)
    }

    // genarating wave data
    const wave = _generateFrequencyShiftAudio(values)
    _createWaveFile(wave)
}

let createPhaseShiftAudio = () => {
    const message: string = "Hello world"

    const base64 = _encodeObjectForAudio(message)

    // get array of value from base64
    let values: number[] = []
    for (let i = 0; i < base64.length; i++) {
        const char: string = base64[i]
        const val: number = Base64.keyStr.indexOf(char)
        values.push(val)
    }

    // genarating wave data
    const wave = _generatePhaseShiftAudio(values)
    _createWaveFile(wave)
}

let createWave = () => {
    console.log('Creating note...')
    const noteDO: number = 523.25
    const noteRE: number = 587.33
    const noteMI: number = 659.26

    console.log('Generating data...')
    const wb = new WaveBuilder(1, SampleRateType.RATE_48000, BitsPerSampleType.BIT_8)
    const phase = 0
    const note1 = wb.generateData(noteDO, phase, 2, 90)
    const note2 = wb.generateData(noteRE, phase, 2, 90)
    const note3 = wb.generateData(noteMI, phase, 2, 90)

    console.log('Generating sound...')
    const result = WAVEncoder.generateSound([note1, note2, note3])

    if (result.isCorrect) {
        console.log('Data length :', result.data.length)

        const output_folder: string = 'output_temp/'
        const filename: string = "test.wav"

        const output_path = output_folder + '/' + filename

        if (!fs.existsSync(output_folder)) {
            fs.mkdirSync(output_folder)
        }

        // write the output file
        fs.writeFileSync(output_path, Uint8Array.from(result.data), { encoding: null })
    }
}

let analyseWave = () => {
    const filename: string = "output_temp/test.wav"

    WavAnalyser.analyseFile(filename)
}

//writebyte()
//createWave()
createFreqShiftAudio()
//createPhaseShiftAudio()
//analyseWave()