import re

# 1. Read the old am: block from ce64b53
with open('/tmp/ce64_homepage.js') as f:
    c = f.read()
    idx = c.find('  am: {')
    end = c.find('  om: {', idx)
    # The block ends right before "  om: {"
    # Actually, we just need to get everything from "am: {" up to the line before "om: {"
    original_am_block = c[idx:end].rstrip()
    if original_am_block.endswith(','):
        original_am_block = original_am_block[:-1]

# 2. Add library text to it
library_text = '"libraryService": "የቤተ መጻሕፍት አገልግሎት", "libraryDesc": "በደብረ ኤፍራታ ቅድስት ድንግል ማርያም ካቴድራል ግቢ ውስጥ የሚገኘው የሰንበት ትምህርት ቤታችን ቤተ-መጽሐፍት፣ በርካታ የሥነ-መለኮት፣ የሥርዓተ ቅዳሴ እና የአምልኮ መጻሕፍትን ያቀርባል። የቅዱሳን ገድላት፣ መንፈሳዊ ልቦለዶች፣ ዘመናዊ ትርጓሜዎች እና የቀደምት የቤተ ክርስቲያን አባቶች ጥልቅ ማብራሪያዎችን ያገኛሉ። የሥርዓተ አምልኮ እና የዝማሬ መጻሕፍትን በሶፍት ኮፒ እና በሃርድ ኮፒ (በታተመ) አዘጋጅተናል።\\n\\n• የስራ ቀናት፡ ከእሁድ እስከ እሁድ (ሐሙስ ዝግ ነው)\\n• የጠዋት መርሃ ግብር፡ ከጠዋቱ 2፡30 - 6፡00\\n• የከሰዓት መርሃ ግብር፡ ከቀኑ 8፡00 - 1፡00", '

# insert library_text before "whyChooseUs"
fixed_am_block = original_am_block.replace('"whyChooseUs":', library_text + '"whyChooseUs":')

# 3. Read current HomePage.js
with open('src/pages/HomePage.js') as f:
    current_content = f.read()

# 4. Find the current am: block
idx_cur = current_content.find('  am: {')
end_cur = current_content.find('  om: {', idx_cur)
current_am_block = current_content[idx_cur:end_cur].rstrip()
if current_am_block.endswith(','):
    current_am_block = current_am_block[:-1]

# 5. Replace current with fixed
new_content = current_content.replace(current_am_block, fixed_am_block)

# 6. Write back
with open('src/pages/HomePage.js', 'w') as f:
    f.write(new_content)

print("Done replacing am: block!")
