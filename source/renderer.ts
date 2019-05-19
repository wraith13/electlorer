// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

import { minamo } from "./minamo";
import * as fs from 'fs';

module fx
{
    export const readdir = (path : string) : Promise<{ error : NodeJS.ErrnoException, files : string[] }> =>
        new Promise
        (
            resolve => fs.readdir
            (
                path,
                (error : NodeJS.ErrnoException, files : string[]) => resolve
                (
                    {
                        error,
                        files
                    }
                )
            )
        );

    export const exists = (path : string) : Promise<boolean> =>  new Promise
    (
        resolve => fs.exists
        (
            path,
            exists => resolve(exists)
        )
    );

    export const readFile = (path : string) : Promise<{ err : NodeJS.ErrnoException, data : Buffer }> =>
        new Promise
        (
            resolve => fs.readFile
            (
                path,
                (err : NodeJS.ErrnoException, data : Buffer) => resolve({ err, data })
            )
        );
}

document.write("🐕");
minamo.dom.appendChildren(document.body, { tag: "p", children: "Hello, minamo.js!"});

const readDir = async (parent: Element, path: string) => minamo.dom.appendChildren
(
    parent,
    {
        tag: "ul",
        children: (await fx.readdir(path)).files.map(i => ({ tag: "li", children: i}))
    }
);

readDir(document.body, "/");

