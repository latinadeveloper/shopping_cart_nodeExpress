#!/bin/sh

echo "Testing JSON response for http://localhost:3000/products"
echo "curl \"http://localhost:3000/products\""
curl "http://localhost:3000/products"

echo
echo
echo "Testing XML response for http://localhost:3000/products"
echo "curl -H \"Accept: application/xml\" \"http://localhost:3000/products\""
curl -H "Accept: application/xml" "http://localhost:3000/products"
