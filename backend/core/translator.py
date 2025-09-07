from google.cloud import translate_v2 as translate

client = translate.Client()

def translate_to_english(text: str) -> str:
    """
    Translate input text to English using Google Cloud Translation API.
    Falls back to original text on failure.
    """
    if not text.strip():
        return text

    try:
        result = client.translate(text, target_language='en')
        return result['translatedText']
    except Exception as e:
        print(f"Google Translation API error: {e}")
        return text
