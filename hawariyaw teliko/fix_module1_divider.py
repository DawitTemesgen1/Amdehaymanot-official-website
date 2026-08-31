import os
import re

def process_file(filepath, divider_content, insert_after_module_heading):
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    new_lines = []
    slide_count = 0
    in_module_1 = False
    divider_inserted = False
    
    for i, line in enumerate(lines):
        if line.startswith('## 📌 ሞጁል ፩፡'):
            in_module_1 = True
            
        if line.startswith('### ስላይድ'):
            slide_count += 1
            # Adjust slide number
            line = re.sub(r'### ስላይድ \d+፡', f'### ስላይድ {slide_count}፡', line)
            
            # If we are in module 1, and we hit the first real content slide (which is right after title, TOC, and intro)
            # wait, intro is slide 3. The content starts at slide 4. 
            # It's better to look for the slide right after "መግቢያ" or look for the first content slide.
            # Let's just hardcode: insert after slide 3.
            if slide_count == 4 and in_module_1 and not divider_inserted:
                new_lines.append(f'### ስላይድ {slide_count}፡ መለያ ስላይድ (Section Divider)\n')
                new_lines.append(divider_content + '\n\n')
                slide_count += 1
                line = re.sub(r'### ስላይድ \d+፡', f'### ስላይድ {slide_count}፡', line)
                divider_inserted = True

        new_lines.append(line)
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
    print(f"Processed {filepath}")

# hawariyaw
hawariyaw_path = "/home/dawit/projects/amdehaymanot official website/hawariyaw teliko/HAWARIYAW_TELIKO_FULL_CONTENT.md"
divider_h = "- **ክፍል ፩፦** የሐዋርያ እና የሐዋርያዊነት ምንነት"
process_file(hawariyaw_path, divider_h, True)

# yesibiket
yesibiket_path = "/home/dawit/projects/amdehaymanot official website/hawariyaw teliko/YESIBIKET_ZEDE_FULL_CONTENT.md"
divider_y = "- **ክፍል ፩፦** መግቢያ፣ ትርጉምና መሠረተ ሃሳቦች"
process_file(yesibiket_path, divider_y, True)

