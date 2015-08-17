Simple diagram webservice
==========================

#### Description
`http://dev.ehouais.net/webviews/diagram?datauri=...` returns a web page with javascript that generates a diagram on the client, based on the data fetched using the "datauri" query parameter. This parameter must be a URI that either uses the "data:" scheme (data is contained within the URI) or points to a resource returned with proper [CORS](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing) headers to allow cross-origin sharing.
  * vector graphics (using [Snap.svg](http://snapsvg.io/) javascript library to generate SVG)
  * responsive (the diagram dimensions adapts to the room available)

#### Syntax diagram
![syntax diagram]())

#### Examples (using data: URIs)

  * [Science fiction writers]()
