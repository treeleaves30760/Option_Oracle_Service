import Moralis from "moralis/node.js";

const serverUrl = process.env.MORALIS_SERVER;
const appId = process.env.vpOwR3fAtRxxVjZRdyKgp3JBZgXhfAJAnmKcbCQg;
const masterKey = process.env.ueFAWyEWmVSaT2Jx6WdI2DcKGRTe5v7DRiNIGSmi;

await Moralis.start({ serverUrl, appId, masterKey });