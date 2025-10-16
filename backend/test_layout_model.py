# layout_validator.py

from ultralytics import YOLO
import cv2

# --- CONFIGURATION ---
CONFIDENCE_THRESHOLD = 0.20
IOU_THRESHOLD = 0.5

def validate_id_card_layout(image, model):
    """
    Validates an ID card layout from a loaded image object.

    Args:
        image (numpy.ndarray): The pre-loaded image from cv2.imread.
        model: The loaded YOLO model object.

    Returns:
        A dictionary of coordinates if successful, otherwise None.
    """
    print("\n--- 1. Starting Layout Validation ---")
    try:
        if image is None:
            print("Status: FAILED\nReason: Invalid image object received for layout validation.")
            return None
            
        # Pass the image object directly to the model for inference
        results = model(image, conf=CONFIDENCE_THRESHOLD, iou=IOU_THRESHOLD, verbose=False)
        result = results[0]
        class_names = model.names
    except Exception as e:
        print(f"Status: FAILED\nReason: An error occurred during model inference: {e}")
        return None

    # --- Gather all final detections ---
    detected_objects = {}
    for box in result.boxes:
        class_id = int(box.cls[0].item())
        class_name = class_names[class_id]
        confidence = box.conf[0].item()
        coords = box.xyxy[0].tolist()
        
        if class_name not in detected_objects or confidence > detected_objects[class_name]['confidence']:
             detected_objects[class_name] = {"coordinates": coords, "confidence": confidence}

    # --- Final Validation Logic ---
    if 'wrong_layout' in detected_objects:
        print("Status: FAILED\nReason: A 'wrong_layout' was detected on the ID card.")
        return None

    mandatory_fields = ['collegeName_with_logo', 'student_photo', 'student_name', 'student_roll_number']
    missing_fields = [field for field in mandatory_fields if field not in detected_objects]

    if not missing_fields:
        print("Status: SUCCESS\nReason: Layout is valid and all mandatory fields were found.")
        return {
            'student_photo': detected_objects['student_photo']['coordinates'],
            'student_name': detected_objects['student_name']['coordinates'],
            'student_roll_number': detected_objects['student_roll_number']['coordinates']
        }
    else:
        print(f"Status: FAILED\nReason: Mandatory fields are missing: {', '.join(missing_fields)}")
        return None