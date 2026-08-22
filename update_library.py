import re

with open('src/pages/HomePage.js', 'r', encoding='utf-8') as f:
    content = f.read()

new_en = '"libraryService": "Library Services", "libraryDesc": "Our Sunday School library, located within the compound of Debre Fereta Kidist Dingil Mariam Cathedral, offers a wide collection of theological, liturgical, and worship books. You will find hagiographies, spiritual fiction, contemporary translations, and profound commentaries passed down from early church scholars. We also provide service and hymnody books.\\n\\n• Working Days: Sunday to Sunday (Closed on Thursdays)\\n• Morning Session: 8:30 AM - 12:00 PM (2:30 - 6:00 Local)\\n• Afternoon Session: 2:00 PM - 7:00 PM (8:00 - 1:00 Local)", '
new_am = '"libraryService": "ቤተ መጻሕፍት", "libraryDesc": "በካቴድራላችን ደብረ ፈረታ ቅድስት ድንግል ማርያም ቅጥር ግቢ ውስጥ በሚገኘው የሰንበት ትምህርት ቤታችን ቤተ መጻሕፍት የተለያዩ የነገረ ሃይማኖት፣ የሥርዓተ ቤተክርስቲያን፣ የአምልኮ መጻሕፍት፣ ገድላት እና ድርሳናተ ቅዱሳን፣ ልብወለድ እና የተለያዩ መንፈሳዊ መጻሕፍት፣ በዘመናችን ባሉ መምህራን የተጻፉ እና የተተረጎሙ መጻሕፍት እንዲሁም ከቀደሙ ሊቃውንት በወንበር እና በጽሑፍ ወደኛ የተሸጋገሩ የትምህርት እና የትርጓሜ መጻሕፍትን እንዲሁም የአገልግሎት እና የዜማ መጻሕፍትን ያገኛሉ።\\n\\n• የሥራ ቀናት፦ ከእሁድ እስከ እሁድ (ከሐሙስ በስተቀር)\\n• የጠዋት ክፍለ ጊዜ፦ ከ 2፡30 - 6፡00\\n• የከሰዓት ክፍለ ጊዜ፦ ከ 8፡00 - 1፡00", '
new_om = '"libraryService": "Tajaajila Mana Kitaabaa", "libraryDesc": "Manni kitaabaa mana barumsaa Dilbataa keenyaa, mooraa Katidaraala Dabre Farataa Qidist Dingil Maariyaam keessatti argamu, kitaabota amantaa, sirna amantii fi waaqeffannaa bal\'inaan dhiyeessa. Kitaabota seenaa qulqullootaa, asoosama hafuuraa, hiikkoowwan yeroo ammaa fi hiikkaawwan gadi fageenya qaban kanneen hayyoota mana kiristaanaa jalqabaa irraa darban ni argattu. Akkasumas kitaabota tajaajilaa fi faarfannaa ni dhiyeessina.\\n\\n• Guyyoota Hojii: Dilbata hanga Dilbataatti (Kamisa cufaadha)\\n• Kutaa Ganamaa: 2:30 - 6:00 (Yeroo Biyya Keessaa)\\n• Kutaa Waaree Boodaa: 8:00 - 1:00 (Yeroo Biyya Keessaa)", '
new_ti = '"libraryService": "ኣገልግሎት ቤተ መጻሕፍቲ", "libraryDesc": "ኣብ ውሽጢ ግቢ ካቴድራል ደብረ ፈረታ ቅድስት ድንግል ማርያም ዝርከብ ቤተ መጻሕፍቲ ቤት ትምህርቲ ሰንበትና፡ ሰፊሕ እክብ ትምህርተ ሃይማኖት፡ ስርዓተ ቤተክርስትያንን መጻሕፍቲ ኣምልኾን የቕርብ። ገድልታትን ድርሳናትን፣ መንፈሳዊ ልብወለድ፣ ዘመናዊ ትርጉማትን ከምኡ’ውን ካብ ቀዳሞት ሊቃውንቲ ቤተክርስትያን ዝተመሓላለፉ ዓሚቝ ትርጉማትን ክትረኽቡ ኢኹም። መጻሕፍቲ ኣገልግሎትን ዝማሬን እውን ነቕርብ ኢና።\\n\\n• መዓልታት ስራሕ፡ ካብ ሰንበት ክሳብ ሰንበት (ሓሙስ ዕጹው እዩ)\\n• ናይ ንጉሆ ክፍለ ግዜ፡ 2:30 - 6:00 (ናይ ውሽጢ ዓዲ ግዜ)\\n• ናይ ድሕሪ ቐትሪ ክፍለ ግዜ፡ 8:00 - 1:00 (ናይ ውሽጢ ዓዲ ግዜ)", '
new_ge = '"libraryService": "አገልግሎተ ቤተ መጻሕፍት", "libraryDesc": "ቤተ መጻሕፍት ዘቤተ ትምህርት ሰንበትነ፣ ዘይረከብ ውስተ ዐጸደ ካቴድራል ደብረ ፈረታ ቅድስት ድንግል ማርያም፣ ያቀርብ ብዙኃነ መጻሕፍተ ነገረ ሃይማኖት፣ ሥርዓተ ቤተ ክርስቲያን ወአምልኮ። ትረክቡ ገድላተ ወድርሳናተ፣ ልብወለደ መንፈሳዊ፣ ትርጓሜያተ ዘመናውያነ፣ ወዓሚቀ ትርጓሜ ዘተመኃለፈ እምቀደምት ሊቃውንተ ቤተ ክርስቲያን። ከማሁኒ ናቀርብ መጻሕፍተ አገልግሎት ወዝማሬ።\\n\\n• መዋዕለ ግብር፡ እምእሑድ እስከ እሑድ (ሐሙስ ዕፁው ውእቱ)\\n• ዘነግህ ጊዜ፡ ፪፡፴ - ፮፡፻ (ዘሀገር ጊዜ)\\n• ዘምሴት ጊዜ፡ ፰፡፻ - ፩፡፻ (ዘሀገር ጊዜ)", '
new_es = '"libraryService": "Servicios de Biblioteca", "libraryDesc": "Nuestra biblioteca de la Escuela Dominical, ubicada dentro del complejo de la Catedral Debre Fereta Kidist Dingil Mariam, ofrece una amplia colección de libros teológicos, litúrgicos y de adoración. Encontrará hagiografías, ficción espiritual, traducciones contemporáneas y comentarios profundos transmitidos por los primeros eruditos de la iglesia. También ofrecemos libros de servicio e himnodia.\\n\\n• Días de Trabajo: Domingo a Domingo (Cerrado los Jueves)\\n• Sesión de Mañana: 8:30 AM - 12:00 PM (2:30 - 6:00 Local)\\n• Sesión de Tarde: 2:00 PM - 7:00 PM (8:00 - 1:00 Local)", '
new_fr = '"libraryService": "Services de Bibliothèque", "libraryDesc": "La bibliothèque de notre école du dimanche, située dans l\'enceinte de la cathédrale Debre Fereta Kidist Dingil Mariam, propose une vaste collection de livres théologiques, liturgiques et de culte. Vous y trouverez des hagiographies, des fictions spirituelles, des traductions contemporaines et de profonds commentaires transmis par les premiers érudits de l\'Église. Nous fournissons également des livres de service et d\'hymnodie.\\n\\n• Jours Ouvrables : De dimanche à dimanche (Fermé le jeudi)\\n• Session du Matin : 8h30 - 12h00 (2:30 - 6:00 Heure locale)\\n• Session de l\'Après-midi : 14h00 - 19h00 (8:00 - 1:00 Heure locale)", '
new_ar = '"libraryService": "خدمات المكتبة", "libraryDesc": "تقدم مكتبة مدرسة الأحد الخاصة بنا، والتي تقع داخل مجمع كاتدرائية دبري فريتا كيدست دينجيل مريم، مجموعة واسعة من الكتب اللاهوتية والليتورجية وكتب العبادة. ستجد سير القديسين، والخيال الروحي، والترجمات المعاصرة، والتفاسير العميقة التي تناقلها علماء الكنيسة الأوائل. كما نوفر كتب الخدمة والألحان.\\n\\n• أيام العمل: من الأحد إلى الأحد (مغلق يوم الخميس)\\n• الجلسة الصباحية: 8:30 صباحًا - 12:00 مساءً (2:30 - 6:00 بالتوقيت المحلي)\\n• جلسة بعد الظهر: 2:00 مساءً - 7:00 مساءً (8:00 - 1:00 بالتوقيت المحلي)", '

content = content.replace(' "whyChooseUs": "What will you find if you come to us?"', new_en + '"whyChooseUs": "What will you find if you come to us?"')
content = content.replace(' "whyChooseUs": "እኛጋ ቢመጡ ምን ያገኛሉ"', new_am + '"whyChooseUs": "እኛጋ ቢመጡ ምን ያገኛሉ"')
content = content.replace(' "whyChooseUs": "Gara keenya yoo dhuftan maal argattu?"', new_om + '"whyChooseUs": "Gara keenya yoo dhuftan maal argattu?"')
content = content.replace(' "whyChooseUs": "ናባና እንተ መጺእኩም እንታይ ትረኽቡ፧"', new_ti + '"whyChooseUs": "ናባና እንተ መጺእኩም እንታይ ትረኽቡ፧"')
content = content.replace(' "whyChooseUs": "ኀቤነሰ ለእመ መጻእክሙ ምንተ ትረክቡ፧"', new_ge + '"whyChooseUs": "ኀቤነሰ ለእመ መጻእክሙ ምንተ ትረክቡ፧"')
content = content.replace(' "whyChooseUs": "¿Qué encontrarás si vienes a nosotros?"', new_es + '"whyChooseUs": "¿Qué encontrarás si vienes a nosotros?"')
content = content.replace(' "whyChooseUs": "Que trouverez-vous si vous venez à nous ?"', new_fr + '"whyChooseUs": "Que trouverez-vous si vous venez à nous ?"')
content = content.replace(' "whyChooseUs": "ماذا ستجد إذا أتيت إلينا؟"', new_ar + '"whyChooseUs": "ماذا ستجد إذا أتيت إلينا؟"')

feature_addition = ",\n    { title: t.libraryService, description: t.libraryDesc, icon: <LocalLibrary />, image: bibleStudy }"
content = content.replace('{ title: t.religiousEducation, description: t.educationDesc, icon: <Groups />, image: community },', '{ title: t.religiousEducation, description: t.educationDesc, icon: <Groups />, image: community }' + feature_addition)

import_replacement = """import {
  Book, Groups, MusicNote, Church, Celebration, Favorite, LocalLibrary,
} from '@mui/icons-material';"""
content = re.sub(r"import \{\s*Book,\s*Groups,\s*MusicNote,\s*Church,\s*Celebration,\s*Favorite,\s*\}\s*from '@mui/icons-material';", import_replacement, content)

with open('src/pages/HomePage.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated HomePage.js")
