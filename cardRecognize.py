from cv2 import cv2
import urllib.request
import numpy as np



#cap = cv2.VideoCapture(0)
URL = "http://192.168.1.12:8080/shot.jpg" #p eu correr no tele
#URL =  "http://192.168.1.194:8080/shot.jpg"

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
    #arr_sorted = [arr[2],arr[3],arr[0],arr[1]]
    return arr_sorted


def numberOfCards(image, number):
    font = cv2.FONT_HERSHEY_SIMPLEX 
    # org 
    org = (50, 50) 
    # fontScale 
    fontScale = 3
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



def image_resize(image, width = None, height = None): #resize proporcional

    dim = None
    (h, w) = image.shape[:2]

  
    if width is None and height is None:
        return image
    
    if width is None:
        r = height / float(h)
        dim = (int(w * r), height)

    else:
     
        r = width / float(w)
        dim = (width, int(h * r))

    # resize the image
    resized = cv2.resize(image, dim, interpolation = cv2.INTER_AREA)

    return resized

def transform2binary(image):
    image = ~image 
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    _,img = cv2.threshold(gray, t, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

    return img

def addImages(image1, image2):
    #image1 = transform2binary(image1)
    #image2 = transform2binary(image2)

    added_im = cv2.add(image1,image2)

    return added_im

def toGray(image):
    return cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

def loadCardImages():
    global five,ace,king,two,hearts,spades,diamonds,clubs
    global number_dict, symbol_dict
    
    
    three = toGray(cv2.imread("cardsLogo/numbers/three.jpg"))
    four = toGray(cv2.imread("cardsLogo/numbers/four.jpg"))
    six = toGray(cv2.imread("cardsLogo/numbers/six.jpg"))
    seven = toGray(cv2.imread("cardsLogo/numbers/seven.jpg"))
    eight = toGray(cv2.imread("cardsLogo/numbers/eight.jpg"))
    nine = toGray(cv2.imread("cardsLogo/numbers/nine.jpg"))
    ten = toGray(cv2.imread("cardsLogo/numbers/ten.jpg"))
    queen = toGray(cv2.imread("cardsLogo/numbers/queen.jpg"))
    knave = toGray(cv2.imread("cardsLogo/numbers/knave.jpg"))
       

    five = toGray(cv2.imread("cardsLogo/numbers/five.jpg"))
    ace = toGray(cv2.imread("cardsLogo/numbers/ace.jpg"))
    king = toGray(cv2.imread("cardsLogo/numbers/king.jpg"))
    two = toGray(cv2.imread("cardsLogo/numbers/two.jpg"))

    number_dict = {"five":five, "ace":ace, "king":king, "two":two, "three": three, "four":four, "six":six, "seven":seven, "eight":eight, "nine":nine, "ten":ten, "queen": queen, "knave":knave }

    hearts = toGray(cv2.imread("cardsLogo/simbols/hearts.jpg"))
    spades = toGray(cv2.imread("cardsLogo/simbols/spades.jpg"))
    diamonds = toGray(cv2.imread("cardsLogo/simbols/diamonds.jpg"))
    clubs = toGray(cv2.imread("cardsLogo/simbols/clubs.jpg"))

    symbol_dict = {"hearts":hearts, "spades": spades,"clubs":clubs,"diamonds":diamonds}

def bestMatch(num, symb):
    global number_dict, symbol_dict

    min_number_pixels = 9999999999
    best_match_number = 0
    for key in number_dict.keys():
        added = addImages(num, number_dict[key])
        pixels = cv2.countNonZero(added)

        if pixels < min_number_pixels:
            best_match_number = key
            min_number_pixels = pixels

    symbol_pixels = cv2.countNonZero(symb)
    min = 9999999
    best_match_symbol = 0
    for key in symbol_dict.keys():
        
        diff = cv2.absdiff(symb, symbol_dict[key] )
        value  = int(np.sum(diff)/255)

        if value < min:
            best_match_symbol = key
            min = value

    return best_match_number, best_match_symbol


cv2.namedWindow("modified")
value = 106
cv2.createTrackbar("t", "modified", value, 200, nothing)   ## queria mudar em tempo real, idk como fazer

loadCardImages()

#cv2.imshow('cinco',cinco)

#print("cinco",eight.shape)

while True:
    #print(t)
    #ret, frame = cap.read()
    
    img_arr = np.array(bytearray(urllib.request.urlopen(URL).read()),dtype=np.uint8)
    frame = cv2.imdecode(img_arr, -1)

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
            
            pointsCards.append(approx)

            #print(pointsCards)
            for points in pointsCards:
                fourPointsCard = []
                firstPoint = points[0]              ## pontos das cartas ( nao estao ordenados)
                secondPoint = points[1]
                thirdPoint = points[2]
                fourPoint = points[3]
                
                duplicate = False
         
                for lst in fourPoints:
                    if lst!=[] and firstPoint in lst[0]:
                
                      duplicate = True  

                if not duplicate:
                    fourPointsCard.append(firstPoint)
                    fourPointsCard.append(secondPoint)
                    fourPointsCard.append(thirdPoint)
                    fourPointsCard.append(fourPoint)
               
                    fourPoints += [fourPointsCard]        
                     

    fourPoints.pop(0)     
    
    if (len(fourPoints) == 0 ) :
        numContoursStr = 'Nao foi detetada nenhuma carta'
    elif len(fourPoints) == 1:
        numContoursStr = 'Existe 1 carta'
    else:
        numContoursStr = 'Existem ' + str(len(fourPoints)) + ' cartas'
    
    numberOfCards(frame, numContoursStr)
    
    if fourPoints != []: 
        for points in fourPoints:
    
            a = ordenatePoints(points)
        
            (br, bl, tl, tr) = a
       
            widthA = np.sqrt(((br[0] - bl[0]) ** 2) + ((br[1] - bl[1]) ** 2))
            widthB = np.sqrt(((tr[0] - tl[0]) ** 2) + ((tr[1] - tl[1]) ** 2))
            maxWidth = max(int(widthA), int(widthB))
       

            heightA = np.sqrt(((tr[0] - br[0]) ** 2) + ((tr[1] - br[1]) ** 2))
            heightB = np.sqrt(((tl[0] - bl[0]) ** 2) + ((tl[1] - bl[1]) ** 2))
            maxHeight = max(int(heightA), int(heightB))
        
       
            if  maxHeight > maxWidth :
            
                a = [tr,br,bl,tl]

            else:
                maxH = maxHeight
                maxHeight = maxWidth
                maxWidth = maxH

            src = np.float32(a)
          
        
            #print(a)
            # perspective transform (https://www.geeksforgeeks.org/perspective-transformation-python-opencv/) # função opencv
        
            dst = np.array([ #ordem contraria aos pontos
		    [0, 0],
		    [0, maxHeight - 1],
		    [maxWidth - 1, maxHeight - 1],
		    [maxWidth - 1, 0]], dtype = "float32")


            # transformation matrix
            matrix = cv2.getPerspectiveTransform(src, dst)

            resultPerspective = cv2.warpPerspective(frame, matrix, (maxWidth, maxHeight))

            resultPerspective = image_resize(resultPerspective, 300)

            logo = resultPerspective[0:120, 0:40] #primerio valor altura(x), segundo largura(y), wrap cut number + simbol
            logo = transform2binary(logo)
            ## split simbol and number

            number = logo[0:65, 0:45]
            simbol = logo[65:130, 0:45]
        
            ## SIMBOL
            contoursSimbol, hier = cv2.findContours(simbol, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
            contoursSimbol = sorted(contoursSimbol, key = cv2.contourArea, reverse=True)
        
 
            if len(contoursSimbol) != 0:
                x1,y1,w1,h1 = cv2.boundingRect(contoursSimbol[0])
                xSimbol = simbol[y1:y1+h1, x1:x1+w1]
                #cv2.rectangle(simbol,(x1,y1),(x1+w1,y1+h1),(255,0,0),2)
                #print("w1", w1) ## 34
                #print("h1",h1)  ## 55
                sizeSimbol = cv2.resize(xSimbol, (28,23),0,0)

            ## NUMBER
            contoursNumber, hier = cv2.findContours(number, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
            contoursNumber = sorted(contoursNumber, key = cv2.contourArea, reverse=True)
        
            if len(contoursNumber) != 0:
                x2,y2,w2,h2 = cv2.boundingRect(contoursNumber[0])
                xNumber = number[y2:y2+h2, x2:x2+w2]
                #cv2.rectangle(number,(x2,y2),(x2+w2,y2+h2),(255,0,0),2)
                #print("w2", w2) ## 27
                #print("h2",h2)  ## 31
                sizeNumber = cv2.resize(xNumber, (25,42),0 ,0)
                print("numero", sizeNumber.shape)

        
            #w_pixels_clubs = cv2.countNonZero(added_clubs)
        

            if sizeNumber.shape[0] == number_dict["five"].shape[0]:
                '''
                    print("lul")
                    added_clubs = addImages(sizeNumber,number_dict["five"])
            
                    w_pixels_clubs = cv2.countNonZero(added_clubs)

                    print("pixeis clubs", w_pixels_clubs)
            
                    cv2.imshow('added',added_clubs)

                    if w_pixels_clubs < 550:
                        cv2.putText(frame, 'É UM CINCO ', (50,400), 2,  
                            2, (255, 0, 0) , 2, cv2.LINE_AA) 
                '''
                number_txt, symbol_txt = bestMatch(sizeNumber, sizeSimbol)
                cv2.putText(frame, ""+number_txt+ " of "+ symbol_txt+" !", (int(br[0]), int(br[1])), 2,  
                            2, (255, 0, 0) , 2, cv2.LINE_AA)
                '''
                    added_clubs = addImages(sizeSimbol,symbol_dict["clubs"])
                    added_hearts = addImages(sizeSimbol,symbol_dict["hearts"])
                    added_spades = addImages(sizeSimbol,symbol_dict["spades"])
                    added_ouros = addImages(sizeSimbol,symbol_dict["diamonds"])
                '''


 
        cv2.imshow('wrap', resultPerspective)
        
        cv2.imshow('cropped', logo)
        cv2.imshow('simbol', sizeSimbol)
        cv2.imshow('number', sizeNumber)

        '''
            cv2.imshow('clubs', added_clubs)
            cv2.imshow('hearts', added_hearts)
            cv2.imshow('spades', added_spades)
            cv2.imshow('ouros', added_ouros)
        '''
        #print(sizeNumber)
        

    frame = image_resize(frame, 1000) 
    modified = image_resize(modified, 400)

    
    cv2.imshow('frame', frame)
    cv2.imshow('modified', modified)
    
    if cv2.waitKey(1) & 0xFF == ord('w'): #to get the cards logo
        cv2.imwrite('queen.jpg', sizeNumber)
        #cv2.imwrite('diamonds.jpg', sizeSimbol)

    if cv2.waitKey(25) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()