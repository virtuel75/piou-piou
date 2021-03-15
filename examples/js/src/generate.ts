import * as fs from 'fs';
import { SignalBuilder } from './helpers/signalBuilder';
import { concat, normalize } from './helpers/tools';
import { WAV } from './helpers/wav';

let createWave = () => {
    console.log('Creating note...')
    const noteDO: number = 550
    const noteRE: number = 144
    const noteMI: number = 250

    console.log('Generating data...')
    const phase = 0
    const sampleRate = 44100
    const channelNumber = 1
    const duration = 0.5

    const note1 = SignalBuilder.generateSignal(noteDO, phase, duration, sampleRate, 90)
    const note2 = SignalBuilder.generateSignal(noteRE, phase, duration, sampleRate, 90)
    const note3 = SignalBuilder.generateSignal(noteMI, phase, duration, sampleRate, 90)

    let signal = concat(note1, note2)
    signal = concat(signal, note3)
    signal = normalize(signal, 90)

    console.log('Generating sound...')
    const data = WAV.encode(signal, channelNumber, sampleRate, 16)

    const output_folder: string = 'tmp/'
    const filename: string = "3_notes.wav"

    const output_path = output_folder + '/' + filename

    if (!fs.existsSync(output_folder)) {
        fs.mkdirSync(output_folder)
    }

    // write the output file
    console.log('Saving file')
    fs.writeFileSync(output_path, data, { encoding: null })
}

createWave()