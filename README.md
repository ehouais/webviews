#Simple data visualization web services

This project provides simple tools to generate web data visualizations.
Each tool consists of an HTML page with embedded CSS and javascript.
The javascript fetch the data according to the provided `datauri` query parameter, either from the parameter itself if it uses the `data:` scheme, or from a remote [CORS](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)-enabled HTTP server, if the parameter is a classic `http:` URI.
Then it processes the data to generate a responsive visualization on the client side, usually using vector graphics libraries such as [d3.js](http://d3js.org) or [Snap.svg](http://snapsvg.io).

Examples:

Being static files, the project resources can be used directly from this Github repository (for small volumetry).
Static data can be embedded into the `datauri` query parameter, according to each tool specified input data.
This means that for simple needs, you don't have to host anything, neither the logic nor the data. All you need is to build up a valid URI and use it in an embedded `<iframe>`.

This is very much similar to the way ancient Google charts worked, but with embedded vector graphics instead of bitmaps.

Available tools:
  * Bar chart
  * Pie chart
  * Timeline
  * Diagram
