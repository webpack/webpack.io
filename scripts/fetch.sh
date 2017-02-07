#!/bin/bash
set -e # Exit with nonzero exit code if anything fails


# Fetches github.com/webpack/*-loader repositories
./scripts/fetch_package_names.js "webpack" "-loader" | ./scripts/fetch_package_files.js "README.md" "./content/loaders"

# Fetches github.com/webpack/*-webpack-plugin repositories
./scripts/fetch_package_names.js "webpack" "-webpack-plugin" | ./scripts/fetch_package_files.js "README.md" "./content/plugins"

# Fetches github.com/webpack-contrib/*-loader repositories
./scripts/fetch_package_names.js "webpack-contrib" "-loader" | ./scripts/fetch_package_files.js "README.md" "./content/loaders"

# Fetches github.com/webpack-contrib/*-webpack-plugin repositories
./scripts/fetch_package_names.js "webpack-contrib" "-webpack-plugin" | ./scripts/fetch_package_files.js "README.md" "./content/plugins"

./scripts/fetch_package_names.js "babel" "babel-loader" | ./scripts/fetch_package_files.js "README.md" "./content/loaders"

rm -rf ./content/loaders/*.json
rm -rf ./content/plugins/*.json