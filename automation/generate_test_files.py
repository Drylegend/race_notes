"""
Generate sample .docx test files for dry-run testing of the automation pipeline.
Creates 4 transcript files + 1 summary file in automation/test_files/.

Run:  python automation/generate_test_files.py
"""

import os
import sys
import zipfile

# Force UTF-8 output on Windows
if sys.stdout.encoding != "utf-8":
    sys.stdout.reconfigure(encoding="utf-8")

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "test_files")


def create_simple_docx(file_path: str, title: str, paragraphs: list[str]) -> None:
    """Create a minimal valid .docx file (Office Open XML zip)."""
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
    with zipfile.ZipFile(file_path, "w", zipfile.ZIP_DEFLATED) as z:
        z.writestr("[Content_Types].xml", content_types)
        z.writestr("_rels/.rels", rels)
        z.writestr("word/document.xml", document_xml)
    print(f"  [OK] Created: {file_path}")


def main() -> None:
    print(f"\nGenerating test .docx files in: {OUTPUT_DIR}\n")

    # 4 test transcripts
    for i in range(1, 5):
        create_simple_docx(
            os.path.join(OUTPUT_DIR, f"test_transcript_{i}.docx"),
            f"Test Transcript {i} - Sample Lecture Content",
            [
                f"This is paragraph 1 of test transcript {i}.",
                f"Covering topic area {i}: Azure AI services and cloud architecture.",
                f"End of test transcript {i} content.",
            ],
        )

    # 1 test summary
    create_simple_docx(
        os.path.join(OUTPUT_DIR, "test_summary.docx"),
        "Test Summary - Day Overview",
        [
            "This is a test summary document for pipeline validation.",
            "Key takeaways: All systems nominal.",
            "End of test summary content.",
        ],
    )

    print(f"\n[DONE] {len(os.listdir(OUTPUT_DIR))} test files ready.")
    print(f"   Location: {os.path.abspath(OUTPUT_DIR)}")
    print("   Use these when the file dialogs open during --dry-run.\n")


if __name__ == "__main__":
    main()

