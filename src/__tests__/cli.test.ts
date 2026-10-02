import { run, parseRules } from '../cli';

function exec(args: string[]) {
  const out: string[] = [];
  const err: string[] = [];
  const code = run(
    args,
    (l) => out.push(l),
    (l) => err.push(l),
  );
  return { code, out, err };
}

test('prints all permutations one per line', () => {
  const { code, out } = exec(['a', 'b', 'c']);
  expect(code).toBe(0);
  expect(out.length).toBe(6);
  expect(out[0]).toBe('a b c');
});

test('applies --only and --not like choices/nonChoices', () => {
  const { out } = exec(['a', 'b', 'c', '--only', '1=a,b', '--not', '0=a']);
  expect(out).toEqual(['b a c', 'c a b', 'c b a']);
});

test('--limit stops early', () => {
  expect(exec(['a', 'b', 'c', '--limit', '2']).out.length).toBe(2);
});

test('--format json prints a single array', () => {
  const { out } = exec(['a', 'b', '--format', 'json']);
  expect(JSON.parse(out[0])).toEqual([
    ['a', 'b'],
    ['b', 'a'],
  ]);
});

test('--format csv quotes values when needed', () => {
  const { out } = exec(['x,y', 'z', '--format', 'csv', '--limit', '1']);
  expect(out).toEqual(['"x,y",z']);
});

test('--help prints usage and exits 0', () => {
  const { code, out } = exec(['--help']);
  expect(code).toBe(0);
  expect(out[0]).toMatch(/^Usage/);
});

test.each([[[]], [['a', '--only', 'bad']], [['a', '--format', 'xml']], [['a', '--limit', 'x']], [['a', '--wat']]])(
  'invalid input %j exits 1',
  (args) => {
    const { code, err } = exec(args as string[]);
    expect(code).toBe(1);
    expect(err.length).toBeGreaterThan(0);
  },
);

test('parseRules merges repeated positions', () => {
  expect(parseRules(['0=a', '0=b,c'])).toEqual({ 0: ['a', 'b', 'c'] });
});
