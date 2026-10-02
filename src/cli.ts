#!/usr/bin/env node
import { parseArgs } from 'util';
import CustomPermutation from './CustomPermutation';

const USAGE = `Usage: custom-permutation <elements...> [options]

Options:
  --only <pos>=<a,b>   Position <pos> may only hold the given elements (repeatable)
  --not <pos>=<a,b>    Position <pos> may not hold the given elements (repeatable)
  --limit <n>          Stop after n permutations
  --format <fmt>       Output format: lines (default), json, csv
  -h, --help           Show this help

Example:
  custom-permutation a b c --only 1=a,b --not 0=a`;

// Parses repeated "pos=a,b" rules into { pos: ['a', 'b'] }
export function parseRules(rules: string[] = []): Record<number, string[]> {
  const result: Record<number, string[]> = {};
  for (const rule of rules) {
    const match = /^(\d+)=(.+)$/.exec(rule);
    if (!match) {
      throw new Error(`Invalid rule "${rule}", expected <pos>=<a,b>`);
    }
    const pos = Number(match[1]);
    result[pos] = (result[pos] || []).concat(match[2].split(','));
  }
  return result;
}

function format(perm: string[], fmt: string): string {
  if (fmt === 'csv') return perm.map((x) => (/[",\n]/.test(x) ? `"${x.replace(/"/g, '""')}"` : x)).join(',');
  return perm.join(' ');
}

// Returns the process exit code; output goes through the given writers for testability
export function run(
  argv: string[],
  out: (line: string) => void = (l) => process.stdout.write(l + '\n'),
  err: (line: string) => void = (l) => process.stderr.write(l + '\n'),
): number {
  let parsed;
  try {
    parsed = parseArgs({
      args: argv,
      allowPositionals: true,
      options: {
        only: { type: 'string', multiple: true },
        not: { type: 'string', multiple: true },
        limit: { type: 'string' },
        format: { type: 'string', default: 'lines' },
        help: { type: 'boolean', short: 'h' },
      },
    });
  } catch (e) {
    err((e as Error).message);
    err(USAGE);
    return 1;
  }

  const { values, positionals } = parsed;
  if (values.help || positionals.length === 0) {
    (values.help ? out : err)(USAGE);
    return values.help ? 0 : 1;
  }

  const fmt = values.format as string;
  const limit = values.limit === undefined ? Infinity : Number(values.limit);
  if (!['lines', 'json', 'csv'].includes(fmt) || !(limit >= 0)) {
    err(`Invalid --format or --limit`);
    return 1;
  }

  let only: Record<number, string[]>;
  let not: Record<number, string[]>;
  try {
    only = parseRules(values.only);
    not = parseRules(values.not);
  } catch (e) {
    err((e as Error).message);
    return 1;
  }

  const perms: string[][] = [];
  let count = 0;
  const cp = new CustomPermutation(positionals, only, not);
  for (const perm of cp.generator()) {
    if (count++ >= limit) break;
    if (fmt === 'json') perms.push(perm);
    else out(format(perm, fmt));
  }
  if (fmt === 'json') out(JSON.stringify(perms));
  return 0;
}

if (require.main === module) {
  process.exitCode = run(process.argv.slice(2));
}
