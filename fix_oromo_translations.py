def replace_om_block(file_path, new_block_content):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    start_idx = content.find('om: {')
    if start_idx == -1:
        print(f"om block not found in {file_path}")
        return

    # Find the closing brace of the om block
    end_idx = content.find('}', start_idx) + 1
    
    new_om_block = "om: {\n" + new_block_content + "\n  }"
    
    new_content = content[:start_idx] + new_om_block + content[end_idx:]
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"Updated {file_path}")

navbar_om = """    "home": "Fuula Duraa",
    "about": "Waa'ee Keenya",
    "gallery": "Kuusaa Suuraa",
    "mediaAndTech": "Miidiyaa fi Teeknooloojii",
    "classes": "Barnoota",
    "contact": "Quunnamtii",
    "login": "Seeni",
    "register": "Galmaa'i",
    "dashboard": "Daashboordii",
    "logout": "Bahi",
    "appName": "Amdehaymanot",
    "tagline": "Mana Barumsaa Sanbataa",
    "newsAndEvents": "Oduu fi Taateewwan",
    "adminPanel": "Kutaa Bulchaa",
    "menu": "Baafata\""""

footer_om = """    "churchName": "Kaatediraala Qulqulleettii Maariyaam",
    "churchLocation": "Jimmaa, Itoophiyaa",
    "stayConnected": "Odeeffannoo Guutuu Argadhaa",
    "newsletterPrompt": "Oduu fi taateewwan haaraa email keessaniin argadhaa.",
    "emailPlaceholder": "Email keessan galchaa",
    "motto": "Nuti garuu kadhachuu fi dubbicha tajaajiluuf ni carraaqna. — Hojii Ergamootaa 6:4",
    "explore": "Qo'adhaa",
    "support": "Deeggarsa",
    "getInTouch": "Nu Quunnamaa",
    "copyright": "Mirgi Qopheessaa Seeraan Kan Eegame",
    "home": "Fuula Duraa",
    "aboutUs": "Waa'ee Keenya",
    "events": "Taateewwan",
    "gallery": "Kuusaa Suuraa",
    "mediaAndTech": "Miidiyaa fi Teeknooloojii",
    "ourClasses": "Barnoota Keenya",
    "newsUpdates": "Oduu fi Odeeffannoo Haaraa",
    "contactUs": "Nu Quunnamaa"
"""

replace_om_block('src/components/layout/Navbar.js', navbar_om)
replace_om_block('src/components/layout/Footer.js', footer_om)
