import json

with open('public/kjv.json', 'r', encoding='utf-8') as f:
    kjv = json.load(f)

h8712_verses = [
    book['name'] + ' ' + str(chap['chapter']) + ':' + str(v['verse'])
    for book in kjv['books']
    for chap in book['chapters']
    for v in chap['verses']
    if '[h8712]' in v.get('strongsText', '').lower()
]

print('Total H8712 verses:', len(h8712_verses))
print('Page 73 (18001-18250): start =', h8712_verses[18000], 'end =', h8712_verses[18249])
print('Page 74 (18251-18500): start =', h8712_verses[18250], 'end =', h8712_verses[18499])
print('Page 75 (18501-18665): start =', h8712_verses[18500], 'end =', h8712_verses[-1])

