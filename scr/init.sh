#!/bin/bash

if [ -d dat ]; then
  echo "dat/ exists, exiting to avoid overwriting existing work"
  exit 0
fi

cp -rp ./node_modules/luja/dat/ dat/
cp -rp ./node_modules/luja/pub/ pub/
cp -rp ./node_modules/luja/cof/ cof/
cp -rp ./node_modules/luja/tpl/ tpl/
cp -rp ./node_modules/luja/sty/ sty/

rm cof/render.coffee
rm cof/monitor.coffee
rm pub/jst/render.js
rm pub/jst/monitor.js

echo "Luja initialization successful "

