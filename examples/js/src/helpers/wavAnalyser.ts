import * as fs from 'fs'
import { BitSeparator } from './bitSeparator'

export class WavAnalyser {
    private static readonly BITS_PER_BLOC: number = 8

    public static analyseFile = (filename: string) => {
        let tmp: string[] = filename.split('.')
        const extension: string = tmp.pop()

        if (extension !== 'wav') {
            throw 'The filename argument is not a .wav file'
        }

        if (!fs.existsSync(filename)) {
            throw `'${filename}' doesn't exist`
        }

        const buffer: Buffer = fs.readFileSync(filename)
        const bytes: number[] = [...buffer]

        // read file data
        // -> chunk info
        // chunk ID (big-endian) - 4 bytes
        const chunIDBytes: number[] = bytes.slice(0, 4)
        const chunkID: string = BitSeparator.assembleString(chunIDBytes)
        console.log('Chunk ID :', chunkID)
        // chunk size (litlle-endian) - 4 bytes
        const chunkSizeBytes: number[] = bytes.slice(4, 8).reverse()
        const chunkSize: number = BitSeparator.assemble(chunkSizeBytes, WavAnalyser.BITS_PER_BLOC)
        console.log('Chunk size :', chunkSize)
        // format (big-endian) - 4 bytes
        const formatBytes: number[] = bytes.slice(8, 12)
        const format: string = BitSeparator.assembleString(formatBytes)
        console.log('Format :', format)

        // -> sub chunk 1 info
        // sub chunk 1 ID (bif-endian) - 4 bytes
        const subChunkID1Bytes: number[] = bytes.slice(12, 16)
        const subChunkID1: string = BitSeparator.assembleString(subChunkID1Bytes)
        console.log('Sub chunk 1 ID :', subChunkID1)
        // sub chunk 1 size (litlle-endian) - 4 bytes
        const subChunk1SizeBytes: number[] = bytes.slice(16, 20).reverse()
        const subChunk1Size: number = BitSeparator.assemble(subChunk1SizeBytes, WavAnalyser.BITS_PER_BLOC)
        console.log('Sub chunk 1 size :', subChunk1Size)
        // audio format (litlle endian) - 2 bytes
        const audioFormatBytes: number[] = bytes.slice(20, 22).reverse()
        const audioFormat: number = BitSeparator.assemble(audioFormatBytes, WavAnalyser.BITS_PER_BLOC)
        console.log('Audio format :', audioFormat)
        // number of channel (litlle endian) - 2 bytes
        const channelNumberBytes: number[] = bytes.slice(22, 24).reverse()
        const channelNumber: number = BitSeparator.assemble(channelNumberBytes, WavAnalyser.BITS_PER_BLOC)
        console.log('Channel number :', channelNumber)
        // sample rate (litlle endian) - 4 bytes
        const sampleRateBytes: number[] = bytes.slice(24, 28).reverse()
        const sampleRate: number = BitSeparator.assemble(sampleRateBytes, WavAnalyser.BITS_PER_BLOC)
        console.log('Sample rate :', sampleRate)
        // byterate (litlle endian) - 4 bytes
        const byteRateBytes: number[] = bytes.slice(28, 32).reverse()
        const byteRate: number = BitSeparator.assemble(byteRateBytes, WavAnalyser.BITS_PER_BLOC)
        console.log('Byte rate :', byteRate)
        // block align (little endian) - 2 bytes
        const blockAlignBytes: number[] = bytes.slice(32, 34)
        const blockAlign: number = BitSeparator.assemble(blockAlignBytes, WavAnalyser.BITS_PER_BLOC)
        console.log('Block align :', blockAlign)
        // bits per sample (litlle endian) - 2 bytes
        const bitsPerSampleBytes: number[] = bytes.slice(34, 36).reverse()
        const bitsPerSample: number = BitSeparator.assemble(bitsPerSampleBytes, WavAnalyser.BITS_PER_BLOC)
        console.log('Bits per sample', bitsPerSample)

        // -> sub chunk 2
        // sub chunk 2 ID (big-endian) - 4 bytes
        const subChunkID2Bytes: number[] = bytes.slice(36, 40)
        const subChunkID2: string = BitSeparator.assembleString(subChunkID2Bytes)
        console.log('Sub chunk 2 ID :', subChunkID2)
        // sub chunk 2 size (litlle endian) - 4 bytes
        const subChunk2SizeBytes: number[] = bytes.slice(40, 44).reverse()
        const subChunk2Size: number = BitSeparator.assemble(subChunk2SizeBytes, WavAnalyser.BITS_PER_BLOC)
        console.log('Sub chunk 2 size :', subChunk2Size)

        // -> sound data
        // data (litlle endian) - subchunk2Size bytes
        const data: number[] = bytes.slice(44)
        console.log('Data lenght :', data.length)
        console.log('data :', data)
    }
}