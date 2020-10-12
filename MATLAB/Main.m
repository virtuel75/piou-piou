% https://fr.mathworks.com/matlabcentral/answers/396576-how-can-i-conevrt-a-binary-matrix-to-a-wav-file
init(); 
IMAGE_PATH = 'resources/images/piou-piou.jpg'; 

% Create the filename where we will save the waveform.
fullFileName = saveSoundFile();

% Flatten image : 
[indexedImage, cmap] = rgb2ind(imread(IMAGE_PATH), 255); 
imagesc(indexedImage); 
colormap(cmap)

% Binarize image 
binaryImage = imbinarize(indexedImage); 

data = uint8(bin2dec(char(reshape(binaryImage, 1, []).'+'0'))); 

figure
title('Plot representing binarised image')
plot(1:length(data), data)
%xlim([5e5 5.001e5])

audiowrite(fullFileName, data, 2000)

size(indexedImage)
size(binaryImage)
size(data)


% subplot(1,2,1)
% plot(originalImage); 