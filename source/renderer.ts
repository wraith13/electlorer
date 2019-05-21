// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

import { minamo } from "./minamo";
import * as fs from 'fs';

const renderDirs = async (parent: Element, path: string) => minamo.dom.appendChildren
(
    parent,
    {
        tag: "ul",
        class: "dirs",
        children: (await fs.promises.readdir(path)).map
        (
            i =>
            {
                const label = <HTMLSpanElement>minamo.dom.make
                (
                    {
                        tag: "span",
                        children: i,
                        onclick: async () => await renderDirs(result, `${path}/${i}`)
                    }
                );
                const result = <HTMLLIElement>minamo.dom.make
                (
                    {
                        tag: "li",
                        children: label
                    }
                )
                return result;
            }
        )
    }
);

const onload = async () =>
{
    document.write("🐕");
    minamo.dom.appendChildren(document.body, { tag: "p", children: "Hello, minamo.js!"});
    
    renderDirs(document.body, "/");
};

onload();