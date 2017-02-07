#!/bin/bash
set -e # Exit with nonzero exit code if anything fails

rm -rf ./generated

mkdir -p ./generated/loaders
cp -rf ./content/loaders/ ./generated/loaders
mkdir -p ./generated/plugins
cp -rf ./content/plugins/ ./generated/plugins