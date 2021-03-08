import json
import matplotlib.pyplot as mat
import numpy as np

def lenPxToCm(pxFromLeft):
    return (pxFromLeft-35)/10
initialLen = lenPxToCm(165)
c = ['0', 'b', 'g', 'r', 'm','b', 'g', 'r' ]
#c = ['0', 'w', 'w', 'w', 'm','w', 'w', 'w' ]

for s in [1,2,3,4,5,6,7]:
    with open (f"./{s}springdata.json") as data:
        dataArray = json.load(data)

    xArray = []
    longxArray =[]
    longyArray =[]
    yAvgArray = []
    yMaxArray = []
    yMinArray = []
    yStdArray = []
    bottom = []
    top = []
    for i in dataArray:
        i[0] = lenPxToCm(i[0])-initialLen
        trialYArray = np.asarray(i[1])
        for j in i[1]:
            longxArray.append(i[0])
            longyArray.append(j)
        xArray.append(i[0])
        yAvgArray.append(np.mean(i[1]))
        yMaxArray.append(np.amax(i[1]))
        yMinArray.append(np.amin(i[1]))
        yStdArray.append(np.std(i[1]))
        bottom.append(np.mean(i[1]) - 2*(np.std(i[1])))
        top.append(np.mean(i[1]) + 2*(np.std(i[1])))
    
#trial1 = dataArray[0]
#trial1 = trial1[1]
#n, bins, patches = mat.hist(trial1, 50, density=1, facecolor='g', alpha=0.75)
    
    longxArray = np.asarray(longxArray)
    longyArray = np.asarray(longyArray)
    
    regressionArray = np.vstack([longxArray, np.ones(len(longxArray))]).T
    regressionSlope, regressionIntercept = np.linalg.lstsq(regressionArray, longyArray, rcond=None)[0]
    print(regressionSlope, regressionIntercept)
    
    mat.plot(xArray, yAvgArray, f".{c[s]}")
    mat.plot(xArray, yMinArray, f"_{c[s]}")
    mat.plot(xArray, yMaxArray, f"_{c[s]}")
    #extend the lines to x=0 and x=29
    longxArray = np.append(longxArray, 0)
    longyArray = np.append(longyArray, regressionIntercept)
    longxArray = np.append(longxArray, 29)
    longyArray = np.append(longyArray, 29*regressionSlope+regressionIntercept)
    mat.plot(longxArray, regressionSlope*longxArray+regressionIntercept, c[s])

mat.xlabel('Increase in Spring Length (cm)')
mat.ylabel('Avg Force (N)')
mat.title('Average Force each trial by ΔLength')

mat.axis([0, 37, 0, 6])

mat.grid(True)
mat.show()