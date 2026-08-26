import pdf2image
import cv2
import numpy as np

pages = pdf2image.convert_from_path('downloaded_test_final3.pdf')
pages[0].save('debug_pdf_html2canvas5.png', 'PNG')
image = cv2.imread('debug_pdf_html2canvas5.png')
gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
non_white_pixels = np.sum(gray < 250)
print(f"Number of non-white pixels: {non_white_pixels}")
