from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from fastapi.responses import JSONResponse
import uuid
import os
import tempfile
from app.services.transcription import transcribe_audio_file
from app.services.nlp_processing import (
    generate_soap_note,
    generate_differential_diagnosis,
    generate_doctor_response
)

router = APIRouter()

@router.post("/conversation_turn")
async def conversation_turn(
    file: UploadFile = File(...),
    conversation: str = Form("")
):
    """
    Accepts an audio file representing a patient turn along with the current conversation log.
    Returns the transcript of the patient's input and a generated doctor's follow-up question.
    """
    if not file:
        raise HTTPException(status_code=400, detail="No file uploaded")

    task_id = str(uuid.uuid4())
    temp_dir = tempfile.gettempdir()
    file_path = os.path.join(temp_dir, f"{task_id}.wav")

    try:
        with open(file_path, "wb") as f:
            f.write(await file.read())
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not save file: {str(e)}")

    try:
        # Transcribe the patient's audio turn
        patient_transcript = transcribe_audio_file(file_path)
        # Build the full conversation log string
        full_conversation = (conversation + "\n" if conversation else "") + "Patient: " + patient_transcript

        # Generate the doctor's follow-up question
        doctor_response = generate_doctor_response(full_conversation)
        
        os.remove(file_path)

        return JSONResponse(content={
            "transcript": patient_transcript,
            "doctor_response": doctor_response
        })
    except Exception as e:
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")

@router.post("/finalize_conversation")
async def finalize_conversation(conversation: dict):
    """
    Finalizes the conversation by generating a SOAP note and differential diagnosis
    based on the full conversation log.
    Expects a JSON body with a 'conversation' key.
    """
    conversation_text = conversation.get("conversation", "")
    if not conversation_text:
        raise HTTPException(status_code=400, detail="No conversation provided")

    try:
        soap_note = generate_soap_note(conversation_text)
        differential_diagnosis = generate_differential_diagnosis(conversation_text)

        return JSONResponse(content={
            "conversation": conversation_text,
            "soap_note": soap_note,
            "differential_diagnosis": differential_diagnosis
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Finalization failed: {str(e)}")
