"""
Preprocessing Module for HERE Support ML Engine
Handles text normalization, cleaning, and tokenization.
"""

import re

def clean_text(text: str) -> str:
    """
    Cleans raw student text by removing URLs, unusual symbols,
    collapsing multiple spaces, and converting to lowercase.
    """
    if not isinstance(text, str):
        return ""
    
    # Lowercase
    text = text.lower().strip()
    
    # Remove URLs
    text = re.sub(r'https?://\S+|www\.\S+', '', text)
    
    # Remove punctuation except internal hyphens / apostrophes
    text = re.sub(r"[^\w\s'-]", ' ', text)
    
    # Collapse whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    
    return text

if __name__ == "__main__":
    sample = "I've got 2 exams next week... can't sleep!! https://example.edu"
    print("Cleaned:", clean_text(sample))
