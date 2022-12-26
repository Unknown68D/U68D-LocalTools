# There is an exe equivalent of this file provided for your convenience.
# You can always run this file with python to generate the same script if you do not trust the provided exe.
# You can also create an exe from this python file using "auto-py-to-exe"

import os

def replaceLast(string, find, replace):
    reversed = string[::-1]
    replaced = reversed.replace(find[::-1], replace[::-1], 1)
    return replaced[::-1]

fileNames = (os.listdir(os.getcwd()))
fileLines = []

for fileName in fileNames:
    if fileName.endswith(".mp3"):
        print("Found mp3: " + fileName)
        commandStr = "eyeD3 --add-image \"" + \
            replaceLast(fileName, ".mp3", ".png") + \
            ":FRONT_COVER\" " + "\"" + fileName + "\"\n"
        fileLines.append(commandStr)

fileLines.append("echo 'COMPLETE!'")

outputFileName = "~[RUN-SECOND]_CoverImage.ps1"

file = open(outputFileName, "w")

print("\n---FILE LINES---\n")
errorWritingLine = False
failedFileLines = []

for fileLine in fileLines:
    print("File Line: " + fileLine.replace("\n", ""))
    try:
        file.writelines(fileLine)
    except Exception:
        errorWritingLine = True
        failedFileLines.append(fileLine.replace("\n", ""))
file.close()

print("\n----------------------------------------\n\nScript Generated!\n")
if errorWritingLine:
    print("The following mp3 files have invalid characters in them. Use the PowerRename utility to rename them and execute again. Otherwise, the cover art for some mp3 files will not be added to them automatically.\n")
    for fileName in failedFileLines:
        print(fileName)
    print()

input("Run '" + outputFileName +
      "' to add the images to the mp3 covers. Press ENTER to close.\n")
