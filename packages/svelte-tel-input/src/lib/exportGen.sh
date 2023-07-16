#!/bin/bash

echo -e "\e[1;33m Checking existing index.js \e[0m"
cd "$(dirname "$(readlink -f "${BASH_SOURCE[0]}")")" || exit

# Target file.
file="index.js"
# Notice of replacement.
if [ -f "$file" ] ; then    
    echo -e "\e[1;33m index.js exist. It will be replaced. \e[0m"
    rm "$file";        
fi

# Create index.js
touch index.js

# Set owner if it is necessary
# chown <USER_NAME> index.js

echo -e "\e[1;36m Generating Imports and Exports \e[0m"

# Target folder
srcFolder="./components"
# Export array
array2=()
# Import array
array=()
# Find all files which ended with svelte, except stories.
mapfile -t sourceArray < <(find "${srcFolder}" -maxdepth 10 -type f \( -iname "*.svelte" -not -iname "*.stories.svelte" -and -not -iname "*.test.svelte" -and -not -iname "Style.svelte" \))
for item in "${sourceArray[@]}"; do
    # Push full file names with path into array
    array+=("${item}")
    # Get full file name and cut off the extension.
    fullFilename="${item##*/}"
    shortFilename="${fullFilename%%.*}"
    # Push short filenames into array
    array2+=("${shortFilename}")  
done
# Append index.js file with imports
for i in "${!array[@]}"; do
    printf "export { default as %s } from '%s';\n" "${array2[i]}" "${array[i]}" >> index.js  
done

echo -e '\033[1m DONE\033[0m'
export PATH=$PATH:.
