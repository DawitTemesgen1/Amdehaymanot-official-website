import json
import chompjs
from deep_translator import GoogleTranslator
from concurrent.futures import ThreadPoolExecutor

with open('source_am.json', 'r', encoding='utf-8') as f:
    source_am = json.load(f)

langs = ['en', 'om', 'ti', 'es', 'fr', 'ar', 'am', 'ge']

def flatten_dict(d, parent_key='', sep='.'):
    items = []
    if isinstance(d, list):
        for i, v in enumerate(d):
            new_key = f"{parent_key}{sep}{i}" if parent_key else str(i)
            if isinstance(v, (dict, list)):
                items.extend(flatten_dict(v, new_key, sep=sep).items())
            else:
                items.append((new_key, v))
    elif isinstance(d, dict):
        for k, v in d.items():
            new_key = f"{parent_key}{sep}{k}" if parent_key else k
            if isinstance(v, (dict, list)):
                items.extend(flatten_dict(v, new_key, sep=sep).items())
            else:
                items.append((new_key, v))
    else:
        items.append((parent_key, d))
    return dict(items)

def unflatten_dict(d, sep='.'):
    result_dict = dict()
    for k, v in d.items():
        parts = k.split(sep)
        curr = result_dict
        for part in parts[:-1]:
            if part not in curr:
                curr[part] = dict()
            curr = curr[part]
        curr[parts[-1]] = v
        
    def convert_to_list(obj):
        if isinstance(obj, dict):
            if all(k.isdigit() for k in obj.keys()):
                res = []
                for i in range(len(obj)):
                    res.append(convert_to_list(obj.get(str(i))))
                return res
            else:
                return {k: convert_to_list(v) for k, v in obj.items()}
        elif isinstance(obj, list):
            return [convert_to_list(v) for v in obj]
        else:
            return obj
            
    return convert_to_list(result_dict)

def translate_single(v, lang):
    try:
        return GoogleTranslator(source='am', target=lang).translate(v)
    except:
        return v

translated_all = {}

def process_file_lang(file_path, lang, flat_am):
    if lang == 'am' or lang == 'ge':
        return unflatten_dict(flat_am)
        
    keys = list(flat_am.keys())
    values = [flat_am[k] for k in keys]
    
    # translate values concurrently
    translated_values = []
    with ThreadPoolExecutor(max_workers=10) as executor:
        translated_values = list(executor.map(lambda v: translate_single(v, lang), values))
        
    new_flat = {k: v for k, v in zip(keys, translated_values)}
    return unflatten_dict(new_flat)

for file_path, am_str in source_am.items():
    print(f"Processing {file_path}")
    try:
        am_dict = chompjs.parse_js_object(am_str)
    except Exception as e:
        print(f"Error parsing {file_path}: {e}")
        continue
        
    flat_am = flatten_dict(am_dict)
    file_translations = {}
    
    for lang in langs:
        file_translations[lang] = process_file_lang(file_path, lang, flat_am)
        
    translated_all[file_path] = file_translations
    print(f"Finished {file_path}")

with open('translated_all.json', 'w', encoding='utf-8') as f:
    json.dump(translated_all, f, ensure_ascii=False, indent=2)

print("Translation complete.")
