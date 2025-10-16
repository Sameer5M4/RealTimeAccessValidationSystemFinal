# # ocr_validator.py

# import cv2
# import pytesseract
# import re

# # --- CONFIGURATION ---
# # IMPORTANT: Uncomment and update this path if Tesseract is not in your system's PATH.
# pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"


# def _advanced_clean_extracted_text(text):
#     """
#     An advanced function to clean OCR'd text, based on your provided logic.
#     """
#     keywords = ["Name", "Student Name", "Student", "Roll No", "Roll Number", "RN", "ROll", "R0ll"]
#     separators = [':', ';', '-']
#     cleaned_text = text
#     found_separator = False
#     for sep in separators:
#         if sep in cleaned_text:
#             try:
#                 cleaned_text = cleaned_text.split(sep, 1)[1]
#                 found_separator = True
#                 break
#             except IndexError:
#                 cleaned_text = ""
#                 found_separator = True
#                 break
#     if not found_separator:
#         for keyword in keywords:
#             cleaned_text = re.sub(f'(?i){keyword}', '', cleaned_text)
#     cleaned_text = re.sub(r'[^A-Za-z0-9 ]+', '', cleaned_text).strip()
#     return cleaned_text


# def _preprocess_for_ocr(image):
#     """
#     Applies preprocessing steps to an image to improve OCR accuracy, based on your logic.
#     """
#     # 1. Convert to grayscale
#     gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

#     # 2. Apply a binary threshold
#     _, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY | cv2.THRESH_OTSU)

#     # 3. Enlarge the image
#     scale_factor = 2
#     width = int(thresh.shape[1] * scale_factor)
#     height = int(thresh.shape[0] * scale_factor)
#     dim = (width, height)
#     resized = cv2.resize(thresh, dim, interpolation=cv2.INTER_CUBIC)
    
#     # You can uncomment the line below for debugging to see the preprocessed image
#     # cv2.imwrite("debug_preprocessed_crop.jpg", resized)

#     return resized


# def validate_text_fields(id_card_img, student_name_coords, roll_number_coords):
#     """
#     Crops, preprocesses, extracts, cleans, and validates text using your specified logic,
#     while fitting into the main workflow.

#     Args:
#         id_card_img (numpy.ndarray): The pre-loaded image from cv2.imread.
#         student_name_coords (list): Coordinates for the student's name.
#         roll_number_coords (list): Coordinates for the student's roll number.

#     Returns:
#         bool: True if all fields are valid, False otherwise.
#     """
#     print("\n--- 3. Starting OCR Field Validation ---")
    
#     if id_card_img is None:
#         print("Status: FAILED\nReason: Invalid image object received for OCR.")
#         return False

#     # --- 1. Process Student Name (No Preprocessing) ---
#     try:
#         x1, y1, x2, y2 = [int(round(c)) for c in student_name_coords]
#         name_crop = id_card_img[y1:y2, x1:x2]
#         raw_name_text = pytesseract.image_to_string(name_crop, config=r'--psm 7').strip()
#         student_name_text = _advanced_clean_extracted_text(raw_name_text)
#     except Exception as e:
#         print(f"Status: FAILED\nReason: Could not process student name for OCR. Error: {e}")
#         return False

#     # --- 2. Process Roll Number (WITH Preprocessing) ---
#     try:
#         x1, y1, x2, y2 = [int(round(c)) for c in roll_number_coords]
#         roll_no_crop = id_card_img[y1:y2, x1:x2]
        
#         # Apply the specific preprocessing from your file
#         preprocessed_roll_crop = _preprocess_for_ocr(roll_no_crop)
        
#         raw_roll_no_text = pytesseract.image_to_string(preprocessed_roll_crop, config=r'--psm 7').strip()
        
#         # Clean the text and remove spaces for validation
#         roll_number_text = _advanced_clean_extracted_text(raw_roll_no_text).replace(" ", "")

#     except Exception as e:
#         print(f"Status: FAILED\nReason: Could not process roll number for OCR. Error: {e}")
#         return False
        
#     # --- 3. Validate the Extracted and Cleaned Data ---
#     name_is_valid = bool(student_name_text)
#     roll_number_is_valid = len(roll_number_text) == 10 and roll_number_text.isalnum()

#     # --- 4. Display Final Results and Return Status ---
#     print(f"Raw Extracted Name:    '{raw_name_text}'")
#     print(f"Cleaned Name:          '{student_name_text}' -> Validation: {'PASSED' if name_is_valid else 'FAILED'}")
#     print("-" * 30)
#     print(f"Raw Extracted Roll No: '{raw_roll_no_text}'")
#     print(f"Cleaned Roll No:       '{roll_number_text}' -> Validation: {'PASSED' if roll_number_is_valid else 'FAILED'}")

#     if name_is_valid and roll_number_is_valid:
#         print("Status: SUCCESS\nReason: All text fields were extracted and validated successfully.")
#         return True
#     else:
#         print("Status: FAILED\nReason: One or more text fields failed validation.")
#         return False
# ocr_validator.py

import cv2
import pytesseract
import re

# --- CONFIGURATION ---
# IMPORTANT: Uncomment and update this path if Tesseract is not in your system's PATH.
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"


def _advanced_clean_extracted_text(text):
    """
    An advanced function to clean OCR'd text, based on your provided logic.
    """
    keywords = ["Name", "Student Name", "Student", "Roll No", "Roll Number", "RN", "ROll", "R0ll"]
    separators = [':', ';', '-']
    cleaned_text = text
    found_separator = False
    for sep in separators:
        if sep in cleaned_text:
            try:
                cleaned_text = cleaned_text.split(sep, 1)[1]
                found_separator = True
                break
            except IndexError:
                cleaned_text = ""
                found_separator = True
                break
    if not found_separator:
        for keyword in keywords:
            cleaned_text = re.sub(f'(?i){keyword}', '', cleaned_text)
    cleaned_text = re.sub(r'[^A-Za-z0-9 ]+', '', cleaned_text).strip()
    return cleaned_text


def _preprocess_for_ocr(image):
    """
    Applies preprocessing steps to an image to improve OCR accuracy, based on your logic.
    """
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    _, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY | cv2.THRESH_OTSU)
    scale_factor = 2
    width = int(thresh.shape[1] * scale_factor)
    height = int(thresh.shape[0] * scale_factor)
    dim = (width, height)
    resized = cv2.resize(thresh, dim, interpolation=cv2.INTER_CUBIC)
    return resized


def validate_text_fields(id_card_img, student_name_coords, roll_number_coords):
    """
    Crops, preprocesses, extracts, cleans, and validates text using your specified logic.

    Returns:
        tuple: (bool, str or None). (True, "Student Name") if valid, (False, None) otherwise.
    """
    print("\n--- 3. Starting OCR Field Validation ---")
    
    if id_card_img is None:
        print("Status: FAILED\nReason: Invalid image object received for OCR.")
        return False, None

    # --- 1. Process Student Name ---
    try:
        x1, y1, x2, y2 = [int(round(c)) for c in student_name_coords]
        name_crop = id_card_img[y1:y2, x1:x2]
        raw_name_text = pytesseract.image_to_string(name_crop, config=r'--psm 7').strip()
        student_name_text = _advanced_clean_extracted_text(raw_name_text)
    except Exception as e:
        print(f"Status: FAILED\nReason: Could not process student name for OCR. Error: {e}")
        return False, None

    # --- 2. Process Roll Number ---
    try:
        x1, y1, x2, y2 = [int(round(c)) for c in roll_number_coords]
        roll_no_crop = id_card_img[y1:y2, x1:x2]
        preprocessed_roll_crop = _preprocess_for_ocr(roll_no_crop)
        raw_roll_no_text = pytesseract.image_to_string(preprocessed_roll_crop, config=r'--psm 7').strip()
        roll_number_text = _advanced_clean_extracted_text(raw_roll_no_text).replace(" ", "")
    except Exception as e:
        print(f"Status: FAILED\nReason: Could not process roll number for OCR. Error: {e}")
        return False, None
        
    # --- 3. Validate the Extracted and Cleaned Data ---
    name_is_valid = bool(student_name_text)
    roll_number_is_valid = len(roll_number_text) == 10 and roll_number_text.isalnum()

    # --- 4. Display Final Results and Return Status ---
    print(f"Raw Extracted Name:    '{raw_name_text}'")
    print(f"Cleaned Name:          '{student_name_text}' -> Validation: {'PASSED' if name_is_valid else 'FAILED'}")
    print("-" * 30)
    print(f"Raw Extracted Roll No: '{raw_roll_no_text}'")
    print(f"Cleaned Roll No:       '{roll_number_text}' -> Validation: {'PASSED' if roll_number_is_valid else 'FAILED'}")

    if name_is_valid and roll_number_is_valid:
        print("Status: SUCCESS\nReason: All text fields were extracted and validated successfully.")
        return True, student_name_text
    else:
        print("Status: FAILED\nReason: One or more text fields failed validation.")
        return False, None