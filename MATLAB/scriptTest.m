% Load an image
img = imread('resources/piou-piou.jpg'); 

% Show image
% imagesc(img)

% BPSK modulation : 
bpskmod =  comm.BPSKModulator
