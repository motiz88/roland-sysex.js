#!/bin/bash
cd "${0%/*}"
travis login
travis sync
rm -f deploy_key.*
ssh-keygen -t rsa -b 4096 -f deploy_key 
travis encrypt-file deploy_key -r $1 | \
    grep -o -P "encrypted_\K[0-9a-f]+" | \
    head -n 1 \
    > travis-encryption-label
