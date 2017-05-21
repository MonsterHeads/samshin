@echo off

md export
cd export
rd . /S /Q
md resources
cd resources
md images
md font
cd ..
cd ..
xcopy resources\images export\resources\images /e /h /k
xcopy resources\font export\resources\font /e /h /k
copy export.html export\index.html
uglifyjs jquery.min.js libs\*.js resources\data\*.js resources\scripts\*.js > export\g.js
