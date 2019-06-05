// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

import { minamo } from "./minamo";
import * as fs from 'fs';
import octicons, { Octicon } from "typed-octicons";

let config: any;

const makeOcticonSVG = (octicon: Octicon | keyof typeof octicons) => <SVGElement>minamo.dom.make
({
    outerHTML:
        (
            "string" === typeof octicon ?
            octicons[octicon]:
            octicon
        )
        .toSVG()
});

const renderDir = async (path: string): Promise<HTMLLIElement> =>
{
    let result = <HTMLLIElement>null;
    const name = path.replace(/.*\/([^\/]+)/, "$1")
    try
    {
        const stat = await fs.promises.stat(path);
        if (stat.isDirectory())
        {
            const label = minamo.dom.make(HTMLSpanElement)
            ({
                children:
                [
                    makeOcticonSVG("file-directory"),
                    `${name}`
                ]
            });
            result = minamo.dom.make(HTMLLIElement)
            ({
                children: label
            });
            const open = async () =>
            {
                console.log(`open "${path}"`);
                label.onclick = () => { };
                await renderDirs(result, path);
                label.onclick = close;
            };
            const close = async () =>
            {
                console.log(`close "${path}"`);
                minamo.dom.removeChildren(result, child => label !== child);
                label.onclick = open;
            };
            label.onclick = open;
        }
        else
        {
            //  file...
        }
    }
    catch(err)
    {
        console.error(err);
        const label = minamo.dom.make(HTMLSpanElement)
        ({
            children:
            [
                makeOcticonSVG("circle-slash"),
                `${name}`
            ]
        });
        result = minamo.dom.make(HTMLLIElement)
        ({
            children: label
        });
    }
    return result;
}
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
                    async i => await renderDir(`${"/" === path ? "": path}/${i}`)
                )
            )
        )
        .filter(i => i)
    }
);

export const onload = async () =>
{
    minamo.dom.replaceChildren
    (
        document.body,
        [
            {
                tag: "p",
                children: "Hello, minamo.js!"
            },
            makeOcticonSVG("bell")
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
