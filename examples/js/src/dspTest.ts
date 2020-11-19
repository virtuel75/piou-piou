import * as fs from 'fs'

var buffer = fs.readFileSync('output_temp/data.txt')
let data = String(buffer)
let obj = JSON.parse(data)
console.log(obj)

var fft = require('fft-js').fft,
    fftUtil = require('fft-js').util,
    signal = obj;

var phasors= fft(signal);

var frequencies = fftUtil.fftFreq(phasors, 48000), // Sample rate and coef is just used for length, and frequency step
    magnitudes = fftUtil.fftMag(phasors); 

var both = frequencies.map(function (f, ix) {
    return {frequency: f, magnitude: magnitudes[ix]};
});

console.log(both);