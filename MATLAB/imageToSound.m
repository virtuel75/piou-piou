function imageToSound(fileName, extension)
    init()
    fontSize = 20;

    % Read in an image.
    grayImage = imread(strcat("resources/images/", fileName, ".", extension)); 

    % Threshold it
    binaryImage = imbinarize(grayImage);

    % Create the filename where we will save the waveform.
    fullFileName = saveSoundFile(); 
    
    % Set up the time axis:
    Fs = 8000;
    duration = 2; % seconds.
    t = 1 : duration * Fs; % 2 seconds

    % Set up the period (pitch, frequency):
    T = 13; % Constant pitch if you use this.

    % Create the maximum amplitude:
    Amplitude = 32767;

    % Construct the waveform:
    y = int16(Amplitude .* sin(2.*pi.*t./T));
    % y = abs(int16(Amplitude .* sin(2.*pi.*x./T)));
    
    % Play the original sound.
    player = audioplayer(y, Fs);
    play(player);
    
    % Write the waveform to a file:
    audiowrite(fullFileName, y, Fs);
    promptMessage = sprintf('That was the original sound.\nClick OK to play the altered sound.');
    button = questdlg(promptMessage, 'Continue?', 'OK', 'Quit', 'OK');
    if strcmpi(button, 'Quit')
        return;
    end

    % Display the gray scale image.
    subplot(2, 2, 1);
    imshow(grayImage);
    title(fileName, 'FontSize', fontSize);
    
    % Display the binary image.
    subplot(2, 2, 3);
    imshowpair(grayImage, binaryImage, 'montage');
    title('Binary Image', 'FontSize', fontSize);
    
    % Plot the waveform:
    subplot(2, 2, 2);
    plot(t, y, 'b-');
    title('Original Waveform', 'FontSize', fontSize);
    xlabel('Time', 'FontSize', fontSize);
    ylabel('Y', 'FontSize', fontSize);
    grid on;

    % Enlarge figure to full screen.
    set(gcf, 'units','normalized','outerposition',[0 0 1 1]);
    fprintf('Writing file %s...\n', fullFileName);

    % Make the binary signal for BPSK the same size as the image.
    phase = imresize(binaryImage(:), [length(y), 1]);

    % Invert the signal wherever the binary image is 1
    y(phase) = -y(phase)

    % Plot the waveform:
    subplot(2, 2, 4);
    plot(t, y, 'b-');
    title('Altered Waveform', 'FontSize', fontSize);
    xlabel('Time', 'FontSize', fontSize);
    ylabel('Y', 'FontSize', fontSize);
    grid on;

    % Play the sound as many times as the user wants.
    playAgain = true;
    while playAgain
        % Play the sound that we just created.
        fprintf('Playing file %s : ', fullFileName);
        player = audioplayer(y, Fs);
        play(player);
        % Ask user if they want to play the sound again.
        promptMessage = sprintf('Do you want to play the altered sound again?');
        button = questdlg(promptMessage, 'Continue ? ', 'Yes', 'No', 'Yes');
        if strcmpi(button, 'No')
            playAgain = false;
            break;
        end
    end

    % Alert user that we are done.
    message = sprintf('Done playing %s.\n', fullFileName);
    fprintf('%s\n', message);
    promptMessage = sprintf('Done playing %s.\nClick OK to close the window\nor Cancel to leave it up.', fullFileName);
    button = questdlg(promptMessage, 'Continue?', 'OK', 'Cancel', 'OK');
    if strcmpi(button, 'OK')
        close all;	% Close down the figure.
    end
end