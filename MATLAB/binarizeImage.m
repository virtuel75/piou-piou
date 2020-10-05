function binaryImage = binarizeImage(fileName)
    grayImage = imread(fileName);
    binaryImage = imbinarize(grayImage);
    whos
    originalImage = imageinfo(fileName); 
    figure()
    imshowpair(grayImage, binaryImage, 'montage');
    
end