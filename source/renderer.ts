// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

import { minamo } from "./minamo";

document.write("🐕");
minamo.dom.appendChildren(document.body, { tag: "p", children: "Hello, minamo.js!"});
