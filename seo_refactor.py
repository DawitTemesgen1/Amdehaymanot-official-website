import os
import re

pages_dir = 'src/pages'
for root, _, files in os.walk(pages_dir):
    for f in files:
        if f.endswith('Page.js'):
            filepath = os.path.join(root, f)
            with open(filepath, 'r', encoding='utf-8') as file:
                content = file.read()
                
            # Replace Helmet import with SEO import
            if 'import { Helmet } from \'react-helmet-async\';' in content:
                content = content.replace(
                    'import { Helmet } from \'react-helmet-async\';',
                    'import SEO from \'../components/layout/SEO\';'
                )
            elif 'import { Helmet } from "react-helmet-async";' in content:
                content = content.replace(
                    'import { Helmet } from "react-helmet-async";',
                    'import SEO from \'../components/layout/SEO\';'
                )

            # Find the Helmet block: 
            # <Helmet>
            #   <html lang={language} />
            #   <title>{t.pageTitle}</title>
            #   <meta name="description" content={t.pageDescription} />
            # </Helmet>
            
            # Using regex to replace the Helmet block
            pattern = re.compile(r'<Helmet>.*?</Helmet>', re.DOTALL)
            replacement = '<SEO title={t.pageTitle} description={t.pageDescription} language={language} />'
            
            content = pattern.sub(replacement, content)
            
            with open(filepath, 'w', encoding='utf-8') as file:
                file.write(content)
                
            print(f"Refactored {f}")
            
print("SEO refactoring complete.")
