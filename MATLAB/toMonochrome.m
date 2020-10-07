function [monochromeImage] = toMonochrome(originalImagePath)
%TOMONOCHROME transform an colored image in a monochrome one
%   Detailed explanation goes here

    originalImage = imread(originalImagePath); 
    
    red = originalImage(:,:,1); 
    green = originalImage(:,:,2); 
    blue = originalImage(:,:,3); 
    
%     monochromeImage = 0.3 * red + 0.59 * green + 0.11 * blue; 
    monochromeImage =  red .* green .* blue;
    imshowpair(originalImage, monochromeImage, 'montage');
    
%     size(originalImage)
%     size(monochromeImage) 
end

