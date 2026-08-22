import os
import re

# We will apply intelligent regex replacements across the src directory

def get_files():
    for root, _, files in os.walk('src'):
        for f in files:
            if f.endswith('.js'):
                yield os.path.join(root, f)

appname_replacements = [
    ('"appName": "Religion column"', '"appName": "Amdehaymanot"'),
    ('"appName": "Tarree amantii"', '"appName": "Amdehaymanot"'),
    ('"appName": "ዓምዲ ሃይማኖት።"', '"appName": "ዓምደሃይማኖት"'),
    ('"appName": "Columna de religión"', '"appName": "Amdehaymanot"'),
    ('"appName": "Colonne Religion"', '"appName": "Amdehaymanot"'),
    ('"appName": "عمود الدين"', '"appName": "آمدهيمانوت"'),
    ('"appName": "ዓምደ ሃይማኖት"', '"appName": "ዓምደሃይማኖት"'),
    ('"appName": "Religious Sunday School"', '"appName": "Amdehaymanot"'),
    ('"appName": "Mana Barumsaa Sanbataa Amantii"', '"appName": "Amdehaymanot"'),
    ('"appName": "ሃይማኖታዊ ቤት ትምህርቲ ሰንበት"', '"appName": "ዓምደሃይማኖት"'),
    ('"appName": "Escuela Dominical Religiosa"', '"appName": "Amdehaymanot"'),
    ('"appName": "École religieuse du dimanche"', '"appName": "Amdehaymanot"'),
    ('"appName": "مدرسة الأحد الدينية"', '"appName": "آمدهيمانوت"'),
    ('"appName": "ዓምደሃይማኖት ሰንበት ትምህርት ቤት"', '"appName": "ዓምደሃይማኖት"'),
    ('"appName": "Religion"', '"appName": "Amdehaymanot"'),
    ('"appName": "Amantaa"', '"appName": "Amdehaymanot"'),
    ('"appName": "ሃይማኖት"', '"appName": "ዓምደሃይማኖት"'),
    ('"appName": "Religión"', '"appName": "Amdehaymanot"'),
    ('"appName": "دِين"', '"appName": "آمدهيمانوت"'),
]

# Amharic leaks
leaks = {
    # HomePage.js
    '"corePillars": "መንፈሳዊ አገልግሎቶቻችን "': {
        'en': '"corePillars": "Our Spiritual Services"',
        'om': '"corePillars": "Tajaajila Hafuuraa Keenya"',
        'ti': '"corePillars": "መንፈሳዊ ኣገልግሎትና"',
        'es': '"corePillars": "Nuestros servicios espirituales"',
        'fr': '"corePillars": "Nos services spirituels"',
        'ar': '"corePillars": "خدماتنا الروحية"',
    },
    # ArticleDetailPage.js
    '"backToNews": "ወደ ዜና እና ክስተቶች ተመለስ"': {
        'en': '"backToNews": "Back to News and Events"',
        'om': '"backToNews": "Gara Oduu fi Taateewwaniitti Deebi\'i"',
        'ti': '"backToNews": "ናብ ዜናን ፍጻመታትን ተመለስ"',
        'es': '"backToNews": "Volver a noticias y eventos"',
        'fr': '"backToNews": "Retour aux actualités et événements"',
        'ar': '"backToNews": "العودة إلى الأخبار والأحداث"',
    },
    # GalleryPage.js
    # om: 'Amdehaayimaanot', -> 'Amdehaymanot'
    "om: 'Amdehaayimaanot'": "om: 'Amdehaymanot'",
    "fr: 'Amde Haymanot'": "fr: 'Amdehaymanot'",
    "om: 'Jimmaa · Dabra Efraataa'": "om: 'Jimmaa · Debre Efraataa'",
    "om: 'Kan hundeeffame'": "om: 'Kan hundeeffame'",
    
    '"pageDescription": "Albamoota suuraa taateewwan Mana Barumsaa Sanbataa Jemaah': '"pageDescription": "Albamoota suuraa taateewwan Mana Barumsaa Sanbataa Jimmaa',
    
    # "የአገልግሎት ቅጽበታትን ያስሱ" leaked in om
    '"pageSubtitle": "የአገልግሎት ቅጽበታትን ያስሱ"': {
        'en': '"pageSubtitle": "Explore Moments of Service"',
        'om': '"pageSubtitle": "Yeroo Tajaajilaa Qo\'adhaa"',
        'ti': '"pageSubtitle": "ግዜ ኣገልግሎት ዳህስሱ"',
        'es': '"pageSubtitle": "Explora momentos de servicio"',
        'fr': '"pageSubtitle": "Explorez les moments de service"',
        'ar': '"pageSubtitle": "استكشف لحظات الخدمة"',
    },
    '"pageDescription": "የጅማ ዓምደ ሃይማኖት ሰንበት ትምህርት ቤት ሁነቶችን፣ አገልግሎቶችን እና የማህበረሰብ ስብሰባዎችን የሚያሳዩ የፎቶ አልበሞችን ያስሱ። የእምነታችን እና የኅብረታችን ምስላዊ ጉዞ።"': {
        'om': '"pageDescription": "Albamoota suuraa taateewwan Mana Barumsaa Sanbataa Jimmaa Amdehaymanot, tajaajila, fi walga’ii hawaasaa agarsiisan daawwadhaa. Imala mul\'ataa amantii fi waldaa keenyaa."',
        'fr': '"pageDescription": "Parcourez les albums photos présentant les événements, les services et les rassemblements communautaires de l\'école du dimanche Jimma Amdehaymanot. Un voyage visuel de notre foi et de notre camaraderie."',
        'ar': '"pageDescription": "تصفح ألبومات الصور التي تعرض أحداث مدرسة الأحد جيما أمديهيمانوت وخدماتها وتجمعاتها المجتمعية. رحلة بصرية لإيماننا وزمالتنا."',
    },
    '"emptyMessage": "ምንም አልበሞች አልተገኙም።"': {
        'om': '"emptyMessage": "Albamii gosa kanaan walsimu hin jiru. Filtara biraa yaali ykn yeroo dhiyootti deebi\'ii ilaali."',
        'fr': '"emptyMessage": "Aucun album ne correspond à cette catégorie. Essayez un autre filtre ou revenez plus tard."',
        'ar': '"emptyMessage": "لم يتم العثور على ألبومات. جرب فلتراً آخر أو تحقق لاحقاً."',
    },
    
    # AlbumDetailPage.js
    "en: 'ዓምደ ሃይማኖት'": "en: 'Amdehaymanot'",
    "es: 'ይውደዱ'": "es: 'Me gusta'",
}

def main():
    for filepath in get_files():
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        new_content = content
        
        # 1. Replace Wiixata to Sanbataa globally
        # But wait, we shouldn't replace it if it actually means Monday in some places.
        # However, looking at the context earlier (Wiixata hanga Wiixataatti, Mana barumsaa Wiixata)
        # All of these are wrongly translated. "Wiixata hanga Wiixataatti" should be "Dilbata hanga Dilbataatti".
        # Let's do a targeted replace for "Mana Barumsaa Wiixataa" and "mana barumsaa Wiixataa"
        new_content = new_content.replace('Mana Barumsaa Wiixataa', 'Mana Barumsaa Sanbataa')
        new_content = new_content.replace('mana barumsaa Wiixataa', 'mana barumsaa Sanbataa')
        new_content = new_content.replace('Wiixata hanga Wiixataatti', 'Dilbata hanga Dilbataatti')
        new_content = new_content.replace('Isniina hanga Dilbataatti', 'Wiixata hanga Sanbata Duraatti') # Wait, "Monday to Saturday" -> "Wiixata hanga Sanbata Duraatti"

        # 2. Replace appName
        for old_app, new_app in appname_replacements:
            new_content = new_content.replace(old_app, new_app)
            
        # 3. Replace leaks
        # For dictionary-based leaks, we have to find them in the specific language block
        for old_str, replace_val in leaks.items():
            if isinstance(replace_val, str):
                new_content = new_content.replace(old_str, replace_val)
            else:
                # It's a dict of lang: new_str
                for lang, new_str in replace_val.items():
                    # Find lang block
                    block_start = new_content.find(f'{lang}: {{')
                    if block_start != -1:
                        # naive replace from block_start to end
                        end_idx = new_content.find('};', block_start)
                        if end_idx == -1:
                            end_idx = len(new_content)
                        block_content = new_content[block_start:end_idx]
                        new_block = block_content.replace(old_str, new_str)
                        new_content = new_content[:block_start] + new_block + new_content[end_idx:]

        if new_content != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Fixed {filepath}")

if __name__ == '__main__':
    main()
