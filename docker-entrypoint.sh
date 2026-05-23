#!/bin/sh
set -e

echo "🌙 Masal Dünyası başlatılıyor..."

echo "📦 Veritabanı migration çalıştırılıyor..."
npx prisma migrate deploy

echo "🌱 Seed verisi kontrol ediliyor..."
STORY_COUNT=$(node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.story.count().then(n => { console.log(n); prisma.\$disconnect(); });
" 2>/dev/null || echo "0")

if [ "$STORY_COUNT" -lt "100" ]; then
  echo "🌱 Seed verisi yükleniyor ($STORY_COUNT masal mevcut)..."
  node prisma/seed/index.js
  echo "✅ Seed tamamlandı!"
else
  echo "✅ Veritabanında $STORY_COUNT masal mevcut, seed atlanıyor."
fi

echo "🚀 Sunucu başlatılıyor..."
exec node server.js
