# genloader

Lightweight document loaders for TypeScript and JavaScript GenAI applications.

Use `genloader` when you need to turn local files or web pages into a common document shape that can be passed into retrieval, indexing, chunking, or prompt-building workflows.

## Install

```bash
npm install genloader
```

## Requirements

- Node.js 20 or newer
- TypeScript or modern JavaScript with ESM support

## What It Exports

The package exposes a shared document type, a base loader, and one loader per supported source type.

```ts
import {
	BaseLoader,
	CSVLoader,
	DocxLoader,
	JSONLoader,
	PDFLoader,
	TextLoader,
	WebLoader,
	type Document
} from "genloader";
```

## Common Document Shape

Every loader returns a `Promise<Document[]>`. Each document has the same shape:

```ts
interface Document {
	pageContent: string;
	metadata: Record<string, any>;
}
```

`pageContent` contains the extracted text. `metadata` includes source information and, for some loaders, extra context such as row numbers.

## Loader Overview

### `BaseLoader`

`BaseLoader` is the abstract class that all loaders extend. It defines one method:

- `load(): Promise<Document[]>`

You normally do not instantiate `BaseLoader` directly. It exists so you can build your own loaders that follow the same contract.

### `TextLoader`

Reads a plain text file from disk.

Constructor:

- `new TextLoader(filePath: string)`

Use cases:

- Load notes, transcripts, logs, or markdown files into a RAG pipeline
- Read simple text fixtures or knowledge-base content

Example:

```ts
import { TextLoader } from "genloader";

const loader = new TextLoader("./data.txt");
const documents = await loader.load();

console.log(documents[0].pageContent);
```

### `PDFLoader`

Extracts text from a PDF file.

Constructor:

- `new PDFLoader(filePath: string)`

Use cases:

- Ingest reports, manuals, invoices, or research papers
- Build searchable knowledge bases from PDF collections

Example:

```ts
import { PDFLoader } from "genloader";

const loader = new PDFLoader("./docs/report.pdf");
const documents = await loader.load();
```

### `DocxLoader`

Extracts raw text from a Word document.

Constructor:

- `new DocxLoader(filePath: string)`

Use cases:

- Convert business docs, proposals, and meeting notes into text
- Index internal documents for semantic search

Example:

```ts
import { DocxLoader } from "genloader";

const loader = new DocxLoader("./docs/specification.docx");
const documents = await loader.load();
```

### `CSVLoader`

Reads a CSV file and converts each row into its own document.

Constructor:

- `new CSVLoader(filePath: string)`

Use cases:

- Turn structured rows into individual records for retrieval
- Load product catalogs, datasets, or event logs row by row

Behavior:

- Uses the first row as column headers
- Returns one `Document` per row
- Adds `metadata.row` so you can trace the source row

Example:

```ts
import { CSVLoader } from "genloader";

const loader = new CSVLoader("./data/products.csv");
const documents = await loader.load();

console.log(documents[0].metadata.row);
```

### `JSONLoader`

Reads a JSON file and returns the formatted JSON string as a document.

Constructor:

- `new JSONLoader(filePath: string)`

Use cases:

- Load configuration files, API responses, or structured content
- Preserve nested JSON in a readable text form for LLM workflows

Example:

```ts
import { JSONLoader } from "genloader";

const loader = new JSONLoader("./data/config.json");
const documents = await loader.load();
```

### `WebLoader`

Fetches a web page, strips script/style/noscript tags, and returns readable page text.

Constructor:

- `new WebLoader(url: string)`

Use cases:

- Extract documentation pages, articles, and public knowledge base content
- Build crawlers or one-off scrapers for text-focused ingestion

Example:

```ts
import { WebLoader } from "genloader";

const loader = new WebLoader("https://example.com/docs");
const documents = await loader.load();
```

## Quick Start

```ts
import { TextLoader } from "genloader";

async function main() {
	const loader = new TextLoader("./data.txt");
	const documents = await loader.load();

	for (const document of documents) {
		console.log(document.metadata);
		console.log(document.pageContent);
	}
}

main().catch(console.error);
```

## Typical Use Cases

- RAG pipelines that need to convert source files into text chunks
- Semantic search over PDFs, Word docs, CSVs, JSON, and web pages
- Data preparation before embedding, summarization, or classification
- Simple ingestion scripts for local folders or external docs

## Notes

- Each loader returns plain text, not embeddings or chunks
- If you need custom behavior, extend `BaseLoader` and implement `load()`
- The package uses ESM imports

## Example Output

```ts
[
	{
		pageContent: "...",
		metadata: {
			source: "./data.txt"
		}
	}
]
```

For CSV input, each row becomes a separate document and includes the row number in metadata.
