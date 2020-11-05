import base64 from "./base64";

export class Base64Encoder {
    private static stringifyOBject = (obj: any) => {
        // stringify the object
        let result: string = JSON.stringify(obj)
        // encode special caracters
        result = encodeURI(result)

        return result
    }
    
    private static parseObject = (str: string) => {
        // decode speical caracters
        let result_str = decodeURI(str)
        // retrieve object
        let result = JSON.parse(result_str)

        return result
    }
    
    /**
     * Encode an object into a base64 string
     * @param obj object to encode
     */
    public static encode = (obj: any) => {
        // tranform data into a stringify data
        let strObject = Base64Encoder.stringifyOBject(obj)
        // encode data
        let encodedObject = base64.encode(strObject)

        return encodedObject
    }

    /**
     * Decode a base64 string into its original object
     * @param base64str base64 string to decode
     */
    public static decode = (base64str: string) => {
        // decode the base64 string
        let decodedString = base64.decode(base64str)
        // retrieve the data from the decoded string
        let data = Base64Encoder.parseObject(decodedString)

        return data
    }

}