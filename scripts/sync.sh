#!/usr/bin/env bash
# Sincroniza los JSON exportados desde el panel hacia data/
# Uso: npm run sync  (o bash scripts/sync.sh)

set -e

DESTINO="$(cd "$(dirname "$0")/.." && pwd)/data"

# Detectar carpeta de descargas
if [ -d "$HOME/Descargas" ]; then
  DESCARGAS="$HOME/Descargas"
elif [ -d "$HOME/Downloads" ]; then
  DESCARGAS="$HOME/Downloads"
else
  echo "❌ No encontré la carpeta de Descargas ($HOME/Descargas ni $HOME/Downloads)"
  exit 1
fi

echo "📂 Origen:  $DESCARGAS"
echo "📂 Destino: $DESTINO"
echo ""

COPIADOS=0

for archivo in recetas.json categorias.json app_config.json; do
  ORIGEN="$DESCARGAS/$archivo"
  if [ -f "$ORIGEN" ]; then
    cp "$ORIGEN" "$DESTINO/$archivo"
    echo "✅ $archivo copiado"
    COPIADOS=$((COPIADOS + 1))
  else
    echo "⏭  $archivo no encontrado en Descargas (se omite)"
  fi
done

echo ""
if [ "$COPIADOS" -eq 0 ]; then
  echo "⚠️  No se copió ningún archivo. ¿Exportaste desde el panel primero?"
  exit 1
fi

echo "🎉 Listo. $COPIADOS archivo(s) sincronizado(s)."
echo ""
echo "Ahora podés hacer:"
echo "   git add data/ && git commit -m 'Actualizo recetas' && git push"
