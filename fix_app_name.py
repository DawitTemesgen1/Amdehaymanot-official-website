import re

with open('src/components/layout/Navbar.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Replacements
replacements = {
    '"appName": "Religion"': '"appName": "Amdehaymanot"',
    '"appName": "Amantaa"': '"appName": "Amdehaymanot"',
    '"appName": "ሃይማኖት"': '"appName": "ዓምደሃይማኖት"',
    '"appName": "Religión"': '"appName": "Amdehaymanot"',
    '"appName": "دِين"': '"appName": "Amdehaymanot"',
}

for old, new in replacements.items():
    content = content.replace(old, new)

with open('src/components/layout/Navbar.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated appName translations.")
