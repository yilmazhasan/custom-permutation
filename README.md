# Custom Permutation Generator

```typescript
CustomPermutation(elList: array, choices: { index: array }, nonChoices: { index: array })
```

_example:_ `CustomPermutation(['a', 'b', 'c'], {1: ['a', 'b']}, {0: ['a']})`

_Meaning:_ Permutate 3 elements which are 'a', 'b' and 'c' with below rules

__choices rule: {1: ['a', 'b']}__   For index=1 there can be just 'a' and 'b'
__nonChoices rule: {0: ['a']}__     For index=0 ther can not be element 'a'

_Note: given index are considered as 0 based: [index=0, index=1, etc]_

What result to be expected in this case:

Let's see all permutations, and which ones are valid and not.
- a, b, c : violates nonChoices rule: _first element is 'a', but shouldn't be 'a'_
- a, c, b : violates nonChoices rule: _first element is 'a', but shouldn't be 'a'_
- b, a, c : ok
- b, c, a : violates choices rule: _second element is 'c' but 'a' or 'b' is desired_
- c, a, b : ok
- c, b, a : ok

So there is just 3 result should be generated for this parameters.

```javascript
    let customPerm = new CustomPermutation(['a', 'b', 'c'], { 1: ['a', 'b'] }, { 0: ['a'] });
    let next;
    while (true) {
        next = customPerm.customPermGen.next();
        console.log(next);
        if (!next) {
            break;
        }
    }
```

__Console__
['b', 'a', 'c']
['c', 'a', 'b']
['c', 'b', 'a']