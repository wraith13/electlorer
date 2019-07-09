// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

import { minamo } from "./minamo";
import * as fs from 'fs';
import octicons, { Octicon } from "typed-octicons";
import * as os from "os";
//import * as child_process from "child_process";
import wmic from "@wraith13/wmic";

let config: any;

const isWindows = "win32" === os.platform();

const getWindowsDrives = async () => (await wmic("logicaldisk")).map(i => i.Name);

const makeOcticonSVG = (octicon: Octicon | keyof typeof octicons) => <SVGElement>minamo.dom.make
({
    outerHTML:
        (
            "string" === typeof octicon ?
            octicons[octicon]:
            octicon
        )
        .toSVG()
        .replace(/ width=\"(.*?)\" /, " ")
        .replace(/ height=\"(.*?)\" /, " ")
});

const renderDir = async (path: string): Promise<HTMLLIElement> =>
{
    let result = <HTMLLIElement>null;
    const name = path.replace(/.*\/([^\/]+)/, "$1");
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
                minamo.dom.appendChildren
                (
                    result,
                    await renderDirs(path)
                );
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
};
const renderDirs = async (path: string) =>
({
    tag: "ul",
    className: "dirs",
    children:
    (
        await Promise.all<HTMLLIElement>
        (
            (await fs.promises.readdir(path)).map
            (
                async i => await renderDir(`${path.replace(/\/$/, "")}/${i}`)
            )
        )
    )
    .filter(i => i)
});

const renderRoot = async () => isWindows ?
{
    tag: "ul",
    className: "drives",
    children:
    (
        await Promise.all<HTMLLIElement>
        (
            (await getWindowsDrives()).map
            (
                async i => await renderDir(`${i}/`)
            )
        )
    )
    .filter(i => i)
}:
await renderDirs("/");

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
            makeOcticonSVG("bell"),
            await renderRoot()
            //await renderDirs("/")
        ]
    );

    console.log(`isWindows: ${isWindows}`);
    console.log(`getWindowsDrives: ${JSON.stringify(await getWindowsDrives())}`);
};

export const setConfig = (json: string) =>
{
    config = JSON.parse(json);
    console.log(`config: ${JSON.stringify(config)}`);
    document.title = config.title;
};
