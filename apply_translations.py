import json
import re

with open('translated_all.json', 'r', encoding='utf-8') as f:
    translated_all = json.load(f)

# The javascript files export or define a `translations` object like:
# const translations = {
#   en: { ... },
#   am: { ... },
#   om: { ... },
#   ...
# }
# Since we translated all languages, we should replace the whole translations block.
# However, the structure in files is slightly different.
# Most files define languages one by one.

def replace_translations_in_file(file_path, file_translations):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find where the `am: {` block is.
    am_idx = content.find('  am: {')
    if am_idx == -1:
        am_idx = content.find(' am: {')
    if am_idx == -1:
        am_idx = content.find('am: {')
        
    if am_idx == -1:
        print(f"Could not find am: in {file_path}")
        return
        
    # Find the start of the entire `translations` or `const translations = {` block
    # It usually starts with `const translations = {` or something similar.
    # We can just look for the first '{' before `am:` going backwards, but it might just be the object start.
    # A safer way is to find the bounds of each language block and replace them individually, or replace the whole `translations = { ... }` block.
    
    # We know the keys: en, am, om, ti, ge, es, fr, ar
    # Let's replace each language block individually if it exists, or insert it.
    
    # Actually, replacing the whole block is safer if we know where it starts and ends.
    # We can use regex to find `const translations = { ... }` but some files might just pass the object directly.
    # Let's replace the whole file content? No.
    
    # Let's build the new translations block string
    new_block = "const translations = {\n"
    for lang, trans_obj in file_translations.items():
        # JSON stringify but remove quotes around keys to match JS style (optional, JSON is valid JS)
        trans_str = json.dumps(trans_obj, ensure_ascii=False, indent=4)
        new_block += f"  {lang}: {trans_str},\n"
    new_block += "};\n"
    
    # Find the `const translations = {` in the file
    match = re.search(r'const\s+translations\s*=\s*\{', content)
    if not match:
        print(f"Could not find const translations = in {file_path}")
        return
        
    start_idx = match.start()
    
    # Find the matching closing brace for `const translations = {`
    start_brace = content.find('{', start_idx)
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
        print(f"Could not find end of translations block in {file_path}")
        return
        
    # Replace
    new_content = content[:start_idx] + new_block.strip() + content[end_idx+1:]
    
    # Handle some files like Navbar where it might be `translations = {` inside the component? No, usually outside.
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
        
for file_path, file_translations in translated_all.items():
    print(f"Updating {file_path}")
    replace_translations_in_file(file_path, file_translations)

print("Applied all translations.")
