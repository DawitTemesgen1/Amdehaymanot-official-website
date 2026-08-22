import os
import glob
import json

def extract_am_block(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    idx = content.find('  am: {')
    if idx == -1:
        idx = content.find(' am: {')
    if idx == -1:
        idx = content.find('am: {')
        
    if idx == -1:
        return None
        
    start_brace = content.find('{', idx)
    if start_brace == -1:
        return None
        
    brace_count = 0
    end_idx = -1
    for i in range(start_brace, len(content)):
        if content[i] == '{':
            brace_count += 1
        elif content[i] == '}':
            brace_count -= 1
            if brace_count == 0:
                end_idx = i
                break
                
    if end_idx == -1:
        return None
        
    am_content = content[start_brace:end_idx+1]
    
    # Try to parse it as JSON. Sometimes the keys might not be quoted, but let's see.
    # To be safe, we'll use a regex to ensure keys are quoted if it fails, or just use ast.literal_eval if it's python like.
    # Actually, Javascript objects aren't strict JSON, so we might need a custom parser or regex to convert it to JSON.
    return am_content

files_to_check = [
    "src/components/layout/Navbar.js",
    "src/components/layout/Footer.js",
    "src/pages/NewsAndEventsPage.js",
    "src/pages/ArticleDetailPage.js",
    "src/pages/GalleryPage.js",
    "src/pages/AlbumDetailPage.js",
    "src/pages/ClassesPage.js",
    "src/pages/ContactPage.js",
    "src/pages/LoginPage.js",
    "src/pages/RegisterPage.js",
    "src/pages/DashboardPage.js",
    "src/pages/CourseDetailPage.js",
    "src/pages/DownloadAppPage.js",
    "src/pages/EventDetailPage.js",
    "src/pages/MediaAndTechPage.js",
    "src/pages/AboutPage.js",
    "src/pages/HomePage.js"
]

all_am_texts = {}
for file_path in files_to_check:
    am_text = extract_am_block(file_path)
    if am_text:
        all_am_texts[file_path] = am_text

with open('source_am.json', 'w', encoding='utf-8') as f:
    json.dump(all_am_texts, f, ensure_ascii=False, indent=2)

print(f"Extracted {len(all_am_texts)} am blocks.")

