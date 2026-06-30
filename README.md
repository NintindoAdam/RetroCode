# RetroCode

**Visual Studio Code, dressed in Windows XP "Luna".**

RetroCode is a free, open-source code editor: the full power of
[VSCodium](https://vscodium.com) (the freely-licensed *Code OSS* build of Visual
Studio Code) with the classic Windows XP "Luna" look baked in by default. Glossy blue
title bar, beveled tabs, beige panels, and Tahoma type, no extensions or settings to
tweak. It is a genuine, fully-working IDE underneath.

🔵 **Download:** https://nintindoadam.github.io/RetroCode/
📦 **Latest release:** see the [Releases](../../releases) tab.

![RetroCode](build-retrocode/icon/icon-source.svg)

---

## Download (macOS)

Grab `RetroCode-x.y.z-arm64.dmg` from the [download page](https://nintindoadam.github.io/RetroCode/)
or the [Releases](../../releases) tab, open it, and drag **RetroCode** into **Applications**.
The app is **code-signed and notarized by Apple**, so it opens like any normal Mac app,
no "unidentified developer" warning.

> Currently built for **Apple Silicon (arm64)**. An Intel and a Windows build are possible
> later from the same source (see `UPDATING.md`).

## What's in this repository

This repo is a **fork of the VSCodium build system** plus a small, self-contained XP layer:

| Path | What it is |
|------|-----------|
| `patches/user/retrocode-xp-look.patch` | Injects the XP chrome CSS into the workbench and adds the bundled XP color theme. |
| `product.json` | RetroCode branding (name, identifiers) merged into the build. |
| `src/stable/resources/darwin/code.icns` | The RetroCode app icon. |
| `build-retrocode/sign-retrocode.mjs` | Code-signing helper (Developer ID + hardened runtime). |
| `build-retrocode/icon/` | Icon source (`icon-source.svg`) and compiled `RetroCode.icns`. |
| `website/index.html` | The download landing page (also served via GitHub Pages). |
| everything else | the standard VSCodium build scripts, unchanged. |

The heavy parts (the Visual Studio Code source, `node_modules`, the built app, the `.dmg`)
are **not** stored here, they are downloaded/produced by the build, exactly like VSCodium.

## Building it yourself

See **`UPDATING.md`** for the full, plain-language recipe. In short, on a Mac with Xcode
command-line tools, Homebrew, and Node 22:

```bash
brew install nvm jq
nvm install 22.22.1 && nvm use 22.22.1
export OS_NAME=osx VSCODE_ARCH=arm64 VSCODE_QUALITY=stable CI_BUILD=no
./get_repo.sh     # pulls the matching VS Code source
./build.sh        # applies patches (incl. patches/user) + branding, compiles
```

The result is `VSCode-darwin-arm64/RetroCode.app`. To sign/notarize and ship, see
**`RELEASING.md`**.

## License & attribution

- RetroCode's own additions (the XP theme, CSS, icon, branding, scripts) are released under
  the **MIT License** © 2026 Adam Markocki.
- Built on **VSCodium** and **Code OSS**, which are MIT-licensed. Upstream license retained
  as `README-upstream-vscodium.md` and `LICENSE`.
- Extensions are installed from the open-source **[Open VSX](https://open-vsx.org)** registry.

RetroCode is an **independent, fan-made project**. It is **not affiliated with, endorsed by,
or sponsored by Microsoft.** "Visual Studio Code", "Windows", and "Windows XP" are trademarks
of Microsoft Corporation; RetroCode is a nostalgic tribute and claims no ownership of them.
