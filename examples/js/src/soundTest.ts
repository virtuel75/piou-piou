import * as fs from 'fs'
import { BitSeparator } from './helpers/bitSeparator'
import { BitsPerSampleType, SampleRateType, WaveBuilder, WAVEncoder } from './helpers/wavEncoder'

let writebyte = () => {
    let nb: number = 25300

    if (!fs.existsSync('output_temp/')) {
        fs.mkdirSync('output_temp/')
    }

    fs.writeFileSync('output_temp/test.data', Int16Array.from([nb]), { encoding: null })
}

let createWave = () => {
    console.log('Creating note...')
    const noteDO: number = 523.25
    const noteRE: number = 587.33
    const noteMI: number = 659.26

    console.log('Generating data...')
    const wb = new WaveBuilder(1, SampleRateType.RATE_48000, BitsPerSampleType.BIT_8)
    const note1 = wb.generateData(noteDO, 2, 90)
    const note2 = wb.generateData(noteRE, 2, 90)
    const note3 = wb.generateData(noteMI, 2, 90)

    console.log('Generating sound...')
    const result = WAVEncoder.generateSound([note1, note2, note3])

    if (result.isCorrect) {
        console.log('Data length :', result.data.length)

        const output_folder: string = 'output_temp/'
        const filename: string = "test.wav"

        const output_path = output_folder + '/' + filename

        console.log('Bits per sample :', result.bitsPerSample)

        if (!fs.existsSync(output_folder)) {
            fs.mkdirSync(output_folder)
        }

        // write the output file
        fs.writeFileSync(output_path, Int8Array.from(result.data), { encoding: null })
    }
}

let analyseWave = () => {
    const filename: string = "output_temp/test.wav"

    // let buffer = fs.readFileSync(filename)
    // let json = JSON.stringify(buffer.slice(0, 4))
    // let obj: number[] = JSON.parse(json).data

    // console.log(obj.map(c => String.fromCharCode(c)).join(''))

    // let encoded = Base64.encode('Bonjour')
    // let decoded = Base64.decode(encoded)

    // console.log(encoded)
    // console.log(decoded)

    console.log(BitSeparator.split(3, 1))
}

//writebyte()
createWave()
//analyseWave()