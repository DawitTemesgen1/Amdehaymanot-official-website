import re

filepath = 'src/pages/MediaAndTechPage.js'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Strategy: for each language block, find the "services": [...] array and replace its "key" and "icon" values.
def process_services_array(match):
    services_text = match.group(0)
    
    # Extract all keys and icons
    keys = re.findall(r'"key"\s*:\s*"([^"]+)"', services_text)
    icons = re.findall(r'"icon"\s*:\s*"([^"]+)"', services_text)
    
    # We expect 4 of each.
    if len(keys) == 4 and len(icons) == 4:
        expected = ['imaging', 'video', 'social', 'tech']
        
        for i in range(4):
            # Replace the old key with the expected key, but only the first occurrence for each match to be safe.
            # Actually, doing it sequentially is better:
            pass
        
        # A simpler sequential replacement:
        new_services_text = services_text
        for old, new_val in zip(keys, expected):
            # regex replace the value of key
            new_services_text = new_services_text.replace(f'"key": "{old}"', f'"key": "{new_val}"', 1)
        for old, new_val in zip(icons, expected):
            new_services_text = new_services_text.replace(f'"icon": "{old}"', f'"icon": "{new_val}"', 1)
            
        return new_services_text
        
    return services_text

new_content = re.sub(r'"services"\s*:\s*\[\s*{.*?}\s*\]', process_services_array, content, flags=re.DOTALL)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(new_content)
    
print("Fixed MediaAndTechPage keys and icons!")
