read -p "keystore path: " keystore_path
read -p "password: " password
read -p "alias: " alias

echo ""

npx cap build android --keystorepath $keystore_path --keystorepass \
    $password --keystorealias $alias --keystorealiaspass $password --androidreleasetype "APK" --signing-type apksigner
