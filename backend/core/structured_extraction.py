import re

def extract_case_number(text):
    patterns = [
        r'Case No[:\s]*([A-Za-z0-9\-\/]+)',
        r'Case Number[:\s]*([A-Za-z0-9\-\/]+)'
    ]
    for pattern in patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            return match.group(1).strip()
    return None

def extract_client_name(text):
    patterns = [
        r'Client Name[:\s]*([A-Za-z\s]+)',
        r'Petitioner[:\s]*([A-Za-z\s]+)',
        r'Respondent[:\s]*([A-Za-z\s]+)'
    ]
    for pattern in patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            return match.group(1).strip()
    return None

def extract_court_date(text):
    patterns = [
        r'(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})',
        r'(January|February|March|April|May|June|July|August|September|October|November|December) \d{1,2}, \d{4}'
    ]
    for pattern in patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            return match.group(1).strip()
    return None

def extract_legal_sections(text):
    pattern = r'(Section\s*\d+[A-Za-z]*\s*(IPC|CrPC)?)'
    matches = re.findall(pattern, text, re.IGNORECASE)
    return list(set([' '.join(m).strip() for m in matches])) if matches else []

def extract_structured_data(text):
    return {
        "case_number": extract_case_number(text),
        "client_name": extract_client_name(text),
        "court_date": extract_court_date(text),
        "legal_sections": extract_legal_sections(text)
    }
