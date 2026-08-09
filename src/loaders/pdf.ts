import fs from "node:fs/promises";
import type { Document } from "../core/document.js";
import { BaseLoader } from "../core/base-loader.js";

export class PDFLoader extends BaseLoader {
  constructor(private filePath: string) {
    super();
  }

  async load(): Promise<Document[]> {
    const { PDFParse } = await import("pdf-parse");

    const buffer = await fs.readFile(this.filePath);

    const parser = new PDFParse({
      data: buffer
    });

    const result = await parser.getText();

    const document: Document = {
      pageContent: result.text,

      metadata: {
        source: this.filePath
      }
    };

    await parser.destroy();

    return [document];
  }
}