import fs from "node:fs/promises";
import { BaseLoader } from "../core/base-loader.js";
import type { Document } from "../core/document.js";



export class JSONLoader extends BaseLoader {

  constructor(
    private filePath: string
  ) {
    super();
  }

  async load(): Promise<Document[]> {

    const text = await fs.readFile(
      this.filePath,
      "utf-8"
    );

    const data = JSON.parse(text);

    const document: Document = {
      pageContent: JSON.stringify(
        data,
        null,
        2
      ),

      metadata: {
        source: this.filePath
      }
    };

    return [document];
  }
}