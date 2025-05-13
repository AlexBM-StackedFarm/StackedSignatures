#!/bin/bash

# Create dist directory if it doesn't exist
mkdir -p dist

# Copy static assets
cp -r app/static dist/

# Copy HTML templates
cp -r app/templates dist/

# Create a simple index.html that redirects to the app
cat > dist/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="refresh" content="0;url=/templates/index.html">
    <title>Stacked Farm Email Signature Generator</title>
</head>
<body>
    <p>Redirecting to <a href="/templates/index.html">Email Signature Generator</a>...</p>
</body>
</html>
EOF

echo "Build completed successfully!"