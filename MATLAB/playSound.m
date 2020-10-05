function [t, y] = playSound(duration, fullFileName)
    % Amplitude max
    amplitude = 32767;
    % Set up the period (pitch, frequency):
    T = 13; % Constant pitch if you use this.
    % Set up the time axis:
    Fs = 8000;
    t = 1 : duration * Fs;
    % Construct the waveform:
    y = int16(amplitude .* sin(2.*pi.*t./T));
    
    player = audioplayer(y, Fs);
    play(player);
    audiowrite(fullFileName, y, Fs);
end