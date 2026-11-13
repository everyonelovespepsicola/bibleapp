import json
import re
from collections import Counter

with open('public/kjv.json', 'r', encoding='utf-8') as f:
    kjv = json.load(f)

untagged_words = Counter()
total_tagged = 0

for b_idx, book in enumerate(kjv['books'], 1):
    bname = book['name']
    for chap in book['chapters']:
        cnum = chap['chapter']
        for v in chap['verses']:
            st = v.get('strongsText', '')
            total_tagged += len(re.findall(r'\[[HG]\d+\]', st))
            
            # Remove tagged words: word[H1234] or word[G1234]
            unmarked = re.sub(r'[a-zA-Z\’\'*\-]+\s*\[[HG]\d+\]', ' ', st)
            unmarked = re.sub(r'\[[HG]\d+\]', ' ', unmarked)
            unmarked = re.sub(r'[\*\.,:;\?!\(\)\[\]\"\'\“\”\’\—\–\-0-9]', ' ', unmarked)
            
            for w in unmarked.split():
                cw = w.strip().lower()
                if len(cw) > 0:
                    untagged_words[cw] += 1

print('=== WHOLE BIBLE SCAN RESULTS ===')
print('Total Tagged word instances:', total_tagged)
print('Total Untagged word instances:', sum(untagged_words.values()))
print('Unique Untagged words:', len(untagged_words))
print('\nTop 60 untagged words across all 66 books and 31,102 verses:')
for w, c in untagged_words.most_common(60):
    print(f'{w}: {c}')

