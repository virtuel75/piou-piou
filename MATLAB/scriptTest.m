
% Load an image
img = imread('resources/piou-piou.jpg'); 

binaryImage = imbinarize(img);
imshowpair(img, binaryImage, 'montage');
