#!/bin/bash

set -euf -o pipefail

JS=harvestPlatform.js
BASE_URL="https://platform.harvestapp.com/assets/"
SRC="${BASE_URL}platform.js"

echo "Downloading $SRC"
MAP="$(curl -s "$SRC" | grep '//# sourceMappingURL=' | cut -d= -f2)"
MAP_URL="$BASE_URL$MAP"
echo "Downloading $MAP_URL"
curl -s "$MAP_URL" | jq -r '.sourcesContent[]' > "$JS"

patch -p0 "$JS" < "$JS.patch"

echo "// extracted from $MAP_URL" | cat - "$JS" > "src/vendor/$JS"
rm "$JS"
echo "Done"
