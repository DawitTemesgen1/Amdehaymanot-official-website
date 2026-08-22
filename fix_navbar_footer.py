import re

def replace_ge_block(file_path, new_block_content):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    start_idx = content.find('ge: {')
    if start_idx == -1:
        print(f"ge block not found in {file_path}")
        return

    # Find the closing brace of the ge block
    end_idx = content.find('}', start_idx) + 1
    
    new_ge_block = "ge: {\n" + new_block_content + "\n  }"
    
    new_content = content[:start_idx] + new_ge_block + content[end_idx:]
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"Updated {file_path}")

navbar_ge = """    "home": "መባእታ",
    "about": "በእንቲአነ",
    "gallery": "ሥዕላት",
    "mediaAndTech": "ሚድያ ወቴክኖሎጂ",
    "classes": "ትምህርት",
    "contact": "ርከቡነ",
    "login": "ባኡ",
    "register": "ተመዝገቡ",
    "dashboard": "ዳሽቦርድ",
    "logout": "ፃእ",
    "appName": "ዓምደሃይማኖት",
    "tagline": "ቤተ ትምህርት ሰንበት",
    "newsAndEvents": "ዜና ወክንውናት",
    "adminPanel": "መኰንን",
    "menu": "ማዕድ\""""

footer_ge = """    "churchName": "ካቴድራል ቅድስት ማርያም",
    "churchLocation": "ጅማ, ኢትዮጵያ",
    "stayConnected": "ርከቡ ምሉእ ሐበሬታ",
    "newsletterPrompt": "ርከቡ ሐዲሰ ዜና ወክንውናተ በኢሜልክሙ።",
    "emailPlaceholder": "አእትዉ ኢሜል",
    "motto": "ወንሕነሰ ንተግህ ለጸሎት ወለአገልግሎተ ቃል ። — ግብረ ሐዋርያት ፮፡፬",
    "explore": "ኅሡ",
    "support": "ረድኤት",
    "getInTouch": "ርከቡነ",
    "copyright": "ኵሉ ብሕትውና ዝዑቅ ውእቱ",
    "home": "መባእታ",
    "aboutUs": "በእንቲአነ",
    "events": "ክንውናት",
    "gallery": "ሥዕላት",
    "mediaAndTech": "ሚድያ ወቴክኖሎጂ",
    "ourClasses": "ትምህርትነ",
    "newsUpdates": "ዜና ወእድሳት",
    "contactUs": "ርከቡነ"
"""

replace_ge_block('src/components/layout/Navbar.js', navbar_ge)
replace_ge_block('src/components/layout/Footer.js', footer_ge)
