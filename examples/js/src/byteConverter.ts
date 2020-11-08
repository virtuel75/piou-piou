import { reverse } from "dns"

export enum DefaultBitPerElement {
    DEFAULT_8_BITS = 8,
    DEAFULT_16_BITS = 16,
    DEFAULT_32_BITS = 32
}

export class BitConverter {
    public static unsignedNumberToBlocsOfBits = (nb: number, bitPerElement: number | DefaultBitPerElement = DefaultBitPerElement.DEFAULT_8_BITS, nbBloc?: number) => {
        let unsginedNb: number = Math.abs(nb)
        let result: number[] = []
        let mask: number = Math.pow(2, (bitPerElement as number))

        while (unsginedNb != 0) {
            result.push(unsginedNb & (mask - 1))
            unsginedNb = unsginedNb >> (bitPerElement as number)
        }

        result.reverse()

        if (nbBloc && result.length > nbBloc) {
            result = result.slice(result.length - nbBloc)
        } else {
            for (let i = result.length; i < nbBloc; i++) {
                result.unshift(0)
            }
        }

        return result
    }

    public static flipBinary = (binArr: number[]) => {
        return binArr.map(x => x === 0 ? 1 : 0)
    }

    public static numberToUnsignedBinary = (nb: number, arraySize?: number) => {
        nb = Math.abs(nb)
        let result: number[] = BitConverter.unsignedNumberToBlocsOfBits(nb, 1, arraySize)
        return result
    }

    public static numberToSignedBinary = (nb: number, arraySize: number) => {
        let result: number[] = []
        const unsignedBin = BitConverter.numberToUnsignedBinary(nb, arraySize)

        if (nb < 0) {
            const flipBin = BitConverter.flipBinary(unsignedBin)
            for (let i = flipBin.length; i < arraySize; i++) {
                flipBin.unshift(1)
            }
            const tmpNb = parseInt(flipBin.join(''), 2) + 1
            result = BitConverter.numberToUnsignedBinary(tmpNb, arraySize)
        } else {
            result = unsignedBin
        }

        return result
    }

    public static stringToBlocsOfBits = (str: string, bitPerElement: number | DefaultBitPerElement = DefaultBitPerElement.DEFAULT_8_BITS) => {
        const strArray: number[] = str.split('').map(x => x.charCodeAt(0))
        let result: number[] = []

        strArray.forEach(nb => {
            const bytes: number[] = BitConverter.unsignedNumberToBlocsOfBits(nb, bitPerElement)
            result.push.apply(result, bytes)
        })

        return result
    }

    public static stringToBinary = (str: string, bitPerElement: number | DefaultBitPerElement = DefaultBitPerElement.DEFAULT_8_BITS) => {
        const strArray: number[] = str.split('').map(x => x.charCodeAt(0))
        let result: number[] = []

        strArray.forEach(nb => {
            const bits: number[] = BitConverter.numberToUnsignedBinary(nb, (bitPerElement as number))
            result.push.apply(result, bits)
        })

        return result
    }

}