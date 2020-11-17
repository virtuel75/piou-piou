import { Base64 } from "./helpers/base64";

// size of a block
const byteSize: number = 8

let stringifyData = (data: any) => {
    let result: string = JSON.stringify(data)
    result = encodeURI(result)
    return result
}

let parseData = (str: string) => {
    let result_str = decodeURI(str)
    let result = JSON.parse(result_str)
    return result
}

let encodeData = (data: any) => {
    // tranform data into a stringify data
    let strData = stringifyData(data)

    // encode data
    let encodedData = Base64.encode(strData)

    // return the data into a base64 string
    return encodedData
}

let decodeData = (base64str: string) => {
    // decode the base64 string
    let decodedString = Base64.decode(base64str)

    // retrieve the data from the decoded string
    let data = parseData(decodedString)

    return data
}

let toBinaryArr = (str: string) => {
    let result: string[] = []

    for (let i = 0; i < str.length; i++) {
        let bin: string = str[i].charCodeAt(0).toString(2)
        bin = Array(byteSize - bin.length + 1).join("0") + bin
        result.push(bin)
    }
    return result.join("").split("").map(x => +x)
}

let fromBinaryArr = (binaryArr: number[]) => {
    const binaryStr: string = binaryArr.join('')
    const regex: string = '.{1,' + byteSize + '}'
    const subBinaryStr: string[] | null = binaryStr.match(new RegExp(regex, 'g'))
    let result: string[] = []

    for (let i = 0; subBinaryStr && i < subBinaryStr.length; i++) {
        const tmp: string = subBinaryStr[i]
        const char: string = String.fromCharCode(parseInt(tmp, 2))
        result.push(char)
    }

    return result.join('')
}

const obj = 'Hello world'
// encode the object into base64 string
const encodedData = encodeData(obj)
// transform the encoded object into binary array
const binaryData = toBinaryArr(encodedData)
// transform binary array into base64 string
const strFromBinary = fromBinaryArr(binaryData)
// decode the base64 string
const decodedData = decodeData(strFromBinary)

console.clear()
console.log('Original obj:', obj)
console.log('Encoded obj:', encodedData)
console.log('Binary representation of the encoded obj:', binaryData)
console.log('Binary array to string:', strFromBinary)
console.log('Decoded obj:', decodedData)