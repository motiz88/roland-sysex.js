#!/bin/bash
set -e # Exit with nonzero exit code if anything fails

cd "${0%/*}" # <root>/auto-deploy-docs
cd .. # <root>

SOURCE_BRANCH="master"
TARGET_BRANCH="gh-pages"

function doCompile {
  npm run doc:build
}

# Pull requests and commits to other branches shouldn't try to deploy, just build to verify
if [ "$TRAVIS_PULL_REQUEST" != "false" -o "$TRAVIS_BRANCH" != "$SOURCE_BRANCH" ]; then
    echo "Skipping deploy; just doing a build."
    doCompile
    exit 0
fi

# Save some useful information
REPO=`git config remote.origin.url`
SSH_REPO=${REPO/https:\/\/github.com\//git@github.com:}
SHA=`git rev-parse --verify HEAD`

# Clone the existing gh-pages for this repo into doc/
# Create a new empty branch if gh-pages doesn't exist yet (should only happen on first deploy)
git clone $REPO doc
cd doc # <root>/doc
git checkout $TARGET_BRANCH || git checkout --orphan $TARGET_BRANCH
git clean -f
git reset --hard
cd .. # <root>/doc

# Run our compile script
doCompile

# Now let's go have some fun with the cloned repo
cd doc # <root>/doc
git config user.name "Travis CI"
git config user.email "$COMMIT_AUTHOR_EMAIL"

# If there are no changes to the compiled doc (e.g. this is a README update) then just bail.
if [[ ! $(git status --short --untracked) ]]; then
    echo "No changes to the output on this push; exiting."
    exit 0
fi

git add . --all

# Commit the "changes", i.e. the new version.
# The delta will show diffs between new and old versions.
git commit -m "Deploy to GitHub Pages: ${SHA}"

# Get the deploy key by using Travis's stored variables to decrypt deploy_key.enc
ENCRYPTED_KEY_VAR="encrypted_${ENCRYPTION_LABEL}_key"
ENCRYPTED_IV_VAR="encrypted_${ENCRYPTION_LABEL}_iv"
ENCRYPTED_KEY=${!ENCRYPTED_KEY_VAR}
ENCRYPTED_IV=${!ENCRYPTED_IV_VAR}
openssl aes-256-cbc -K $ENCRYPTED_KEY -iv $ENCRYPTED_IV -in ../auto-deploy-docs/deploy_key.enc -out deploy_key -d
chmod 600 deploy_key
eval `ssh-agent -s`
ssh-add deploy_key

# Now that we're all set up, we can push.
git push $SSH_REPO $TARGET_BRANCH
