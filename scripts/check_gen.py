import json
import re

with open('public/kjv.json', 'r', encoding='utf-8') as f:
    kjv = json.load(f)

v = [x for b in kjv['books'] if b['name']=='Genesis' for c in b['chapters'] if c['chapter']==1 for x in c['verses'] if x['verse']==30][0]
st = v['strongsText']
unmarked = re.sub(r'[a-zA-Z\’\'*\-]+\s*\[[HG]\d+\]', ' ', st)
unmarked = re.sub(r'\[[HG]\d+\]', ' ', unmarked)
unmarked = re.sub(r'[\*\.,:;\?!\(\)\[\]\"\'\“\”\’\—\–\-0-9]', ' ', unmarked)
print('Untagged in Gen 1:30:', unmarked.split())

