import fs from "node:fs/promises";

import type { Document } from "../core/document.js";
import { BaseLoader } from "../core/base-loader.js";

export class DocxLoader extends BaseLoader {

  constructor(
    private filePath: string
  ) {
    super();
  }

  async load(): Promise<Document[]> {

    const mammoth = await import("mammoth");

    const buffer = await fs.readFile(this.filePath);

    const result = await mammoth.extractRawText({
      buffer
    });

    const document: Document = {
      pageContent: result.value,

      metadata: {
        source: this.filePath
      }
    };

    return [document];
  }
}