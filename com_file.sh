#!/usr/bin/env bash

git add .
git commit -m"$2 the $1 file"
git push
git checkout master
git pull
git merge web_dynamic
git push
