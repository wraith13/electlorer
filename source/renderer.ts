// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

import { minamo } from "./minamo";
import * as fs from 'fs';

const readDir = async (parent: Element, path: string) => minamo.dom.appendChildren
(
    parent,
    {
        tag: "ul",
        children: (await fs.promises.readdir(path)).map(i => ({ tag: "li", children: i}))
    }
);

const onload = () =>
{
    document.write("🐕");
    minamo.dom.appendChildren(document.body, { tag: "p", children: "Hello, minamo.js!"});
    
    readDir(document.body, "/");
};

onload();