from cv2 import cv2
import numpy as np

cap = cv2.VideoCapture(2)

def imageProcessing(img): 
    n = 5
    sygmaY = 100
    thresh = 70 #  200 de thresh

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
    mode = cv2.RETR_EXTERNAL
    method = cv2.CHAIN_APPROX_SIMPLE
    cardsContours = []
    ## desenhar o contorno (encontra vários contornos)
    contours, hierarchy = cv2.findContours(modified, mode, method) 
    contours = sorted(contours, key = cv2.contourArea, reverse = True)[:10]  # até 10

    for con in contours:         
        cv2.drawContours(frame, contours, -1, (0, 0, 255), 3) # -1, tudo 

    
    

    cv2.imshow('frame', frame)
    cv2.imshow('modified', modified)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
