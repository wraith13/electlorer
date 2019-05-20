// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

import { minamo } from "./minamo";
import * as fs from 'fs';

const renderDirs = async (parent: Element, dirs: string[]) => minamo.dom.appendChildren
(
    parent,
    {
        tag: "ul",
        class: "dirs",
        children: dirs.map(i => ({ tag: "li", children: i}))
    }
);

const onload = async () =>
{
    document.write("🐕");
    minamo.dom.appendChildren(document.body, { tag: "p", children: "Hello, minamo.js!"});
    
    renderDirs(document.body, await fs.promises.readdir("/"));
};

onload();