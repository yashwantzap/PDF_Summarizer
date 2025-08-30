import re
from sumy.parsers.plaintext import PlaintextParser
from sumy.nlp.tokenizers import Tokenizer
from sumy.summarizers.text_rank import TextRankSummarizer
from sklearn.feature_extraction.text import TfidfVectorizer
import numpy as np
from core.extractor import clean_text  # import if needed

def extract_keywords(text: str, min_tfidf=0.15):
    vectorizer = TfidfVectorizer(stop_words='english', min_df=1)
    X = vectorizer.fit_transform([text])
    feature_array = np.array(vectorizer.get_feature_names_out())
    tfidf_scores = X.toarray().flatten()
    keywords = set(feature_array[tfidf_scores > min_tfidf])
    return keywords

def summarize_text(text: str, min_sentence_count=5, max_sentence_count=15) -> str:
    text = clean_text(text)
    keywords = extract_keywords(text)

    parser = PlaintextParser.from_string(text, Tokenizer("english"))
    summarizer = TextRankSummarizer()
    sentences = list(parser.document.sentences)

    ranked_sentences = summarizer(parser.document, len(sentences))

    scored_sentences = []
    for idx, sent in enumerate(ranked_sentences):
        sent_text = str(sent)
        sent_text_lower = sent_text.lower()
        keyword_count = sum(sent_text_lower.count(kw.lower()) for kw in keywords)
        score = keyword_count * 2 + (1 / (idx + 1))
        scored_sentences.append((score, sent_text))

    scored_sentences.sort(key=lambda x: x[0], reverse=True)

    summary_sentences = []
    covered_keywords = set()

    for score, sentence in scored_sentences:
        sentence_keywords = set(
            kw for kw in keywords if kw.lower() in sentence.lower() and kw not in covered_keywords
        )
        if sentence_keywords or len(summary_sentences) < min_sentence_count:
            summary_sentences.append(sentence)
            covered_keywords.update(sentence_keywords)
        if len(summary_sentences) >= max_sentence_count or covered_keywords == keywords:
            break

    summary = ' '.join(summary_sentences)
    summary = re.sub(r'\s([?.!,"](?:\s|$))', r'\1', summary)
    return summary
