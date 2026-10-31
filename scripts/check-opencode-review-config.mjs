import { appendFileSync } from 'node:fs';

const configured = Boolean(process.env.ANTHROPIC_API_KEY?.trim());
const output = `configured=${configured ? 'true' : 'false'}\n`;

if (process.env.GITHUB_OUTPUT) {
  appendFileSync(process.env.GITHUB_OUTPUT, output, 'utf8');
}

if (configured) {
  console.log('OpenCode review provider is configured.');
} else {
  console.log('::warning::Skipping optional OpenCode review: ANTHROPIC_API_KEY is not configured.');
}
