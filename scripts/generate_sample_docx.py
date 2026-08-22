import os
import zipfile

def create_simple_docx(file_path, title, paragraphs):
    document_xml = f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    <w:p>
      <w:pPr><w:pStyle w:val="Heading1"/></w:pPr>
      <w:r><w:t>{title}</w:t></w:r>
    </w:p>
"""
    for p in paragraphs:
        document_xml += f"""    <w:p>
      <w:r><w:t>{p}</w:t></w:r>
    </w:p>
"""
    document_xml += """  </w:body>
</w:document>"""

    content_types = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>"""

    rels = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>"""

    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    with zipfile.ZipFile(file_path, 'w', zipfile.ZIP_DEFLATED) as z:
        z.writestr('[Content_Types].xml', content_types)
        z.writestr('_rels/.rels', rels)
        z.writestr('word/document.xml', document_xml)
    print(f"Created docx: {file_path}")

# Generate Day 1 sample files
day1_dir = os.path.join('src', 'content', 'day-1')

create_simple_docx(
    os.path.join(day1_dir, 'transcript-1.docx'),
    "Transcript 1: Azure AI Search Architecture & Vector Indexing",
    [
        "Welcome to today's lecture on Azure AI Search.",
        "We are exploring hybrid search algorithms combining keyword BM25 scoring with dense vector embeddings.",
        "Key concept: HNSW (Hierarchical Navigable Small World) graphs enable fast approximate nearest neighbor search at scale."
    ]
)

create_simple_docx(
    os.path.join(day1_dir, 'transcript-2.docx'),
    "Transcript 2: Azure OpenAI Service Integration",
    [
        "In this session, we cover provisioned throughput and RAG architecture.",
        "Using enterprise vector search with GPT-4 allows grounding answers in verified internal documents.",
        "Safety and content filtering policies ensure compliance with enterprise governance standard operating procedures."
    ]
)

create_simple_docx(
    os.path.join(day1_dir, 'summary.docx'),
    "Day 1 Executive Overview - Azure AI Apps & Agents",
    [
        "Today's core objective was establishing architectural patterns for enterprise Retrieval-Augmented Generation (RAG).",
        "Key Takeaways:",
        "1. Hybrid Retrieval yields higher precision than vector-only or keyword-only search.",
        "2. Semantic Reranking reduces hallucination by re-ordering top-k chunks based on deep neural cross-encoders.",
        "3. Chunking Strategies: Maintain semantic sentence boundaries and 15-20% overlap between sliding text windows."
    ]
)

links_txt = """Microsoft AI-103 Certification Overview | https://learn.microsoft.com | Official study guide and learning path for AI-103
Azure AI Search Documentation | https://learn.microsoft.com/azure/search | Comprehensive API reference for vector search and hybrid retrieval
Azure OpenAI Service Quickstart | https://learn.microsoft.com/azure/openai | Getting started guide for GPT-4 and embeddings deployment
"""

with open(os.path.join(day1_dir, 'links.txt'), 'w', encoding='utf-8') as f:
    f.write(links_txt)
print("Created links.txt for Day 1")
