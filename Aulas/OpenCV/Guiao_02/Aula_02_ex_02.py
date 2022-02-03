import numpy as np
from cv2 import cv2
import sys
# read the image
image = cv2.imread("lena.jpg", cv2.IMREAD_UNCHANGED)


if np.shape(image) == ():
    # Failed Reading
    print("Image file could not be opened")
    exit(-1)

#image features
if len(image.shape) < 3:
    height, width = image.shape
    nchannels = 1
else:
    height, width, nchannels = image.shape

# Image characteristics
height, width = image.shape

print("Image Size: (%d,%d)" % (height, width))
print("Image Type: %s" % (image.dtype))
# Create two black images
gray_image = np.zeros((512, 256, 1))
print("Gray level image")
print("Number of rows :", gray_image.shape[0])
print("Number of columns :", gray_image.shape[1])
print("Number of channels :", gray_image.shape[2])
print("Number of elements :", gray_image.size)
# Create a visualization window
# CV_WINDOW_AUTOSIZE : window size will depend on image size
cv2.namedWindow("Display window", cv2.WINDOW_AUTOSIZE)

# Show the image
cv2.imshow("Display window", image)  

# Wait
cv2.waitKey(0)

# Destroy the window -- might be omitted
cv2.destroyWindow("Display window")
