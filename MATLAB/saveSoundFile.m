function [fullFileName] = saveSoundFile
    folder = pwd;
    baseFileName =  'Test_wave.wav';
    fullFileName = fullfile(folder, ['/resources/sounds/', baseFileName]);
    fprintf('Full File Name = %s\n', fullFileName);
end