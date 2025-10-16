
import os
import cv2

# --- IMPORTANT: SET ENVIRONMENT VARIABLE BEFORE IMPORTING DEEPFACE ---
# This tells DeepFace to use the current project directory as its home,
# so it will look for models in './.deepface/weights/'
os.environ['DEEPFACE_HOME'] = os.getcwd()

from deepface import DeepFace

# --- CONFIGURATION ---
# Use the ArcFace model for recognition
FACE_RECOGNITION_MODEL = "ArcFace"
# Use a specific backend for face detection (optional but good for consistency)
DETECTOR_BACKEND = "retinaface"
# --- OPTIMIZATION: Define a max size for the selfie image ---
MAX_SELFIE_DIM = 640

def _resize_selfie(image, max_dim=MAX_SELFIE_DIM):
    """
    Internal helper to resize the selfie for faster processing.
    """
    h, w = image.shape[:2]
    # Only downscale if the image is larger than our max dimension
    if max(h, w) > max_dim:
        scale = max_dim / max(h, w)
        new_w, new_h = int(w * scale), int(h * scale)
        return cv2.resize(image, (new_w, new_h), interpolation=cv2.INTER_AREA)
    # If the image is already small, do nothing
    return image

def match_faces(selfie_path, id_card_path, id_photo_coords):
    """
    Matches a face from a selfie against a face cropped from an ID card.
    Includes optimization to resize the selfie for faster detection.
    """
    print("\n--- 2. Starting Face Verification ---")

    # --- 1. Load and Crop the Photo from the ID Card ---
    try:
        id_card_img = cv2.imread(id_card_path)
        if id_card_img is None:
            print(f"Status: FAILED\nReason: Could not read ID card image at path: {id_card_path}")
            return False

        x1, y1, x2, y2 = [int(c) for c in id_photo_coords]
        id_photo_crop = id_card_img[y1:y2, x1:x2]
    except Exception as e:
        print(f"Status: FAILED\nReason: Failed to crop the photo from the ID card. Error: {e}")
        return False

    # --- 2. SPEED OPTIMIZATION: Load and resize the selfie ---
    try:
        selfie_img = cv2.imread(selfie_path)
        if selfie_img is None:
            print(f"Status: FAILED\nReason: Could not read selfie image at path: {selfie_path}")
            return False
        
        # Apply the resizing function
        resized_selfie_img = _resize_selfie(selfie_img)
    except Exception as e:
        print(f"Status: FAILED\nReason: Failed to load or resize the selfie. Error: {e}")
        return False

    # --- 3. Verify the Faces using DeepFace with ArcFace model ---
    try:
        # CRITICAL: Pass the image OBJECTS (numpy arrays) to DeepFace, not the paths.
        # This uses the resized selfie and the cropped ID photo directly.
        # DeepFace will automatically use your local ArcFace model because we set DEEPFACE_HOME.
        result = DeepFace.verify(
            img1_path=resized_selfie_img,
            img2_path=id_photo_crop,
            model_name=FACE_RECOGNITION_MODEL,
            detector_backend=DETECTOR_BACKEND,
            enforce_detection=True
        )

        if result['verified']:
            print("Status: SUCCESS\nReason: The face in the selfie matches the face on the ID card.")
            return True
        else:
            print("Status: FAILED\nReason: The two faces are from different people.")
            return False

    except ValueError as e:
        print("Status: FAILED")
        if "Face could not be detected" in str(e):
             print("Reason: Could not detect a clear face in the selfie or the ID card photo.")
        else:
             print(f"Reason: An error occurred during face detection. Details: {e}")
        return False
    except Exception as e:
        print(f"Status: FAILED\nReason: An unexpected error occurred during face matching. Details: {e}")
        return False
# import cv2
# from deepface import DeepFace

# # --- CONFIGURATION ---
# FACE_RECOGNITION_MODEL = "SFace"
# DETECTOR_BACKEND = "retinaface"
# # --- OPTIMIZATION: Define a max size for the selfie image ---
# MAX_SELFIE_DIM = 640

# def _resize_selfie(image, max_dim=MAX_SELFIE_DIM):
#     """
#     Internal helper to resize the selfie for faster processing.
#     """
#     h, w = image.shape[:2]
#     # Only downscale if the image is larger than our max dimension
#     if max(h, w) > max_dim:
#         scale = max_dim / max(h, w)
#         new_w, new_h = int(w * scale), int(h * scale)
#         return cv2.resize(image, (new_w, new_h), interpolation=cv2.INTER_AREA)
#     # If the image is already small, do nothing
#     return image

# def match_faces(selfie_path, id_card_path, id_photo_coords):
#     """
#     Matches a face from a selfie against a face cropped from an ID card.
#     Includes optimization to resize the selfie for faster detection.
#     """
#     print("\n--- 2. Starting Face Verification ---")

#     # --- 1. Load and Crop the Photo from the ID Card ---
#     try:
#         id_card_img = cv2.imread(id_card_path)
#         if id_card_img is None:
#             print(f"Status: FAILED\nReason: Could not read ID card image at path: {id_card_path}")
#             return False

#         x1, y1, x2, y2 = [int(c) for c in id_photo_coords]
#         id_photo_crop = id_card_img[y1:y2, x1:x2]
#     except Exception as e:
#         print(f"Status: FAILED\nReason: Failed to crop the photo from the ID card. Error: {e}")
#         return False

#     # --- 2. SPEED OPTIMIZATION: Load and resize the selfie ---
#     try:
#         selfie_img = cv2.imread(selfie_path)
#         if selfie_img is None:
#             print(f"Status: FAILED\nReason: Could not read selfie image at path: {selfie_path}")
#             return False
        
#         # Apply the resizing function
#         resized_selfie_img = _resize_selfie(selfie_img)
#     except Exception as e:
#         print(f"Status: FAILED\nReason: Failed to load or resize the selfie. Error: {e}")
#         return False

#     # --- 3. Verify the Faces using DeepFace ---
#     try:
#         # CRITICAL: Pass the image OBJECTS (numpy arrays) to DeepFace, not the paths.
#         # This uses the resized selfie and the cropped ID photo directly.
#         result = DeepFace.verify(
#             img1_path=resized_selfie_img,
#             img2_path=id_photo_crop,
#             model_name=FACE_RECOGNITION_MODEL,
#             detector_backend=DETECTOR_BACKEND,
#             enforce_detection=True
#         )

#         if result['verified']:
#             print("Status: SUCCESS\nReason: The face in the selfie matches the face on the ID card.")
#             return True
#         else:
#             print("Status: FAILED\nReason: The two faces are from different people.")
#             return False

#     except ValueError as e:
#         print("Status: FAILED")
#         if "Face could not be detected" in str(e):
#              print("Reason: Could not detect a clear face in the selfie or the ID card photo.")
#         else:
#              print(f"Reason: An error occurred during face detection. Details: {e}")
#         return False
#     except Exception as e:
#         print(f"Status: FAILED\nReason: An unexpected error occurred during face matching. Details: {e}")
#         return False