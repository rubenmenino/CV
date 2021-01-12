from cv2 import cv2
import numpy as np

cap = cv2.VideoCapture(2)

def nothing(x):
    pass


def numberOfCards(image):
    font = cv2.FONT_HERSHEY_SIMPLEX 
    # org 
    org = (50, 50) 
    # fontScale 
    fontScale = 1
    # Blue color in BGR 
    color = (255, 0, 0) 
    # Line thickness of 2 px 
    thickness = 2
    # Using cv2.putText() method 
    image = cv2.putText(frame, numContoursStr, org, font,  
                   fontScale, color, thickness, cv2.LINE_AA) 

def imageProcessing(img): 
    n = 5
    sygmaY = 100
    thresh = 130 #  200 de thresh     # para o meu setup
    # to gray scale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    # por a imagem mais baça
    smooth = cv2.GaussianBlur(gray, (n, n), sygmaY)
    # o valor para a trash está para um fundo preto(200)
    val, threshImage = cv2.threshold(smooth, t, 255, cv2.THRESH_BINARY)
    return threshImage


while True:
    ret, frame = cap.read()
    t = cv2.getTrackbarPos('t', 'modified') # ver depois
    ## processar a imagem
    modified = imageProcessing(frame)
    mode = cv2.RETR_EXTERNAL
    method = cv2.CHAIN_APPROX_SIMPLE
    cards = []
    ## desenhar o contorno (encontra vários contornos)
    contours, hierarchy = cv2.findContours(modified, mode, method) 
    countMoreNumber = []
    pointsCards = []
    #print(len(contours))
    numContours = len(contours) - 2 # dáme sempre dois a mais, nao faço a minima porque, (-2)
    if numContours == 0:
        pass
    elif numContours == 1:
        numContoursStr = 'Existe ' + str(numContours) + ' carta'
    else:
        numContoursStr = 'Existem ' + str(numContours) + ' cartas'

    ## chamar a função texto numero de cartas 
    numberOfCards(frame)
    four_corners_set = []
    #print(len(contours) - 2)
    for con in contours:
        area = cv2.contourArea(con)
        approx = cv2.approxPolyDP(con, 0.015*cv2.arcLength(con, closed=True) , closed=True)

        #print("contours", cnt)
        if len(approx) == 4 and area > 20000: #numero de pontos (retangulo = 4)
            x, y, w, h = cv2.boundingRect(approx)
            #print("x", x)
            #print("y", y)
            ## point of each rectangle (top - right)
            ## 1st rectangle (36,79)   2st rectangle (244,74)   3st rectangle (452,77) ex
            cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 255), 2)
            
            pointsCards.append(approx)
            #print(pointsCards)
            
            for points in pointsCards:
                firstPoint = points[0]              ## pontos das cartas ( nao estao ordenados)
                secondPoint = points[1]
                thirdPoint = points[2]
                fourPoint = points[3]
            

            #print("firstPoint", firstPoint)      
            #print("secondPoint", secondPoint)    
            #print("thirdPoint", thirdPoint)      
            #print("fourPoint", fourPoint)        



    cv2.createTrackbar("t", "modified", 130, 200, nothing)   ## queria mudar em tempo real, idk como fazer
    cv2.imshow('frame', frame)
    cv2.imshow('modified', modified)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
