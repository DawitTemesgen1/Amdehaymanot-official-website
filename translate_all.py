import json
import chompjs
from deep_translator import GoogleTranslator
import time

with open('source_am.json', 'r', encoding='utf-8') as f:
    source_am = json.load(f)

langs = ['en', 'om', 'ti', 'es', 'fr', 'ar', 'am'] 
# Note: google translate doesn't support 'ge' (Geez). We'll handle 'ge' manually or copy 'am' for 'ge' to ensure it's not empty, or use 'ti'.

translated_all = {}

def translate_dict(d, target_lang):
    if target_lang == 'am':
        return d # No translation needed
    translator = GoogleTranslator(source='am', target=target_lang)
    res = {}
    for k, v in d.items():
        if isinstance(v, str):
            try:
                # Add delay to avoid rate limit
                time.sleep(0.5)
                res[k] = translator.translate(v)
            except Exception as e:
                print(f"Error translating {v} to {target_lang}: {e}")
                res[k] = v # fallback to am
        elif isinstance(v, list):
            res_list = []
            for item in v:
                if isinstance(item, str):
                    try:
                        time.sleep(0.5)
                        res_list.append(translator.translate(item))
                    except:
                        res_list.append(item)
                elif isinstance(item, dict):
                    res_list.append(translate_dict(item, target_lang))
                else:
                    res_list.append(item)
            res[k] = res_list
        elif isinstance(v, dict):
            res[k] = translate_dict(v, target_lang)
        else:
            res[k] = v
    return res

for file_path, am_str in source_am.items():
    print(f"Processing {file_path}")
    # parse the JS object string into a python dict
    try:
        am_dict = chompjs.parse_js_object(am_str)
    except Exception as e:
        print(f"Error parsing JS object in {file_path}: {e}")
        continue
        
    file_translations = {}
    for lang in ['en', 'am', 'om', 'ti', 'ge', 'es', 'fr', 'ar']:
        print(f"  Translating to {lang}")
        if lang == 'ge':
            # Google Translate does not support Geez. We will use Amharic as fallback.
            file_translations[lang] = am_dict
            continue
            
        file_translations[lang] = translate_dict(am_dict, lang)
        
    translated_all[file_path] = file_translations

with open('translated_all.json', 'w', encoding='utf-8') as f:
    json.dump(translated_all, f, ensure_ascii=False, indent=2)

print("Translation complete.")
