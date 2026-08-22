import json
import chompjs
from deep_translator import GoogleTranslator

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
        d = result_dict
        for part in parts[:-1]:
            if part not in d:
                # We assume dicts for now. 
                # If it's a list, the keys will be '0', '1', etc.
                d[part] = dict()
            d = d[part]
        d[parts[-1]] = v
        
    # Convert dicts back to lists where appropriate
    def convert_to_list(obj):
        if isinstance(obj, dict):
            if all(k.isdigit() for k in obj.keys()):
                # It's a list
                res = []
                for i in range(len(obj)):
                    res.append(convert_to_list(obj[str(i)]))
                return res
            else:
                return {k: convert_to_list(v) for k, v in obj.items()}
        elif isinstance(obj, list):
            return [convert_to_list(v) for v in obj]
        else:
            return obj
            
    return convert_to_list(result_dict)

translated_all = {}

for file_path, am_str in source_am.items():
    print(f"Processing {file_path}")
    try:
        am_dict = chompjs.parse_js_object(am_str)
    except Exception as e:
        print(f"Error parsing {file_path}: {e}")
        continue
        
    flat_am = flatten_dict(am_dict)
    keys = list(flat_am.keys())
    values = [flat_am[k] for k in keys]
    
    file_translations = {}
    for lang in langs:
        print(f"  Translating to {lang}")
        if lang == 'am' or lang == 'ge':
            file_translations[lang] = am_dict
            continue
            
        translator = GoogleTranslator(source='am', target=lang)
        try:
            # Batch translate
            translated_values = translator.translate_batch(values)
            new_flat = {k: v for k, v in zip(keys, translated_values)}
            file_translations[lang] = unflatten_dict(new_flat)
        except Exception as e:
            print(f"    Error translating to {lang}: {e}")
            file_translations[lang] = am_dict # fallback
            
    translated_all[file_path] = file_translations

with open('translated_all.json', 'w', encoding='utf-8') as f:
    json.dump(translated_all, f, ensure_ascii=False, indent=2)

print("Batch translation complete.")
