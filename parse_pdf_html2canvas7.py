import pdf2image
import cv2
import numpy as np

pages = pdf2image.convert_from_path('downloaded_test_final3.pdf')
pages[0].save('debug_pdf_html2canvas4.png', 'PNG')
