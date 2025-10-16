# import os
# import cv2
# import base64
# import uuid
# import asyncio
# import json
# from contextlib import asynccontextmanager
# from fastapi import FastAPI, HTTPException
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel
# from sse_starlette.sse import EventSourceResponse

# # --- YOUR EXISTING ML LOGIC ---
# from ultralytics import YOLO
# from deepface import DeepFace
# from test_layout_model import validate_id_card_layout
# from face_matcher import match_faces
# from ocr_validator import validate_text_fields

# # Define paths and models
# YOLO_MODEL_PATH = './best.pt'
# validator_instance = None

# class IDValidator:
#     def __init__(self, yolo_model_path):
#         print("Initializing validator... This may take a moment.")
#         try:
#             self.yolo_model = YOLO(yolo_model_path)
#             print("YOLO model loaded.")
#             DeepFace.build_model("SFace")
#             print("DeepFace model loaded and ready.")
#         except Exception as e:
#             print(f"FATAL: Could not initialize models. Error: {e}")
#             self.yolo_model = None
#         print("Initialization complete. Validator is ready.")

# # --- LIFESPAN MANAGER FOR FASTAPI ---
# # This special function loads the ML models only ONCE when the server starts.
# @asynccontextmanager
# async def lifespan(app: FastAPI):
#     global validator_instance
#     print("Server starting up...")
#     validator_instance = IDValidator(yolo_model_path=YOLO_MODEL_PATH)
#     yield
#     print("Server shutting down...")

# # --- FASTAPI APP SETUP ---
# app = FastAPI(lifespan=lifespan)

# origins = ["http://localhost:5173", "http://127.0.0.1:5173"]
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=origins,
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# class VerificationRequest(BaseModel):
#     id_card: str
#     selfie: str

# tasks = {}

# # --- NEW BACKGROUND TASK FUNCTION ---
# # This function wraps your validation logic and streams progress updates.
# async def run_validation_with_streaming(task_id: str, id_path: str, selfie_path: str):
#     global validator_instance
#     if not validator_instance or not validator_instance.yolo_model:
#         tasks[task_id] = {"status": "failed", "step": "init", "message": "Validation models are not loaded on the server."}
#         return

#     try:
#         id_card_image = cv2.imread(id_path)
#         if id_card_image is None:
#             raise ValueError("Server could not read the uploaded ID card image.")

#         # --- STEP 1: LAYOUT VALIDATION ---
#         tasks[task_id] = {"status": "processing", "step": "layout", "message": "Validating ID card template..."}
#         layout_coords = validate_id_card_layout(id_card_image, validator_instance.yolo_model)
#         if not layout_coords:
#             raise ValueError("Layout Validation Failed: Required fields not detected.")

#         # --- STEP 2: FACE MATCHING ---
#         tasks[task_id] = {"status": "processing", "step": "face", "message": "Performing facial recognition..."}
#         await asyncio.sleep(1) # Add a small delay for the UI to feel smooth
#         faces_match = match_faces(
#             selfie_path=selfie_path,
#             id_card_path=id_path,
#             id_photo_coords=layout_coords['student_photo']
#         )
#         if not faces_match:
#             raise ValueError("Face Recognition Failed: Faces do not match.")

#         # --- STEP 3: OCR FIELD VALIDATION ---
#         tasks[task_id] = {"status": "processing", "step": "field", "message": "Verifying text fields via OCR..."}
#         await asyncio.sleep(1) # Add a small delay
#         fields_are_valid = validate_text_fields(
#             id_card_img=id_card_image,
#             student_name_coords=layout_coords['student_name'],
#             roll_number_coords=layout_coords['student_roll_number']
#         )
#         if not fields_are_valid:
#             raise ValueError("Field Validation Failed: Text is invalid or unreadable.")
            
#         # --- FINAL SUCCESS ---
#         tasks[task_id] = {"status": "processing", "step": "grant", "message": "All checks passed. Granting access."}
#         await asyncio.sleep(1)
#         tasks[task_id] = {"status": "success", "step": "done", "message": "Verification Successful: Access Granted."}

#     except Exception as e:
#         current_step = tasks.get(task_id, {}).get("step", "unknown")
#         tasks[task_id] = {"status": "failed", "step": current_step, "message": str(e)}
#         print(f"Validation failed at step {current_step}: {e}")

#     finally:
#         if os.path.exists(id_path): os.remove(id_path)
#         if os.path.exists(selfie_path): os.remove(selfie_path)

# # --- API ENDPOINTS ---
# @app.post("/verify")
# async def start_verification(request: VerificationRequest):
#     task_id = str(uuid.uuid4())
#     os.makedirs("testData", exist_ok=True)
#     try:
#         id_data = base64.b64decode(request.id_card.split(',')[1])
#         id_path = f"testData/{task_id}_id.jpg"
#         with open(id_path, "wb") as f: f.write(id_data)
            
#         selfie_data = base64.b64decode(request.selfie.split(',')[1])
#         selfie_path = f"testData/{task_id}_selfie.jpg"
#         with open(selfie_path, "wb") as f: f.write(selfie_data)
#     except Exception as e:
#         raise HTTPException(status_code=400, detail=f"Invalid image data: {e}")

#     asyncio.create_task(run_validation_with_streaming(task_id, id_path, selfie_path))
#     return {"task_id": task_id}

# @app.get("/verify/stream/{task_id}")
# async def stream_verification(task_id: str):
#     async def event_generator():
#         last_status = None
#         while True:
#             if task_id in tasks:
#                 current_status = tasks[task_id]
#                 if current_status != last_status:
#                     yield json.dumps(current_status)
#                     last_status = current_status
#                     if current_status["status"] in ["success", "failed"]:
#                         break
#             await asyncio.sleep(0.5)
#     return EventSourceResponse(event_generator())
# main.py

import os
import cv2
import base64
import uuid
import asyncio
import json
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sse_starlette.sse import EventSourceResponse

# --- YOUR EXISTING ML LOGIC ---
from ultralytics import YOLO
from deepface import DeepFace
from test_layout_model import validate_id_card_layout
from face_matcher import match_faces
from ocr_validator import validate_text_fields

# Define paths and models
YOLO_MODEL_PATH = './best.pt'
validator_instance = None

class IDValidator:
    def __init__(self, yolo_model_path):
        print("Initializing validator... This may take a moment.")
        try:
            self.yolo_model = YOLO(yolo_model_path)
            print("YOLO model loaded.")
            # Ensure ArcFace is built if it's your primary model
            DeepFace.build_model("ArcFace")
            print("DeepFace model loaded and ready.")
        except Exception as e:
            print(f"FATAL: Could not initialize models. Error: {e}")
            self.yolo_model = None
        print("Initialization complete. Validator is ready.")

# --- LIFESPAN MANAGER FOR FASTAPI ---
@asynccontextmanager
async def lifespan(app: FastAPI):
    global validator_instance
    print("Server starting up...")
    validator_instance = IDValidator(yolo_model_path=YOLO_MODEL_PATH)
    yield
    print("Server shutting down...")

# --- FASTAPI APP SETUP ---
app = FastAPI(lifespan=lifespan)

origins = ["http://localhost:5173", "http://127.0.0.1:5173"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class VerificationRequest(BaseModel):
    id_card: str
    selfie: str

tasks = {}

# --- NEW BACKGROUND TASK FUNCTION ---
async def run_validation_with_streaming(task_id: str, id_path: str, selfie_path: str):
    global validator_instance
    if not validator_instance or not validator_instance.yolo_model:
        tasks[task_id] = {"status": "failed", "step": "init", "message": "Validation models are not loaded on the server."}
        return

    try:
        id_card_image = cv2.imread(id_path)
        if id_card_image is None:
            raise ValueError("Server could not read the uploaded ID card image.")

        # --- STEP 1: LAYOUT VALIDATION ---
        tasks[task_id] = {"status": "processing", "step": "layout", "message": "Validating ID card template..."}
        layout_coords = validate_id_card_layout(id_card_image, validator_instance.yolo_model)
        if not layout_coords:
            raise ValueError("Layout Validation Failed: Required fields not detected.")

        # --- STEP 2: FACE MATCHING ---
        tasks[task_id] = {"status": "processing", "step": "face", "message": "Performing facial recognition..."}
        await asyncio.sleep(1)
        faces_match = match_faces(
            selfie_path=selfie_path,
            id_card_path=id_path,
            id_photo_coords=layout_coords['student_photo']
        )
        if not faces_match:
            raise ValueError("Face Recognition Failed: Faces do not match.")

        # --- STEP 3: OCR FIELD VALIDATION ---
        tasks[task_id] = {"status": "processing", "step": "field", "message": "Verifying text fields via OCR..."}
        await asyncio.sleep(1)
        
        # MODIFIED LINE: Unpack the result and the name
        fields_are_valid, student_name = validate_text_fields(
            id_card_img=id_card_image,
            student_name_coords=layout_coords['student_name'],
            roll_number_coords=layout_coords['student_roll_number']
        )
        if not fields_are_valid:
            raise ValueError("Field Validation Failed: Text is invalid or unreadable.")
            
        # --- FINAL SUCCESS (MODIFIED MESSAGES) ---
        tasks[task_id] = {"status": "processing", "step": "grant", "message": f"All checks passed. Granting access to {student_name}."}
        await asyncio.sleep(1)
        tasks[task_id] = {"status": "success", "step": "done", "message": f"Verification Successful: Access Granted for {student_name}."}

    except Exception as e:
        current_step = tasks.get(task_id, {}).get("step", "unknown")
        tasks[task_id] = {"status": "failed", "step": current_step, "message": str(e)}
        print(f"Validation failed at step {current_step}: {e}")

    finally:
        if os.path.exists(id_path): os.remove(id_path)
        if os.path.exists(selfie_path): os.remove(selfie_path)

# --- API ENDPOINTS ---
@app.post("/verify")
async def start_verification(request: VerificationRequest):
    task_id = str(uuid.uuid4())
    os.makedirs("testData", exist_ok=True)
    try:
        id_data = base64.b64decode(request.id_card.split(',')[1])
        id_path = f"testData/{task_id}_id.jpg"
        with open(id_path, "wb") as f: f.write(id_data)
            
        selfie_data = base64.b64decode(request.selfie.split(',')[1])
        selfie_path = f"testData/{task_id}_selfie.jpg"
        with open(selfie_path, "wb") as f: f.write(selfie_data)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid image data: {e}")

    asyncio.create_task(run_validation_with_streaming(task_id, id_path, selfie_path))
    return {"task_id": task_id}

@app.get("/verify/stream/{task_id}")
async def stream_verification(task_id: str):
    async def event_generator():
        last_status = None
        while True:
            if task_id in tasks:
                current_status = tasks[task_id]
                if current_status != last_status:
                    yield json.dumps(current_status)
                    last_status = current_status
                    if current_status["status"] in ["success", "failed"]:
                        break
            await asyncio.sleep(0.5)
    return EventSourceResponse(event_generator())

