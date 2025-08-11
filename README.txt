LUVO site - quick run notes
Files:
  - index.html
  - style.css
  - script.js

Open index.html in a browser (no server required).
If you push to GitHub Pages, it will work as-is.

To tweak performance:
  - In script.js change 'particleCount' logic downwards.
  - Reduce maxLinkDistance to reduce line drawing CPU.
  - On slow devices, reduce DPR use by clamping DPR = 1.

To change fonts:
  - Edit <link> in index.html (Google Fonts).
To change camera size or behavior:
  - modify generateCameraPoints() and the setFormationAt(...) calls.
