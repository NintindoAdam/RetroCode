# Releasing a new RetroCode version (for a non-coder)

This is the recipe to turn a freshly-built `RetroCode.app` into a signed, notarized download
on GitHub. One-time things (Apple Developer ID certificate, app-specific password) are
already set up; you mostly re-run the same steps.

> Prerequisites already in place: a **Developer ID Application** certificate in your keychain,
> and a notarization keychain profile named **`retrocode-notary`** (created once with
> `xcrun notarytool store-credentials`). Team ID: `CBGR43HVMN`.

## 1. Build the app
See `UPDATING.md`. You end up with `VSCode-darwin-arm64/RetroCode.app`.

## 2. Sign it (clean copy avoids macOS "detritus" errors)
macOS adds protected attributes to launched apps that block signing. Zip → unzip in `/tmp`
gives a clean copy, then sign:
```bash
cd VSCode-darwin-arm64
zip -q -r -X -y /tmp/rc.zip RetroCode.app
rm -rf /tmp/rc && mkdir -p /tmp/rc && (cd /tmp/rc && unzip -qq /tmp/rc.zip)
chmod -RN /tmp/rc/RetroCode.app
node ../build-retrocode/sign-retrocode.mjs /tmp/rc/RetroCode.app ../vscode/build/azure-pipelines/darwin
codesign --verify --deep --strict /tmp/rc/RetroCode.app   # should say "valid on disk"
```

## 3. Make the dmg and sign it
```bash
rm -rf /tmp/stage && mkdir -p /tmp/stage && cp -R /tmp/rc/RetroCode.app /tmp/stage/
create-dmg --volname RetroCode --window-size 560 380 --icon-size 110 \
  --icon RetroCode.app 150 190 --app-drop-link 410 190 --hide-extension RetroCode.app \
  /tmp/RetroCode-X.Y.Z-arm64.dmg /tmp/stage
codesign --force --timestamp --sign "Developer ID Application: Adam Markocki (CBGR43HVMN)" /tmp/RetroCode-X.Y.Z-arm64.dmg
```

## 4. Notarize and staple
```bash
xcrun notarytool submit /tmp/RetroCode-X.Y.Z-arm64.dmg --keychain-profile retrocode-notary --wait
xcrun stapler staple /tmp/RetroCode-X.Y.Z-arm64.dmg
spctl -a -t open --context context:primary-signature -vv /tmp/RetroCode-X.Y.Z-arm64.dmg  # "accepted / Notarized Developer ID"
```
> If `--wait` seems to hang, it usually already succeeded, check with
> `xcrun notarytool history --keychain-profile retrocode-notary`.

## 5. Publish the GitHub Release
```bash
gh release create vX.Y.Z /tmp/RetroCode-X.Y.Z-arm64.dmg \
  --repo NintindoAdam/RetroCode --title "RetroCode vX.Y.Z" \
  --notes "Windows XP Luna look for VS Code. macOS arm64, signed & notarized."
```
The download page (`website/index.html`, served at https://nintindoadam.github.io/RetroCode/)
points at `releases/latest/download/RetroCode-1.0.0-arm64.dmg`. If you change the file name or
version, update that link in `website/index.html` (and re-deploy the `gh-pages` branch).

## 6. Update the download page if needed
```bash
git checkout gh-pages
cp website/index.html index.html   # if the page changed
git commit -am "site: update download" && git push
git checkout main
```

## Windows builds (automated, no Mac/PC build needed)
The Windows installer is built in the cloud by GitHub Actions:
- Workflow: **`.github/workflows/retrocode-windows.yml`** (Actions tab → "Build RetroCode (Windows x64)" → **Run workflow**).
- It compiles for Windows x64, builds the Inno Setup **User Setup `.exe`** + a portable `.zip`, and
  attaches them to the **v1.0.0** release as `RetroCode-1.0.0-windows-x64-Setup.exe` / `.zip`.
- Currently **unsigned**: users see a one-time "Windows protected your PC" SmartScreen prompt
  (More info → Run anyway). To remove it, add an EV code-signing certificate and a signing step.
- To cut a new Windows version, bump the filenames/tag in the workflow and re-run it.
