function imageToSound(fileName, extension)
    init()
    fontSize = 10;
    fileName = strcat("resources/images/", fileName, ".", extension); 
    
    % Create the filename where we will save the waveform.
    fullFileName = saveSoundFile();
    
    % Play waveForm
    [t, y] = playSound(2, fullFileName);
    
    % Threshold image
    binaryImage = binarizeImage(fileName); 

    % Plot the waveform:
    figure()
    subplot(1, 2, 1);
    plot(t, y, 'b-');
    title('Original Waveform', 'FontSize', fontSize);
    xlabel('Time', 'FontSize', fontSize);
    ylabel('Y', 'FontSize', fontSize);
    grid on;

    % Make the binary signal for BPSK the same size as the image.
    phase = imresize(binaryImage(:), [length(y), 1]); 

    % Invert the signal wherever the binary image is 1
    y(phase) = -y(phase); 

    % Plot the waveform:
    subplot(1, 2, 2);
    plot(t, y, 'b-');
    title('Altered Waveform', 'FontSize', fontSize);
    xlabel('Time', 'FontSize', fontSize);
    ylabel('Y', 'FontSize', fontSize);
    grid on;

end