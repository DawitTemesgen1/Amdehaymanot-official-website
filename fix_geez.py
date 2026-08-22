import re
import json

with open('src/pages/HomePage.js', 'r', encoding='utf-8') as f:
    content = f.read()

# We need to replace specific strings within the ge block.
ge_replacements = {
    '"heroChip": "የሐዋርያት ሥራ 6፡4"': '"heroChip": "ግብረ ሐዋርያት ፮፡፬"',
    '"headline": "ለነገ የቤተ ክርስትያን ገጽታ የምትጨነቁ ከሆነ ዛሬ ላይ የሰንበት ትምህርት ቤትን አገልግሎት በልባቹህ አኑሩ።"': '"headline": "ለገጸ ቤተ ክርስቲያን ዘነገ እመ ትሔልዩ፣ ዮም ለቤተ ትምህርት ሰንበት ውስተ ልብክሙ አኑሩ።"',
    '"subheadline": "እንግዲህ ሂዱና አሕዛብን ሁሉ በአብ በወልድና በመንፈስ ቅዱስ ስም እያጠመቃችኋቸው፥ ያዘዝኋችሁንም ሁሉ እንዲጠብቁ እያስተማራችኋቸው ደቀ መዛሙርት አድርጓቸው፤ እነሆም እኔ እስከ ዓለም ፍጻሜ ድረስ ሁልጊዜ ከእናንተ ጋር ነኝ ማቴ 28፡19"': '"subheadline": "ሑሩ እንከ ወመሀሩ ኵሎ አሕዛበ ወአጥምቅዎሙ በስመ አብ ወወልድ ወመንፈስ ቅዱስ፤ ወምሀርዎሙ ይዕቀቡ ኵሎ ዘአዘዝኩክሙ፤ ወናሁ አነ እሄሉ ምስሌክሙ በኵሉ መዋዕል እስከ ኅልቀተ ዓለም። ማቴ ፳፰፡፲፱"',
    '"enrollNow": "አሁን ይመዝገቡ"': '"enrollNow": "ይእዜ ተመዝገቡ"',
    '"whyChooseUs": "እኛጋ ቢመጡ ምን ያገኛሉ"': '"whyChooseUs": "ምንተ ትረክቡ ኀቤነ"',
    '"whyChooseSub": "የእምነት፣ የማህበረሰብ እና የደስታ መሰረት"': '"whyChooseSub": "መሠረተ ሃይማኖት፣ ማኅበር ወፍሥሐ"',
    '"ourCommitment": "በእግዚአሄር መንፈስቅዱስ ዕርዳታ"': '"ourCommitment": "በረድኤተ መንፈስ ቅዱስ"',
    '"commitmentText": "ወጣቶችና ልጆችን በእምነት የሚያድጉበት፣ ጠንካራ የሞራል እሴቶችን የሚያዳብሩበት አማኝ፣ ንቁ፣ አስተዋይና ተፅዕኖ ፈጣሪ ክርስትያን ለማድረግ በትጋት እንቆማለን ።"': '"commitmentText": "ንሕነ ንተግህ ከመ ንግበር ሕፃናተ ወወጣንያነ ክርስቲያነ ዘአማኒ፣ ነቃሕ፣ ጠቢብ ወገባሬ ሠናይ፣ ዘይዐብዩ በሃይማኖት ወያፈሪ ሠናየ ምግባረ።"',
    '"yearsService": "የአገልግሎት ዓመታት"': '"yearsService": "ዓመታተ አገልግሎት"',
    '"activeStudents": "ንቁ ተማሪዎች"': '"activeStudents": "ንቁኃን ተማሪያን"',
    '"dedicatedTeachers": "ቁርጠኛ መምህራን"': '"dedicatedTeachers": "ትጉሃን መምህራን"',
    '"buildingFaith": "ህያው ትዉልድን በመገንባት ላይ"': '"buildingFaith": "ንሐንጽ ትውልደ ሕያወ"',
    '"historyText": "ከ1964 ጀምሮ የዓምደሃይማኖት ሰንበት ትምህርት ቤት የመንፈሳዊ እድገት ብርሃን ሆኖ ቆይቷል። በትንሽ ስብስብ የጀመረው በመቶዎች የሚቆጠሩ ህጻናትን የሚያገለግል ንቁ አገልግሎት ሆኖ አድጓል፣ ለህይወት መመሪያ ከክርስቶስ ጋር ህያው ግንኙነት እንዲገነቡ ይረዳቸዋል።"': '"historyText": "እም ፲፱፻፷፬ ዓ.ም. አኀዘ ቤተ ትምህርት ሰንበት ዓምደሃይማኖት ይኩን ብርሃነ ዕብየት መንፈሳዊ። እምንዑስ ማኅበር ጀሚሮ፣ ዐብየ ወኮነ አገልግሎተ ዘይረድእ ምእተ ሕፃናተ፣ ከመ ይሕነፁ ሕያወ ግንኙነት ምስለ ክርስቶስ።"',
    '"quote": "\\"የመጽሐፍ ቅዱስ ታሪኮችን ብቻ አናስተምርም - ይልቁን ሰዎች ከክርስቶስ ጋር ህያው ግንኙነት እንዲገነቡ እንረዳቸዋለን እንጂ።\\""': '"quote": "\\"አኮ ታሪከ መጽሐፍ ቅዱስ ባሕቲቶ ዘንመሀር - አላ ንረድእ ሰብአ ከመ ይሕነፁ ሕያወ ግንኙነት ምስለ ክርስቶስ።\\""',
    '"bookConsultation": "ያግኙን"': '"bookConsultation": "ርከቡነ"',
    '"testimonialsNote": "ከአበው አንደበት"': '"testimonialsNote": "እምአፈ አበው"',
    '"joinFamily": "ቤተሰባችንን ይቀላቀሉ"': '"joinFamily": "ተሓወሱ ማኅበረነ"',
    '"joinText": "ኑ እግዚአብሄርን አብረን እናገልግል"': '"joinText": "ንዑ ንትገነይ ለእግዚአብሔር ኅቡረ"',
    '"registerToday": "ዛሬ ይመዝገቡ"': '"registerToday": "ዮም ተመዝገቡ"',
    '"announcementsTitle": "ወቅታዊ ማስታወቂያዎች"': '"announcementsTitle": "ዜናዋተ መዋዕል"',
    '"announcementsSub": "አዳዲስ ዜናዎቻችንን እና የሚቀጥሉ የሰንበት ትምህርት ቤት ክስተቶችን እዚህ ይመልከቱ።"': '"announcementsSub": "ርአዩ ሐዲሰ ዜናነ ወዘይመጽእ ክንውናተ ቤተ ትምህርት ሰንበት በዝየ።"',
    '"latestNews": "የቅርብ ጊዜ ዜና"': '"latestNews": "ሐዲስ ዜና"',
    '"upcomingEvents": "መጪ ክስተቶች"': '"upcomingEvents": "ዘይመጽእ ክንውናት"',
    '"noNews": "ምንም የቅርብ ጊዜ ዜና የለም። እባክዎ ቆይተው ተመልሰው ይምጡ።"': '"noNews": "አልቦ ሐዲስ ዜና። ናሁ ግቡ ድኅረ።"',
    '"noEvents": "ምንም መጪ ዝግጅቶች አልተያዙም። ይጠብቁ!"': '"noEvents": "አልቦ ዘይመጽእ ክንውናት። ተጸበዩ!"',
    '"viewAll": "ሁሉንም ዜናዎች እና ክስተቶች ይመልከቱ"': '"viewAll": "ርአዩ ኵሎ ዜና ወክንውናተ"',
    # Testimonials
    '"quote": "ለነገ የቤተ ክርስትያን ገጽታ የምትጨነቁ ከሆነ ዛሬ ላይ የሰንበት ትምህርት ቤትን አገልግሎት በልባቹህ አኑሩ።"': '"quote": "ለገጸ ቤተ ክርስቲያን ዘነገ እመ ትሔልዩ፣ ዮም ለቤተ ትምህርት ሰንበት ውስተ ልብክሙ አኑሩ።"',
    '"quote": "ወጣት የሌላት ቤተክርስትያን የነገ ህይወት የላትም በቤተክርስትያን የሌለ ወጣት የነገ ህይወት የለዉም"': '"quote": "ቤተ ክርስቲያን ዘአልባቲ ወጣንያን አልባቲ ሕይወተ ነገ፤ ወወጣኒ ዘአልቦ ውስተ ቤተ ክርስቲያን አልቦቱ ሕይወተ ነገ።"',
    '"quote": "ልጅን በሚሄድበት መንገድ ምራው፥ በሸመገለም ጊዜ ከእርሱ ፈቀቅ አይልም።"': '"quote": "ምሀሮ ለሕፃን ፍኖተ ጽድቅ፤ ወሶበኒ ልኅቀ ኢይርሕቅ እምኔሃ።"',
    '"author": "ምሳ 22፡6"': '"author": "ምሳ ፳፪፡፮"',
    '"quote": "እስክመጣ ድረስ ለማንበብና ለመምከር ለማስተማርም ተጠንቀቅ።"': '"quote": "እስከ እመጽእ ተገሀሥ ለአንብቦ ወለመምከር ወለተምህሮ።"',
    '"author": "1ኛ ጢሞ 4፡13 "': '"author": "፩ጢሞ ፬፡፲፫"',
    '"quote": "ለልጆችህም አስተምረው፥ በቤትህም ስትቀመጥ፥ በመንገድም ስትሄድ፥ ስትተኛም፥ ስትነሣም ተጫወተው።"': '"quote": "ወምሀሮሙ ለደቂቅከ፣ ወተናገሮሙ ሶበ ትነብር ውስተ ቤትከ፣ ወሶበ ትሐውር ፍኖተ፣ ወሶበ ትነውም ወሶበ ትትነሣእ።"',
    '"author": "ዘዳ 6፡7"': '"author": "ዘዳ ፮፡፯"',
    '"mediaContact": "ለበለጠ መረጃ በ 0903896637 ይደውሉ።"': '"mediaContact": "ለተወሳኺ ሓበሬታ በ 0903896637 ይደውሉ።"'
}

# Only replace within the `ge: { ... }` block to avoid messing up the `am: { ... }` block
start_idx = content.find('ge: {')
if start_idx == -1:
    print("ge block not found")
    exit(1)

end_idx = content.find('};', start_idx) # End of translations object? No, translations block ends later.
if end_idx == -1:
    end_idx = len(content)

ge_block = content[start_idx:end_idx]

for amh, geez in ge_replacements.items():
    ge_block = ge_block.replace(amh, geez)

new_content = content[:start_idx] + ge_block + content[end_idx:]

with open('src/pages/HomePage.js', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Ge'ez dictionary updated.")
