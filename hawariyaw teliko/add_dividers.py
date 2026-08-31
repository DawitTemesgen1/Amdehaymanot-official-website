import re

filepath = "/home/dawit/projects/amdehaymanot official website/hawariyaw teliko/HAWARIYAW_TELIKO_FULL_CONTENT.md"
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update TOC
old_toc = """### ስላይድ 2፡ ማውጫ (Table of Contents)
- **፩.** የሐዋርያ እና የሐዋርያዊነት ምንነት
- **፪.** የሐዋርያዊ ተልዕኮ ታሪክ
- **፫.** የወንጌል ማዳረስ 3ቱ መንገዶች
- **፬.** 10ሩ መሠረታዊ የሐዋርያዊ ተልእኮ መርሆዎች
- **፭.** የሐዋርያ ጥሪ፣ 4ቱ ዋና ፈተናዎችና ማጠቃለያ"""

new_toc = """### ስላይድ 2፡ ማውጫ (Table of Contents)
- **፩.** የሐዋርያ እና የሐዋርያዊነት ምንነት
- **፪.** የሐዋርያዊ ተልዕኮ ታሪክ
- **፫.** የሐዋርያዊነት መሠረቶች
- **፬.** የወንጌል ማዳረስ 3ቱ መንገዶች
- **፭.** 10ሩ መሠረታዊ የሐዋርያዊ ተልእኮ መርሆዎች
- **፮.** የሐዋርያ ጥሪ፣ 4ቱ ዋና ፈተናዎችና ማጠቃለያ"""
content = content.replace(old_toc, new_toc)

# 2. Insert Chapter 2 divider before "የሐዋርያዊ ተልዕኮ ታሪክ — ሀ. ቅድመ ክርስትና"
ch2_divider = """### ስላይድ X፡ መለያ ስላይድ (Section Divider)
- **ክፍል ፪፦** የሐዋርያዊ ተልዕኮ ታሪክ

"""
content = content.replace("### ስላይድ 6፡ የሐዋርያዊ ተልዕኮ ታሪክ — ሀ. ቅድመ ክርስትና", ch2_divider + "### ስላይድ 6፡ የሐዋርያዊ ተልዕኮ ታሪክ — ሀ. ቅድመ ክርስትና")

# 3. Insert Chapter 3 divider before "የሐዋርያዊነት 4ቱ መሠረቶች"
ch3_divider = """### ስላይድ X፡ መለያ ስላይድ (Section Divider)
- **ክፍል ፫፦** የሐዋርያዊነት መሠረቶች

"""
content = content.replace("### ስላይድ 8፡ የሐዋርያዊነት 4ቱ መሠረቶች", ch3_divider + "### ስላይድ 8፡ የሐዋርያዊነት 4ቱ መሠረቶች")

# 4. Update the other section dividers (which are currently 3, 4, 5) to (4, 5, 6)
content = content.replace("- **ክፍል ፫፦** የወንጌል ማዳረስ 3ቱ መንገዶች", "- **ክፍል ፬፦** የወንጌል ማዳረስ 3ቱ መንገዶች")
content = content.replace("- **ክፍል ፬፦** 10ሩ የሐዋርያዊ ተልእኮ መሠረታዊ መርሆዎች", "- **ክፍል ፭፦** 10ሩ የሐዋርያዊ ተልእኮ መሠረታዊ መርሆዎች")
content = content.replace("- **ክፍል ፭፦** የሐዋርያ ጥሪ፣ ፈተናዎችና ማጠቃለያ", "- **ክፍል ፮፦** የሐዋርያ ጥሪ፣ ፈተናዎችና ማጠቃለያ")

# 5. Fix all slide numbers
lines = content.split('\n')
new_lines = []
slide_count = 0
for line in lines:
    if line.startswith('### ስላይድ'):
        slide_count += 1
        line = re.sub(r'### ስላይድ .*?፡', f'### ስላይድ {slide_count}፡', line)
    new_lines.append(line)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write('\n'.join(new_lines))

print("Successfully updated dividers and slide numbers in hawariyaw_teliko")
