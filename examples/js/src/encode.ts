import * as fs from 'fs';
import { Base64 } from './helpers/base64';
import { BitSeparator } from './helpers/bitSeparator';
import { SignalBuilder } from './helpers/signalBuilder';
import { concat, linspace, normalize } from './helpers/tools';
import { WAV } from './helpers/wav';

let _encode_base64_to_signal = (base64: string, sample_rate: number, bloc_duration: number) => {
    const base64_values: number[] = Base64.base64_to_array(base64)

    const freqs: number[] = linspace(100, 600, 6)
    const freq_porteuse = 50
    const amp: number = 90

    let signal: number[] = []

    for (let i = 0; i < base64_values.length; i++) {
        const val = base64_values[i]
        const binary_arr: number[] = BitSeparator.split(val, 1, 6)

        let bloc_signal: number[] = SignalBuilder.generateSignal(freq_porteuse, 0, bloc_duration, sample_rate, amp)

        for (let j = 0; j < freqs.length; j++) {
            if (binary_arr[j] != 0) {
                const freq: number = freqs[j]
                const freq_i_signal: number[] = SignalBuilder.generateSignal(freq, 0, bloc_duration, sample_rate, amp)
                bloc_signal = concat(bloc_signal, freq_i_signal)
            }
        }

        bloc_signal = normalize(bloc_signal, amp)
        signal = [...signal, ...bloc_signal]
    }

    return signal
}

let encode = (message: string) => {
    const SAMPLE_RATE = 44100
    const BLOC_DURATION = 0.2
    const BIT_PER_SAMPLE = 16

    const message_b64: string = Base64.encode(message)

    const signal: number[] = _encode_base64_to_signal(message_b64, SAMPLE_RATE, BLOC_DURATION)

    const sound = WAV.encode(signal, 1, SAMPLE_RATE, BIT_PER_SAMPLE)

    fs.writeFileSync('tmp/test_encode.wav', sound, { encoding: null })
}

encode('Hello world !')