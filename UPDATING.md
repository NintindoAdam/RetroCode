# Updating RetroCode to a newer VS Code / VSCodium (for a non-coder)

RetroCode is "frozen" but **re-syncable**: when VSCodium ships a new version (with the
latest VS Code features **and security fixes**), you can pull it in and re-apply the XP look.
This is written so you can do it by copy-pasting commands. Take it one step at a time.

> You need: a Mac with **Xcode command-line tools**, **Homebrew**, and the build tools from
> the first build. If it's a fresh machine, run: `brew install nvm jq create-dmg librsvg`.

## 1. Get the latest build scripts
```bash
cd ~/Desktop/RetroCode/vscodium
git pull            # if you cloned this repo
```
(Or re-clone https://github.com/NintindoAdam/RetroCode.git)

## 2. Point at the VS Code version you want
VSCodium tracks a VS Code version in `upstream/stable.json`. To move up, update that file to
the newer VSCodium tag (copy the `tag` and `commit` from the
[VSCodium releases](https://github.com/VSCodium/vscodium/releases)). If you just want
whatever is current, the build will pick it up automatically.

## 3. Build (this re-applies the XP look automatically)
```bash
nvm use 22.22.1            # or the version in .nvmrc if it changed
export OS_NAME=osx VSCODE_ARCH=arm64 VSCODE_QUALITY=stable CI_BUILD=no
./get_repo.sh             # downloads the new VS Code source
./build.sh                # applies patches/user/retrocode-xp-look.patch + branding, compiles
```
The XP chrome and theme are in **`patches/user/retrocode-xp-look.patch`** and are re-applied
every build, so you do **not** redo the design work.

## 4. If a part of the look stops painting
VS Code occasionally renames internal CSS classes between versions. If, after building, some
chrome (e.g. tabs) isn't styled:
1. Launch the app, open **Help → Toggle Developer Tools → Console**.
2. Inspect the element whose style is missing and note its current class.
3. Update the matching selector inside `patches/user/retrocode-xp-look.patch`
   (the palette/intent stays the same; only the selector text changes).
4. Rebuild. See `selectors.md`-style notes in the patch comments.

## 5. Sign, notarize, and ship the new version
Follow **`RELEASING.md`** (sign → notarize → staple → new dmg → new GitHub Release →
the download page auto-points at the latest release).

That's it. This is how RetroCode keeps getting upstream **security updates** over time.
