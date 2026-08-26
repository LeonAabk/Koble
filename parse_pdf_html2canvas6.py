import pytesseract
import cv2

image = cv2.imread('debug_pdf_html2canvas3.png')
gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
text = pytesseract.image_to_string(gray)
print("Extracted Text:", text)
