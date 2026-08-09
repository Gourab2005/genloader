import fs from "node:fs/promises";
import { parse } from "csv-parse/sync";

import type { Document } from "../core/document.js";
import { BaseLoader } from "../core/base-loader.js";

export class CSVLoader extends BaseLoader {
  constructor(private filePath: string) {
    super();
  }

  async load(): Promise<Document[]> {
    const text = await fs.readFile(this.filePath, "utf-8");

    const rows = parse<Record<string, string>>(text, {
      columns: true,
      skip_empty_lines: true
    });

    return rows.map((row, index) => {
      return {
        pageContent: Object.entries(row)
          .map(([key, value]) => `${key}: ${value}`)
          .join("\n"),

        metadata: {
          source: this.filePath,
          row: index + 1
        }
      };
    });
  }
}