import re

filepath = 'public/index.html'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# We want to add open graph tags before </head>
og_tags = """
    <!-- Open Graph / SEO Base -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://amdehaymanot.com/" />
    <meta property="og:title" content="ዓምደ ሃይማኖት ሰንበት ትምህርት ቤት - Amde Haymanot Sunday School" />
    <meta property="og:description" content="ዓምደ ሃይማኖት ሰንበት ትምህርት ቤት - EOTC Jimma Diocese Debre Efrata Mariam Cathedral Sunday School" />
    <meta property="og:image" content="https://amdehaymanot.com/my-logo.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="https://amdehaymanot.com/" />
    <meta name="twitter:title" content="ዓምደ ሃይማኖት ሰንበት ትምህርት ቤት - Amde Haymanot Sunday School" />
    <meta name="twitter:description" content="ዓምደ ሃይማኖት ሰንበት ትምህርት ቤት - EOTC Jimma Diocese Debre Efrata Mariam Cathedral Sunday School" />
    <meta name="twitter:image" content="https://amdehaymanot.com/my-logo.png" />
"""

if "og:type" not in content:
    content = content.replace("</head>", f"{og_tags}</head>")
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Added OG tags to index.html")
else:
    print("OG tags already exist in index.html")
