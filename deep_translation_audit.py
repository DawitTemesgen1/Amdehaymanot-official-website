import os
import re

def get_files():
    for root, _, files in os.walk('src'):
        for f in files:
            if f.endswith('.js'):
                yield os.path.join(root, f)

ethiopic_pattern = re.compile(r'[\u1200-\u137F]')

def audit():
    issues = []
    for filepath in get_files():
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        # Check for Wiixata
        if 'Wiixata' in content:
            # We know "Wiixata hanga Sanbata Duraatti" is fine (Monday to Saturday)
            # Let's see if there are other occurrences
            matches = re.findall(r'.{0,30}Wiixata.{0,30}', content)
            for m in matches:
                if "Wiixata hanga Sanbata Duraatti" not in m and "Wiixata Faasikaa" not in m and "Dilbataa fi Wiixata" not in m:
                    issues.append(f"{filepath} has suspicious 'Wiixata': {m.strip()}")

        # Check for appName
        appname_matches = re.findall(r'"appName"\s*:\s*"(.*?)"', content)
        for m in appname_matches:
            if m not in ['Amdehaymanot', 'ዓምደሃይማኖት', 'آمدهيمانوت']:
                issues.append(f"{filepath} has bad appName: {m}")

        # Check for Ethiopic chars in non-Ethiopic blocks
        for lang in ['en', 'om', 'es', 'fr', 'ar']:
            # Find lang block
            lang_blocks = re.finditer(fr'\b{lang}\s*:\s*{{', content)
            for match in lang_blocks:
                start_idx = match.end()
                # find matching closing brace
                brace_count = 1
                curr = start_idx
                while brace_count > 0 and curr < len(content):
                    if content[curr] == '{':
                        brace_count += 1
                    elif content[curr] == '}':
                        brace_count -= 1
                    curr += 1
                
                block_content = content[start_idx:curr]
                if ethiopic_pattern.search(block_content):
                    # extract the line
                    lines_with_ethiopic = [line for line in block_content.split('\n') if ethiopic_pattern.search(line)]
                    issues.append(f"{filepath} has Ethiopic characters in '{lang}' block: {lines_with_ethiopic[0].strip()}")

    for issue in issues:
        print(issue)
    
    if not issues:
        print("Audit completely clean!")

if __name__ == '__main__':
    audit()
