// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

import { minamo } from "./minamo";
import * as fs from 'fs';
import octicons, { Octicon } from "typed-octicons";

let config: any;

const makeSVG = (octicon: Octicon): SVGElement => <SVGElement>minamo.dom.make
(
    {
        tag: "div",
        innerHTML: octicon.toSVG()
    }
).firstChild;

const renderDirs = async (parent: Element, path: string) => minamo.dom.appendChildren
(
    parent,
    {
        tag: "ul",
        className: "dirs",
        children:
        (
            await Promise.all<HTMLLIElement>
            (
                (await fs.promises.readdir(path)).map
                (
                    async i =>
                    {
                        let result = <HTMLLIElement>null;
                        try
                        {
                            const iPath = `${"/" === path ? "": path}/${i}`;
                            const stat = await fs.promises.stat(iPath);
                            if (stat.isDirectory())
                            {
                                const label = <HTMLSpanElement>minamo.dom.make
                                (
                                    {
                                        tag: "span",
                                        children:
                                        [
                                            makeSVG(octicons["file-directory"]),
                                            `${i}`
                                        ]
                                    }
                                );
                                result = <HTMLLIElement>minamo.dom.make
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
                            }
                        }
                        catch(err)
                        {
                            console.error(err);
                        }
                        return result;
                    }
                )
            )
        )
        .filter(i => i)
    }
);

export const onload = async () =>
{
    document.write("🐕");
    minamo.dom.replaceChildren
    (
        document.body,
        [
            {
                tag: "p",
                children: "Hello, minamo.js!"
            },
            makeSVG(octicons.bell)
        ]
    );
    
    renderDirs(document.body, "/");
};

export const setConfig = (json: string) =>
{
    config = JSON.parse(json);
    console.log(`config: ${JSON.stringify(config)}`);
    document.title = config.title;
};
