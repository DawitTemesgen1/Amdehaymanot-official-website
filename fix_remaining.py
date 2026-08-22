with open('src/pages/GalleryPage.js', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('"emptyTitle": "ምንም አልበም አልተገኘም"', '"emptyTitle": "Albamii hin argamne"') # For Oromo block, although this replace is naive, it might replace others.
# Actually, I should use block replacement.
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

fix_lang_block('src/pages/GalleryPage.js', 'om', '"emptyTitle": "ምንም አልበም አልተገኘም"', '"emptyTitle": "Albamii hin argamne"')
fix_lang_block('src/pages/GalleryPage.js', 'fr', '"appName": "ዓምደሃይማኖት"', '"appName": "Amdehaymanot"')
fix_lang_block('src/pages/GalleryPage.js', 'fr', '"all": "ሁሉም ምድቦች"', '"all": "Toutes les catégories"')
fix_lang_block('src/pages/GalleryPage.js', 'ar', '"pageTitle": "የፎቶ ማዕከለ-ስዕላት"', '"pageTitle": "معرض الصور"')
fix_lang_block('src/pages/AlbumDetailPage.js', 'en', '"appName": "ዓምደሃይማኖት"', '"appName": "Amdehaymanot"')
fix_lang_block('src/pages/AlbumDetailPage.js', 'es', '"likeTooltip": "ይውደዱ"', '"likeTooltip": "Me gusta"')

