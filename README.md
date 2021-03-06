# Custom Permutation Generator

```typescript
CustomPermutation(elList:[els...], choices:{ index: [els...]] }, nonChoices:{ index: [els...]] })
```

_example:_\
`CustomPermutation(['a', 'b', 'c'], {1: ['a', 'b']}, {0: ['a']})`

Permutate 3 elements which are 'a', 'b' and 'c' with below rules

__1. choices rule:__ `{ 1: ['a', 'b'] }`

    At index=1 there can be just 'a' or 'b'

__2. nonChoices rule:__ `{ 0: ['a'] }`

    At index=0 there can NOT be element 'a'

_Note: given index are considered as 0 based: [index=0, index=1, etc]_

__Result set:__

Let's see all permutations, and which ones are valid or not.
- `['a', 'b', 'c']` : violates nonChoices rule: _first element is `'a'`, but shouldn't be `'a'`
- `['a', 'c', 'b']` : violates nonChoices rule: _first element is `'a'`, but shouldn't be `'a'`_
- `['b', 'a', 'c']` : ok
- `['b', 'c', 'a']` : violates choices rule: _second element is `'c'` but `'a'` or `'b'` is desired_
- `['c', 'a', 'b']` : ok
- `['c', 'b', 'a']` : ok

So there are just 3 results that should be generated with this parameters.
```javascript
    let customPerm = new CustomPermutation(['a', 'b', 'c'], { 1: ['a', 'b'] }, { 0: ['a'] });
    let gen = customPerm.generator();
    while (true) {
        let next = gen.next();
        if (next.done) {
            break;
        }
        console.log(next.value)
    }

```
or
```javascript
    let customPerm = new CustomPermutation(['a', 'b', 'c'], { 1: ['a', 'b'] }, { 0: ['a'] });
    while (true) {
        let next = customPerm.next();
        if (!next) {
            break;
        }
        console.log(next)
    }
```

__Console__\
['b', 'a', 'c']\
['c', 'a', 'b']\
['c', 'b', 'a']