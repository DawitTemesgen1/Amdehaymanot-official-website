import re

with open('src/pages/HomePage.js', 'r', encoding='utf-8') as f:
    content = f.read()

# English replacements
content = content.replace("Debre Fereta", "Debre Efrata")
content = content.replace("We also provide service and hymnody books.\\n\\n", "We also provide service and hymnody books, available in both digital (soft copy) and physical (hard copy) formats.\\n\\n")

# Amharic replacements
content = content.replace("በካቴድራላችን ደብረ ፈረታ", "በካቴድራላችን በደብረ ኤፍራታ")
content = content.replace("የዜማ መጻሕፍትን ያገኛሉ።\\n\\n", "የዜማ መጻሕፍትን በዲጂታል መንገድ ማለትም በሶፍት ኮፒ እንዲሁም በመዳሰስ መንገድ ማለትም በሃርድ ኮፒ ያገኛሉ።\\n\\n")

# Oromo replacements
content = content.replace("Dabre Farataa", "Dabre Efraataa")
content = content.replace("Akkasumas kitaabota tajaajilaa fi faarfannaa ni dhiyeessina.\\n\\n", "Akkasumas kitaabota tajaajilaa fi faarfannaa, bifa dijitaalawaa (soft copy) fi qabatamaa (hard copy) ta'een ni dhiyeessina.\\n\\n")

# Tigrinya replacements
content = content.replace("ደብረ ፈረታ", "ደብረ ኤፍራታ")
content = content.replace("መጻሕፍቲ ኣገልግሎትን ዝማሬን እውን ነቕርብ ኢና።\\n\\n", "መጻሕፍቲ ኣገልግሎትን ዝማሬን ብዲጂታላዊ መገዲ (ሶፍት ኮፒ) ከምኡ’ውን ብግዙፍ መገዲ (ሃርድ ኮፒ) ክትረኽቡ ትኽእሉ።\\n\\n")

# Geez replacements
content = content.replace("ከማሁኒ ናቀርብ መጻሕፍተ አገልግሎት ወዝማሬ።\\n\\n", "ከማሁኒ ናቀርብ መጻሕፍተ አገልግሎት ወዝማሬ በዲጂታል (ሶፍት ኮፒ) ወበንካይ (ሃርድ ኮፒ)።\\n\\n")

# Spanish replacements
content = content.replace("También ofrecemos libros de servicio e himnodia.\\n\\n", "También ofrecemos libros de servicio e himnodia, disponibles tanto en formato digital (copia digital) como físico (copia impresa).\\n\\n")

# French replacements
content = content.replace("Nous fournissons également des livres de service et d\\'hymnodie.\\n\\n", "Nous fournissons également des livres de service et d\\'hymnodie, disponibles aux formats numérique (soft copy) et physique (hard copy).\\n\\n")

# Arabic replacements
content = content.replace("دبري فريتا", "دبري إفراتا")
content = content.replace("كما نوفر كتب الخدمة والألحان.\\n\\n", "كما نوفر كتب الخدمة والألحان، متوفرة بالصيغتين الرقمية (النسخة الناعمة) والمادية (النسخة المطبوعة).\\n\\n")

with open('src/pages/HomePage.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Text updated in HomePage.js")
