% Initialization / clean-up code.
clc;    % Clear the command window.
close all;  % Close all figures (except those of imtool.)
clear;  % Erase all existing variables. Or clearvars if you want.
workspace;  % Make sure the workspace panel is showing.

% Load an image
img = imread('resources/piou-piou.jpg'); 

binaryImage = imbinarize(img);
imshowpair(img, binaryImage, 'montage');
