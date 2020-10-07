init(); 

IMAGE_PATH = 'resources/images/piou-piou.jpg'; 

% Aplatir l'image : 
[indexedImage, cmap] = rgb2ind(imread(IMAGE_PATH), 255); 
imagesc(indexedImage); 
colormap(cmap)
size(indexedImage)


% subplot(1,2,1)
% plot(originalImage); 