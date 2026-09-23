import json

with open('data/recetas.json') as f:
    recetas = json.load(f)

# Mapa de categoría → tags por defecto
TAGS_POR_CATEGORIA = {
    'clasicos': ['pan', 'diario'],
    'manteca': ['facturas', 'manteca'],
    'grasa': ['facturas', 'grasa'],
    'regionales': ['regional', 'pan'],
    'inmigrantes': ['inmigrante', 'pan'],
    'fiesta': ['fiesta', 'pan'],
    'panettone': ['panettone', 'fiesta'],
    'bases': ['base', 'masa']
}

for r in recetas:
    if 'metadata' not in r:
        r['metadata'] = {}
    if 'tags' not in r['metadata'] or not r['metadata']['tags']:
        r['metadata']['tags'] = TAGS_POR_CATEGORIA.get(r.get('categoria', ''), [])

with open('data/recetas.json', 'w', encoding='utf-8') as f:
    json.dump(recetas, f, indent=2, ensure_ascii=False)

print("Tags agregados a todas las recetas.")
