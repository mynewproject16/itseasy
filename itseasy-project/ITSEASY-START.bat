@echo on
cd C:\itseasy-project\
del *.fdf
del pdfs\*.pdf
forever start itseasy-start.js
pause