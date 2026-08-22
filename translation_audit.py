import os
import re

def get_files():
    for root, _, files in os.walk('src'):
        for f in files:
            if f.endswith('.js'):
                yield os.path.join(root, f)

ethiopian_regex = re.compile(r'[\u1200-\u137F]+')

def audit():
    for filepath in get_files():
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        # Check for Wiixata
        if 'Wiixata' in content:
            print(f"{filepath} has 'Wiixata' (Monday translation error)")

        # Check for appName
        appname_matches = re.findall(r'"appName"\s*:\s*"(.*?)"', content)
        if appname_matches:
            bad_appnames = [m for m in appname_matches if m not in ['Amdehaymanot', 'ዓምደሃይማኖት', 'آمدهيمانوت']]
            if bad_appnames:
                print(f"{filepath} has bad appNames: {bad_appnames}")

        # Check for Ethiopic text in non-Ethiopic languages
        # We need to parse the dictionary, but it's hard with regex. 
        # A simpler way is to find blocks "en: {", "om: {", "es: {", "fr: {", "ar: {" 
        # and check if they contain Ethiopic characters.
        for lang in ['en', 'om', 'es', 'fr', 'ar']:
            block_start = content.find(f'{lang}: {{')
            if block_start != -1:
                # heuristic: find the end by looking for the next language or '};'
                end_idx = len(content)
                for next_lang in ['en:', 'om:', 'ti:', 'es:', 'fr:', 'ar:', 'am:', 'ge:', '};']:
                    if next_lang == f'{lang}:': continue
                    idx = content.find(next_lang, block_start + 10)
                    if idx != -1 and idx < end_idx:
                        end_idx = idx
                
                lang_content = content[block_start:end_idx]
                if lang == 'ar':
                    # Arabic might have Arabic characters, but Ethiopic characters shouldn't be there
                    pass
                ethiopic_matches = ethiopian_regex.findall(lang_content)
                if ethiopic_matches:
                    print(f"{filepath} has Ethiopic characters in '{lang}' block! e.g., {ethiopic_matches[:3]}")

if __name__ == '__main__':
    audit()
