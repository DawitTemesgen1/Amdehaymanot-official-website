def replace_in_file(filepath, replacements):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    new_content = content
    for old, new in replacements.items():
        new_content = new_content.replace(old, new)
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Fixed {filepath}")

# GalleryPage.js
replace_in_file('src/pages/GalleryPage.js', {
    "om: 'ምንም አልበም አልተገኘም'": "om: 'Albamii gosa kanaan walsimu hin jiru'",
    "fr: 'ዓምደሃይማኖት ሁሉም ምድቦች'": "fr: 'Amdehaymanot Toutes les catégories'",
    "ar: 'የፎቶ ማዕከለ ስዕላት'": "ar: 'معرض الصور'",
    "om: 'የአገልግሎት ቅጽበታትን ያስሱ'": "om: 'Yeroo Tajaajilaa Qo\\'adhaa'",
})

# AlbumDetailPage.js
replace_in_file('src/pages/AlbumDetailPage.js', {
    "en: 'ዓምደሃይማኖት'": "en: 'Amdehaymanot'",
    "es: 'ይውደዱ'": "es: 'Me gusta'",
})

# AboutPage.js
replace_in_file('src/pages/AboutPage.js', {
    "Manni barumsaa Wiixataa kun": "Manni barumsaa Sanbataa kun"
})
