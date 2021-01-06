from cv2 import cv2
import numpy as np

cap = cv2.VideoCapture(0)

def imageProcessing(img): 
    n = 5
    sygmaY = 100
    thresh = 200 #  200 de thresh

    # to gray scale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # por a imagem mais baça
    smooth = cv2.GaussianBlur(gray, (n, n), sygmaY)

    # o valor para a trash está para um fundo preto(200)
    val, threshImage = cv2.threshold(smooth, thresh, 255, cv2.THRESH_BINARY)
    return threshImage


while True:
    ret, frame = cap.read()

    ## processar a imagem
    modified = imageProcessing(frame)

    cv2.imshow('frame', frame)
    cv2.imshow('modified', modified)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()