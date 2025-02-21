import os
import logging
from together import Together

logger = logging.getLogger(__name__)
client = Together()

def generate_soap_note(transcript: str) -> str:
    """
    Generates a detailed SOAP note.
    """
    try:
        prompt = (
            f"Generate a detailed SOAP note from this doctor-patient conversation:\n\n"
            f"{transcript}\n\n"
            "Structure the note with clear sections: Subjective, Objective, Assessment, and Plan. "
            "Use medical terminology and maintain professional formatting. "
            "Do not mention fields whose information is not available. "
            "Sign the document with Henry Stevens, MD."
        )
        response = client.chat.completions.create(
            model="deepseek-ai/DeepSeek-R1-Distill-Llama-70B-free",  #we can use different model here
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
            max_tokens=1500
        )
        if not response.choices or not response.choices[0].message.content:
            logger.error("Empty SOAP note response")
            return "Error: Could not generate SOAP note"
        return response.choices[0].message.content.strip()
    except Exception as e:
        logger.error(f"SOAP note generation failed: {str(e)}")
        return f"Error: {str(e)}"

def generate_differential_diagnosis(transcript: str) -> str:
    """
    Generates a list of differential diagnoses.
    """
    try:
        prompt = (
            f"Based on this doctor-patient conversation:\n\n{transcript}\n\n"
            "Generate 3-5 differential diagnoses with:\n"
            "1. Most likely diagnosis with supporting evidence\n"
            "2. Plausible alternatives\n"
            "3. Less likely but important considerations\n"
            "4. Suggest some global medicines related to the diagnosis\n"
            "Format as a numbered list with brief rationales."
        )
        response = client.chat.completions.create(
            model="deepseek-ai/DeepSeek-R1-Distill-Llama-70B-free",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.4,
            max_tokens=1500
        )
        if not response.choices or not response.choices[0].message.content:
            logger.error("Empty differential diagnosis response")
            return "Error: Could not generate diagnoses"
        return response.choices[0].message.content.strip()
    except Exception as e:
        logger.error(f"Diagnosis generation failed: {str(e)}")
        return f"Error: {str(e)}"

def generate_doctor_response(conversation: str) -> str:
    """
    Generates a follow-up question from Dr. Steve based on the conversation so far.
    """
    try:
        prompt = (
            "You are Dr. Steve, a caring and methodical doctor engaged in a conversation with a patient. "
            "Based on the conversation below, ask a clarifying follow-up question to gather more details from the patient related to the problems described in the following conversation and that required to further breakdown their problem.\n\n"
            f"{conversation}\n\n"
            "Respond with only one follow-up question."
            "If you think that you have enough data in conversation then you may ask about previous physical examination results or previous diagnostic data."
            "And if you think that now no questions are needed to be asked then you may simply ask the patient to click on Finish conversation button."
        )
        response = client.chat.completions.create(
            model="deepseek-ai/DeepSeek-R1-Distill-Llama-70B-free",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
            max_tokens=1500
        )
        if not response.choices or not response.choices[0].message.content:
            logger.error("Empty doctor response")
            return "Error: Could not generate a response"
        return response.choices[0].message.content.strip()
    except Exception as e:
        logger.error(f"Doctor response generation failed: {str(e)}")
        return f"Error: {str(e)}"
