import json
import re
import chompjs
from deep_translator import GoogleTranslator
import time

with open('src/pages/MediaAndTechPage.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the translations block
match = re.search(r'const\s+translations\s*=\s*\{', content)
if not match:
    print("Could not find translations block")
    exit(1)

start_idx = match.start()
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
    print("Could not find end of translations block")
    exit(1)

translations_str = content[start_brace:end_idx+1]
translations = chompjs.parse_js_object(translations_str)

new_am = {
    "tag": "የቴሌግራም ቦት",
    "title": "የተማሪዎች ድጋፍ ቦት",
    "text": "መንፈሳዊ ትምህርትዎን በማንኛውም ጊዜ እና ቦታ ያዳብሩ። ይህ ልዩ የቴሌግራም ቦት ለሰንበት ትምህርት ቤት ተማሪዎች በሀገር አቀፍ ደረጃ የሚሰጠውን ሥርዓተ ትምህርት መጻሕፍት፣ አጋዥ የፒዲኤፍ (PDF) መጻሕፍት፣ እንዲሁም ከ100 በላይ የሙከራ ጥያቄዎችን ከመልሳቸው ጋር በቀላሉ እንዲያገኙ ያስችላል። ይህም በኦርቶዶክሳዊ እምነትዎ እንዲጸኑ እና ለፈተናዎች በተሻለ ሁኔታ እንዲዘጋጁ ይረዳዎታል።"
}
openBot_am = "በቴሌግራም ይክፈቱ"

langs = list(translations.keys())

for lang in langs:
    print(f"Translating for {lang}...")
    if lang == 'am' or lang == 'ge':
        translations[lang]['telegramBot'] = new_am
        translations[lang]['openBot'] = openBot_am
    else:
        try:
            translations[lang]['telegramBot'] = {
                "tag": GoogleTranslator(source='am', target=lang).translate(new_am['tag']),
                "title": GoogleTranslator(source='am', target=lang).translate(new_am['title']),
                "text": GoogleTranslator(source='am', target=lang).translate(new_am['text'])
            }
            translations[lang]['openBot'] = GoogleTranslator(source='am', target=lang).translate(openBot_am)
        except Exception as e:
            print(f"Error translating for {lang}: {e}")
            translations[lang]['telegramBot'] = new_am
            translations[lang]['openBot'] = openBot_am
    time.sleep(1)

# Format back to JS
new_translations_str = json.dumps(translations, ensure_ascii=False, indent=2)
# Need to replace the block
new_content = content[:start_brace] + new_translations_str + content[end_idx+1:]

with open('src/pages/MediaAndTechPage.js', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Translations updated!")
