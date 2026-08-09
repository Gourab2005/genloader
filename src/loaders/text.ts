import fs from "node:fs/promises";

import { BaseLoader } from "../core/base-loader.js";
import type { Document } from "../core/document.js";

export class TextLoader extends BaseLoader {

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

    const document: Document = {
      pageContent: text,

      metadata: {
        source: this.filePath
      }
    };

    return [document];
  }
}