@echo off

md export
cd export
rd . /S /Q
md resources
cd resources
md images
cd ..
cd ..
xcopy resources\images export\resources\images /e /h /k
copy export.html export\index.html
uglifyjs jquery.min.js libs\*.js resources\data\*.js > export\g.js
