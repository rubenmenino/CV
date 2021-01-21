from cv2 import cv2
import numpy as np

cap = cv2.VideoCapture(2)

def nothing(x):
    pass

                        ## top left,  # top right, #bottom right, #bottom left,
def ordenatePoints(points): #bottom right, #bottom left,  # top left,  # top right,     # retorna os primeiros 4 pontos (funciona se tiver uma carta)
    arr = np.array(points)[:, 0] # Remove singleton dimension
    # Find the centroid
    cen = np.mean(arr, axis=0)
    # Find the angle from each point to its centroid
    angles = np.arctan2(arr[:,1] - cen[1], arr[:,0] - cen[0])
    
    # Because arctan spans -pi to pi, let's switch to 0 to 2*pi
    angles[angles < 0] = angles[angles < 0] + 2*np.pi
    # Order based on angle - ascending order
    ind = np.argsort(-angles)
    #print("antes", angles)
    # Reorder your points
    arr_sorted = arr[ind] 
    
    #print("depois", arr_sorted)
    arr_sorted = arr
    arr_sorted = [arr[2],arr[3],arr[0],arr[1]]
    return arr_sorted


def numberOfCards(image, number):
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
    image = cv2.putText(frame, number, org, font,  
                   fontScale, color, thickness, cv2.LINE_AA) 

def imageProcessing(img, threshold): 
    n = 5
    sygmaY = 100
    thresh = threshold #  200 de thresh     # para o meu setup
    # to gray scale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    # por a imagem mais baça
    smooth = cv2.GaussianBlur(gray, (n, n), sygmaY)
    # o valor para a trash está para um fundo preto(200)
    val, threshImage = cv2.threshold(smooth, t, 255, cv2.THRESH_BINARY)
    return threshImage


cv2.namedWindow("modified")
value = 140
cv2.createTrackbar("t", "modified", value, 200, nothing)   ## queria mudar em tempo real, idk como fazer
while True:
    #print(t)
    ret, frame = cap.read()
    
    t = cv2.getTrackbarPos("t", "modified") # ver depois
    #print(t)
    ## processar a imagem
    img2 = frame.copy()
    modified = imageProcessing(frame, t)
    mode = cv2.RETR_EXTERNAL
    method = cv2.CHAIN_APPROX_SIMPLE
    ## desenhar o contorno (encontra vários contornos)
    contours, hierarchy = cv2.findContours(modified, mode, method) 
    pointsCards = []
    #print(len(contours))


    ## chamar a função texto numero de cartas 
    
    fourPointsCard = []
    fourPoints = [[]]
    cardDimensions = []
    order = []
    #print(len(contours) - 2)
    for con in contours:
        area = cv2.contourArea(con)
        approx = cv2.approxPolyDP(con, 0.015*cv2.arcLength(con, closed=True) , closed=True) 

        cv2.drawContours(frame, contours, -1, (0, 0, 255), 3) # -1, tudo
        #print("contours", cnt)
        if len(approx) == 4 and area > 20000: #numero de pontos (retangulo = 4)
            x, y, w, h = cv2.boundingRect(approx)
            cardDimensions.append((w,h))
            #print("lululul",cardDimensions)
            #print("w", w)
            #print("h", h)
            ## point of each rectangle (top - right)
            ## 1st rectangle (36,79)   2st rectangle (244,74)   3st rectangle (452,77) ex
            #cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 255), 2)
            
            pointsCards.append(approx)

            #print(pointsCards)
            for points in pointsCards:
                fourPointsCard = []
                firstPoint = points[0]              ## pontos das cartas ( nao estao ordenados)
                secondPoint = points[1]
                thirdPoint = points[2]
                fourPoint = points[3]
                
                #print("firstPoint", firstPoint)      
                #print("secondPoint", secondPoint)    
                #print("thirdPoint", thirdPoint)      
                #print("fourPoint", fourPoint)        

                duplicate = False
                #print(duplicate)

                for lst in fourPoints:
                    if lst!=[] and firstPoint in lst[0]:
                
                      duplicate = True  

                if not duplicate:
                    fourPointsCard.append(firstPoint)
                    fourPointsCard.append(secondPoint)
                    fourPointsCard.append(thirdPoint)
                    fourPointsCard.append(fourPoint)
                #arr = np.array(fourPointsCard)
                #print(arr)
                    #print("-------")
                    fourPoints += [fourPointsCard]

                
                    
                     

    fourPoints.pop(0)
    #print(fourPoints) 
    #print(len(fourPoints))       
    
    if (len(fourPoints) == 0 ) :
        numContoursStr = 'Nao foi detetada nenhuma carta'
    elif len(fourPoints) == 1:
        numContoursStr = 'Existe 1 carta'
    else:
        numContoursStr = 'Existem ' + str(len(fourPoints)) + ' cartas'
    
    numberOfCards(frame, numContoursStr)
    
    
    if fourPoints != []: 
        a = ordenatePoints(fourPoints[0])
        print(a)
        
        
        (tl, tr, bl, br,) = a
        widthA = np.sqrt(((br[0] - bl[0]) ** 2) + ((br[1] - bl[1]) ** 2))
        widthB = np.sqrt(((tr[0] - tl[0]) ** 2) + ((tr[1] - tl[1]) ** 2))
        maxWidth = max(int(widthA), int(widthB))
        #print("maxWidth",maxWidth)

        heightA = np.sqrt(((tr[0] - br[0]) ** 2) + ((tr[1] - br[1]) ** 2))
        heightB = np.sqrt(((tl[0] - bl[0]) ** 2) + ((tl[1] - bl[1]) ** 2))
        maxHeight = max(int(heightA), int(heightB))
        #print("maxHeight", maxHeight)

        #print("a",a)
        src = np.float32(a)
        #print("1src", src)
        # 1: w    2:h
        #if not cardDimensions[0][0] > cardDimensions[0][1]:
            #print("lululul",cardDimensions[0][0])
            
            #src = cv2.flip(src,0)
            #src = cv2.rotate(src, cv2.ROTATE_90_COUNTERCLOCKWISE)
            #print("src",src)

        
        #print(a)
        # perspective transform (https://www.geeksforgeeks.org/perspective-transformation-python-opencv/) # função opencv
        
        #print(src)
        # now define which corner we are referring to
        #dst = np.float32([[0, 0], [0, 400], [300, 400], [300, 0]])  # top left, # top right, #bottom left, #bottom right
        
        dst = np.array([
		[0, 0],
		[maxWidth - 1, 0],
		[maxWidth - 1, maxHeight - 1],
		[0, maxHeight - 1]], dtype = "float32")


        # transformation matrix
        matrix = cv2.getPerspectiveTransform(src, dst)

        resultPerspective = cv2.warpPerspective(frame, matrix, (maxWidth, maxHeight))

        
        
        #print(resultPerspective)
        cv2.imshow('wrap', resultPerspective)

    


    
    cv2.imshow('frame', frame)
    cv2.imshow('modified', modified)
    


    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()