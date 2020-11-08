import * as fs from 'fs'
import { BitConverter } from "./byteConverter"
import { BitsPerSampleType, SampleRateType, WaveBuilder, WAVEncoder } from './wav'

let writebyte = () => {
    let nb: number = 25300

    if (!fs.existsSync('output_temp/')) {
        fs.mkdirSync('output_temp/')
    }

    fs.writeFileSync('output_temp/test.data', Int16Array.from([nb]), { encoding: null })
}

let convertBinary = () => {
    let str: string = 'A'
    let nb: number = 1

    const unsignedBinNb = BitConverter.numberToUnsignedBinary(nb, 8)
    const signedBinNb = BitConverter.numberToSignedBinary(-nb, 8)

    // console.log(BitConverter.stringToBinary(str))
    console.log('Unsigned binary', unsignedBinNb)
    console.log('Signed binary', signedBinNb)

    console.log(BitConverter.unsignedNumberToBlocsOfBits(nb, 8, 4))
    //console.log(Int8Array.from([-nb]))
}

let createWave = () => {
    const noteDO: number = 523.25
    const noteRE: number = 587.33
    const noteMI: number = 659.26

    const wb = new WaveBuilder(1, SampleRateType.RATE_48000, BitsPerSampleType.BIT_32)
    const note1 = wb.generateData(noteDO, 2, 90)
    const note2 = wb.generateData(noteRE, 2, 90)
    const note3 = wb.generateData(noteMI, 2, 90)

    const result = WAVEncoder.generateSound([note1, note2, note3])

    if (result.isCorrect) {
        console.log('Total lenght :', result.data.length + result.header.length)
        console.log('Header lenght :', result.header.length)
        console.log('Data length :', result.data.length)

        const output_folder: string = 'output_temp/'
        const filename: string = "test.wav"

        const output_path = output_folder + '/' + filename

        console.log('Bits per sample :', result.bitsPerSample)

        if (!fs.existsSync(output_folder)) {
            fs.mkdirSync(output_folder)
        }

        fs.writeFileSync(output_path, Int8Array.from(result.header), { encoding: null })
        switch (result.bitsPerSample) {
            case BitsPerSampleType.BIT_16:
                fs.writeFileSync(output_path, Int16Array.from(result.data), { flag: 'as', encoding: null })
                break;
            case BitsPerSampleType.BIT_32:
                fs.writeFileSync(output_path, Int32Array.from(result.data), { flag: 'as', encoding: null })
                break;
            default:
                fs.writeFileSync(output_path, Int8Array.from(result.data), { flag: 'as', encoding: null })
                break;
        }
    }
}

//writebyte()
createWave()