import os
import requests

def transcribe_audio_file(audio_file_path: str) -> str:
    """
    Transcribes the given audio file using DeepGram API.
    """
    deepgram_api_key = os.environ.get("DEEPGRAM_API_KEY")
    if not deepgram_api_key:
        raise Exception("DEEPGRAM_API_KEY is not set.")

    headers = {
        "Authorization": f"Token {deepgram_api_key}",
        "Content-Type": "audio/wav"
    }

    with open(audio_file_path, "rb") as audio_file:
        audio_data = audio_file.read()

    response = requests.post(
        "https://api.deepgram.com/v1/listen",
        headers=headers,
        data=audio_data
    )

    if response.status_code != 200:
        raise Exception(f"DeepGram API error: {response.status_code}, {response.text}")

    json_response = response.json()
    transcript = json_response.get("results", {}) \
                              .get("channels", [{}])[0] \
                              .get("alternatives", [{}])[0] \
                              .get("transcript", "")
    return transcript
