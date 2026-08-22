import re
def fix_lang_block(filepath, lang, old_str, new_str):
    with open(filepath, 'r', encoding='utf-8') as f:
        file_content = f.read()
        
    lang_blocks = re.finditer(fr'\b{lang}\s*:\s*{{', file_content)
    for match in lang_blocks:
        start_idx = match.end()
        brace_count = 1
        curr = start_idx
        while brace_count > 0 and curr < len(file_content):
            if file_content[curr] == '{': brace_count += 1
            elif file_content[curr] == '}': brace_count -= 1
            curr += 1
            
        block = file_content[start_idx:curr]
        if old_str in block:
            new_block = block.replace(old_str, new_str)
            file_content = file_content[:start_idx] + new_block + file_content[curr:]
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(file_content)
            print(f"Fixed {old_str} in {lang} block of {filepath}")
            break

fix_lang_block('src/pages/GalleryPage.js', 'ar', '"ctaTitle": "ከታሪኩ አካል ይሁኑ"', '"ctaTitle": "كن جزءاً من القصة"')
