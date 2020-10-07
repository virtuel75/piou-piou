function binaryImage = binarizeImage(grayImage)
    % grayImage = imread(fileName);
    binaryImage = imbinarize(grayImage);
    imshowpair(grayImage, binaryImage, 'montage'); 
end