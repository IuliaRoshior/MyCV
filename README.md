# IuliaRoshior Portfolio

A refined version of the original terminal-inspired portfolio. The design, project destinations, dark palette, pixel-art details and interactive sections have been preserved.

## Installation

1. Replace the existing `index.html`, `style.css` and `script.js` in the site root with these files.
2. Keep the existing `assets/` directory in place. It was **not** included in the source files provided for this update.
3. Publish the files together using your existing hosting setup.

## Required existing assets

- `assets/icons/web.svg`
- `assets/icons/figma.svg`
- `assets/icons/photoshop.svg`
- `assets/icons/restoration.svg`
- `assets/pdf/Calendario.PDF`
- `assets/pdf/PhotoBookSea.PDF`
- `assets/pdf/PhotoBookElvira.PDF`
- Photo pairs under `assets/restoration/Before/` and `assets/restoration/After/`

PDF links and image assets were preserved from the provided HTML. Their existence and public accessibility cannot be verified from the three source files alone. Check exact filenames and capitalization on your host. Large PDF files may need to be optimized or hosted separately to comply with GitHub's file-size limits.

## Restoration gallery

Name photos with numeric filenames, starting at `1`, for example:

```text
assets/restoration/Before/1.jpg
assets/restoration/After/1.png
assets/restoration/Before/2.webp
assets/restoration/After/2.webp
```

Images in a pair may use different supported extensions: JPG, JPEG, PNG or WebP. A gap of one or two numbers is allowed. Scanning stops after three consecutive missing pairs, or after index 100. These values can be adjusted in `script.js`.

## Terminal commands

Open the fixed launcher at the bottom right. Type `help`, `whoami`, `pwd`, `ls`, `ls ~/skills`, `cat /about/me`, `sudo hire-me`, `clear` or `exit`. Click outside or press Escape to close the terminal.

## Accessibility and maintenance

- Functional anchors, properly labeled buttons, visible keyboard focus and accessible accordion states.
- Improved text contrast, increased small type and readable touch targets.
- Reduced-motion support and responsive layouts.
- Clear English comments, consolidated CSS and no framework dependencies.
