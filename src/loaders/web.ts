import * as cheerio from "cheerio";
import { BaseLoader } from "../core/base-loader.js";
import type { Document } from "../core/document.js";


export class WebLoader extends BaseLoader {

  constructor(
    private url: string
  ) {
    super();
  }

  async load(): Promise<Document[]> {

    const response = await fetch(this.url);

    if (!response.ok) {
      throw new Error(
        `Failed to load ${this.url}: ${response.status}`
      );
    }

    const html = await response.text();

    const $ = cheerio.load(html);

    $("script").remove();
    $("style").remove();
    $("noscript").remove();

    const text = $("body").text()
      .replace(/\s+/g, " ")
      .trim();

    const document: Document = {
      pageContent: text,

      metadata: {
        source: this.url
      }
    };

    return [document];
  }
}