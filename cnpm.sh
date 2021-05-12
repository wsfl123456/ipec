#!/bin/bash
#CNPM build 命令
yarn config set registry https://registry.npm.taobao.org
yarn config set sass_binary_site http://cdn.npm.taobao.org/dist/node-sass
yarn install
yarn run "${PACKAGE_LABEL}"
