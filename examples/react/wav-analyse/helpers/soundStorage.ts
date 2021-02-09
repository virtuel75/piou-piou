import * as FileSystem from 'expo-file-system';
import { Base64 } from "./base64";
import { BitSeparator } from './bitSeparator';

export class SoundStorage {

    public static readonly DataStorageDir: string = 'data/'

    public static getFiles = async () => {
        const dir: string = FileSystem.documentDirectory + SoundStorage.DataStorageDir
        const info = await FileSystem.getInfoAsync(dir)

        if (!info.exists) {
            await FileSystem.makeDirectoryAsync(dir)
        }

        let files = await FileSystem.readDirectoryAsync(dir)

        for (let i = 0; i < files.length; i++) {
            files[i] = dir + files[i]
        }

        return files
    }

    public static read = async (file: string) => {
        const content = await FileSystem.readAsStringAsync(file, { encoding: FileSystem.EncodingType.Base64 })
        const str = Base64.decode(content)
        let buffer: Uint8Array = new Uint8Array(str.length)

        for (let i = 0; i < str.length; i++) {
            buffer[i] = str.charCodeAt(i);
        }

        let result: any = {}

        const bytes: number[] = Array.from(buffer)
        const bitPerBlock: number = 8

        // -> chunk info
        // chunk ID (big-endian) - 4 bytes
        const chunIDBytes: number[] = bytes.slice(0, 4)
        const chunkID: string = BitSeparator.assembleString(chunIDBytes)
        result.chunkID = chunkID
        // chunk size (litlle-endian) - 4 bytes
        const chunkSizeBytes: number[] = bytes.slice(4, 8).reverse()
        const chunkSize: number = BitSeparator.assemble(chunkSizeBytes, bitPerBlock)
        result.chunkSize = chunkSize
        // format (big-endian) - 4 bytes
        const formatBytes: number[] = bytes.slice(8, 12)
        const format: string = BitSeparator.assembleString(formatBytes)
        result.format = format

        let chunkName: string = ''
        let iterator: number = 0
        let byteIndex: number = 12

        result.subChunk = []

        //loop throught chunk
        while (chunkName != 'data' && iterator < 10) {
            iterator += 1

            const chunkIDBytes: number[] = bytes.slice(byteIndex, byteIndex + 4)
            chunkName = BitSeparator.assembleString(chunkIDBytes)

            byteIndex += 4

            const subChunkSizeBytes = bytes.slice(byteIndex, byteIndex + 4).reverse()
            const subChunkSize = BitSeparator.assemble(subChunkSizeBytes, bitPerBlock)

            byteIndex += 4

            if (chunkName == 'fmt ') {
                // audio format (litlle endian) - 2 bytes
                const audioFormatBytes: number[] = bytes.slice(byteIndex, byteIndex + 2).reverse()
                const audioFormat: number = BitSeparator.assemble(audioFormatBytes, bitPerBlock)

                byteIndex += 2

                // number of channel (litlle endian) - 2 bytes
                const channelNumberBytes: number[] = bytes.slice(byteIndex, byteIndex + 2).reverse()
                const channelNumber: number = BitSeparator.assemble(channelNumberBytes, bitPerBlock)

                byteIndex += 2

                // sample rate (litlle endian) - 4 bytes
                const sampleRateBytes: number[] = bytes.slice(byteIndex, byteIndex + 4).reverse()
                const sampleRate: number = BitSeparator.assemble(sampleRateBytes, bitPerBlock)

                byteIndex += 4

                // byterate (litlle endian) - 4 bytes
                const byteRateBytes: number[] = bytes.slice(byteIndex, byteIndex + 4).reverse()
                const byteRate: number = BitSeparator.assemble(byteRateBytes, bitPerBlock)

                byteIndex += 4

                // block align (little endian) - 2 bytes
                const blockAlignBytes: number[] = bytes.slice(byteIndex, byteIndex + 2)
                const blockAlign: number = BitSeparator.assemble(blockAlignBytes, bitPerBlock)

                byteIndex += 2

                // bits per sample (litlle endian) - 2 bytes
                const bitsPerSampleBytes: number[] = bytes.slice(byteIndex, byteIndex + 2).reverse()
                const bitsPerSample: number = BitSeparator.assemble(bitsPerSampleBytes, bitPerBlock)

                byteIndex += 2

                result.subChunk.push({ 
                    subChunkID: chunkName, 
                    subChunkSize: subChunkSize,
                    audioFormat: audioFormat,
                    channelNumber: channelNumber,
                    sampleRate: sampleRate,
                    byteRate: byteRate,
                    blockAlign: blockAlign,
                    bitsPerSample: bitsPerSample
                })
            } else {
                byteIndex += subChunkSize
                result.subChunk.push({ subChunkID: chunkName, subChunkSize: subChunkSize })
            }
        }

        // // -> sound data
        // // data (litlle endian) - subchunk2Size bytes
        // const data: number[] = bytes.slice(44)

        return result
    }

    public static save = async (uri: string) => {
        const filename: string | undefined = uri.split('/').pop()
        const newUri: string = FileSystem.documentDirectory + SoundStorage.DataStorageDir + filename
        await FileSystem.moveAsync({ from: uri, to: newUri })

        return newUri
    }

    public static delete = async (file: string) => {
        await FileSystem.deleteAsync(file)
    }
}