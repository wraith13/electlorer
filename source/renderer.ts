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
                const iPath = `${"/" === path ? "": path}/${i}`;
                const label = <HTMLSpanElement>minamo.dom.make
                (
                    {
                        tag: "span",
                        children: `[${i}]`
                    }
                );
                const result = <HTMLLIElement>minamo.dom.make
                (
                    {
                        tag: "li",
                        children: label
                    }
                )
                const open = async () =>
                {
                    console.log(`open "${iPath}"`);
                    label.onclick = () => { };
                    await renderDirs(result, iPath);
                    label.onclick = close;
                };
                const close = async () =>
                {
                    console.log(`close "${iPath}"`);
                    minamo.dom.removeChildren(result, child => label !== child);
                    label.onclick = open;
                };
                label.onclick = open;
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