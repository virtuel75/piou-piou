export var DEFAULT_BLOCK_SIZE: number = 8

export class Converter {
    /**
     * Convert a string into a binary array and return the result
     * @param str string to convert into binary array
     * @param blockSize size of block
     */
    public static stringToBinary = (str: string, blockSize: number = DEFAULT_BLOCK_SIZE) => {
        let result: string[] = []

        for (let i = 0; i < str.length; i++) {
            let binaryArray: string = str[i].charCodeAt(0).toString(2)
            binaryArray = Array(blockSize - binaryArray.length + 1).join("0") + binaryArray
            result.push(binaryArray)
        }
        return result.join("").split("").map(x => +x)
    }

    /**
     * Convert a binary array into a string
     * @param binaryArray Binary array to convert into a string
     * @param blockSize Block size
     */
    public static binaryToString = (binaryArray: number[], blockSize: number = DEFAULT_BLOCK_SIZE) => {
        const binaryStr: string = binaryArray.join('')
        const regex: string = '.{1,' + blockSize + '}'
        const subBinaryStr: string[] | null = binaryStr.match(new RegExp(regex, 'g'))
        let result: string[] = []

        for (let i = 0; subBinaryStr && i < subBinaryStr.length; i++) {
            const tmp: string = subBinaryStr[i]
            const char: string = String.fromCharCode(parseInt(tmp, 2))
            result.push(char)
        }

        return result.join('')
    }

}