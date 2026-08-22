with open('src/components/layout/Navbar.js', 'r', encoding='utf-8') as f:
    content = f.read()

# We need to find the 'ar' block in Navbar.js
import re

start_idx = content.find('ar: {')
if start_idx != -1:
    end_idx = content.find('}', start_idx)
    ar_block = content[start_idx:end_idx]
    
    # Replace Amdehaymanot with آمدهيمانوت in the ar block
    new_ar_block = ar_block.replace('"appName": "Amdehaymanot"', '"appName": "آمدهيمانوت"')
    
    new_content = content[:start_idx] + new_ar_block + content[end_idx:]
    with open('src/components/layout/Navbar.js', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Updated Arabic appName")
else:
    print("Could not find 'ar' block")

