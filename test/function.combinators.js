$(document).ready(function() {

  module("underscore.function.combinators");

  test("always", function() {
    equal(_.always(42)(10000), 42, 'should return a function that always returns the same value');
    equal(_.always(42)(1,2,3), 42, 'should return a function that always returns the same value');
    deepEqual(_.map([1,2,3], _.always(42)), [42,42,42], 'should return a function that always returns the same value');
  });

  test("pipeline", function() {
    var run = _.pipeline(function(n) { return -n; }, function(n) { return "" + n; });
    equal(run(42), "-42", 'should apply a series of functions to an initial value');
  });

  test("conjoin", function() {
    var isPositiveEven = _.conjoin(function(x) { return x > 0; }, function(x) { return (x & 1) === 0; });

    equal(isPositiveEven([2,4,6,8]), true, 'should recognize when all elements satisfy a conjunction');
    equal(isPositiveEven([2,4,6,7,8]), false, 'should recognize when an element fails to satisfy a conjunction');
  });

  test("disjoin", function() {
    var orPositiveEven = _.disjoin(function(x) { return x > 0; }, function(x) { return (x & 1) === 0; });

    equal(orPositiveEven([-1,2,3,4,5,6]), true, 'should recognize when all elements satisfy a disjunction');
    equal(orPositiveEven([-1,-3]), false, 'should recognize when an element fails to satisfy a disjunction');
  });

  test("comparator", function() {
    var lessOrEqual = function(x, y) { return x <= y; };
    var a = [0, 1, -2];
    var b = [100, 1, 0, 10, -1, -2, -1];

    deepEqual(a.sort(_.comparator(lessOrEqual)), [-2, 0, 1], 'should return a function to convert a predicate to a comparator');
    deepEqual(b.sort(_.comparator(lessOrEqual)), [-2, -1, -1, 0, 1, 10, 100], 'should return a function to convert a predicate to a comparator');
  });

  test("complement", function() {
    var notOdd = _.complement(function(n) { return (n & 1) === 1; });

    equal(notOdd(2), true, 'should return a function that is the opposite of the function given');
    equal(notOdd(3), false, 'should return a function that is the opposite of the function given');
  });

  test("unsplat", function() {
    var echo  = _.unsplat(function (args) { return args; }),
        echo2 = _.unsplat(function (first, rest) { return [first, rest]; }),
        echo3 = _.unsplat(function (first, second, rest) { return [first, second, rest]; }),
        undefined = void 0;

    deepEqual(echo(), [], 'should return no arguments');
    deepEqual(echo(1), [1], 'should return the arguments provded');
    deepEqual(echo(1,2), [1,2], 'should return the arguments provded');
    deepEqual(echo(1,2,3), [1,2,3], 'should return the arguments provded');

    deepEqual(echo2(), [undefined, []], 'should return no arguments');
    deepEqual(echo2(1), [1, []], 'should return the arguments provded');
    deepEqual(echo2(1,2), [1,[2]], 'should return the arguments provded');
    deepEqual(echo2(1,2,3), [1,[2,3]], 'should return the arguments provded');
    deepEqual(echo2(1,2,3,4), [1,[2,3,4]], 'should return the arguments provded');

    deepEqual(echo3(), [undefined, undefined, []], 'should return no arguments');
    deepEqual(echo3(1), [1, undefined, []], 'should return the arguments provded');
    deepEqual(echo3(1,2), [1,2,[]], 'should return the arguments provded');
    deepEqual(echo3(1,2,3), [1,2,[3]], 'should return the arguments provded');
    deepEqual(echo3(1,2,3,4), [1,2,[3,4]], 'should return the arguments provded');
  });

  test("unsplatl", function() {
    var echo  = _.unsplatl(function (args) { return args; }),
        echo2 = _.unsplatl(function (rest, ultimate) { return [rest, ultimate]; }),
        echo3 = _.unsplatl(function (rest, penultimate, ultimate) { return [rest, penultimate, ultimate]; }),
        undefined = void 0;

    deepEqual(echo(), [], 'should return no arguments');
    deepEqual(echo(1), [1], 'should return the arguments provded');
    deepEqual(echo(1,2), [1,2], 'should return the arguments provded');
    deepEqual(echo(1,2,3), [1,2,3], 'should return the arguments provded');

    deepEqual(echo2(), [[], undefined], 'should return no arguments');
    deepEqual(echo2(1), [[], 1], 'should return the arguments provded');
    deepEqual(echo2(1,2), [[1], 2], 'should return the arguments provded');
    deepEqual(echo2(1,2,3), [[1, 2], 3], 'should return the arguments provded');
    deepEqual(echo2(1,2,3,4), [[1, 2, 3], 4], 'should return the arguments provded');

    deepEqual(echo3(), [[], undefined, undefined], 'should return no arguments');
    deepEqual(echo3(1), [[], 1, undefined], 'should return the arguments provded');
    deepEqual(echo3(1,2), [[], 1, 2], 'should return the arguments provded');
    deepEqual(echo3(1,2,3), [[1], 2, 3], 'should return the arguments provded');
    deepEqual(echo3(1,2,3,4), [[1, 2], 3, 4], 'should return the arguments provded');
  });

  test("flip2", function() {
    var div = function(n, d) { return n/d; };

    equal(_.flip2(div)(10,2), 0.2, 'should return a function that flips the first two args to a function');
  });

  test("flip", function() {
    var echo = function() { return Array.prototype.slice.call(arguments, 0); };

    deepEqual(_.flip(echo)(1, 2, 3, 4), [4, 3, 2, 1], 'should return a function that flips the first three or more args to a function');
  });

  test("fnull", function() {
    var a = [1,2,3,null,5];
    var b = [1,2,3,undefined,5];
    var safeMult = _.fnull(function(total, n) { return total * n; }, 1, 1);

    equal(_.reduce([1,2,3,5], safeMult), 30, 'should not fill in defaults when not needed');
    equal(_.reduce(a, safeMult), 30, 'should fill in defaults for null');
    equal(_.reduce(b, safeMult), 30, 'should fill in defaults for undefined');
  });

  test("juxt", function() {
    var run = _.juxt(function(s) { return s.length; }, parseInt, _.always(108));

    deepEqual(run('42'), [2, 42, 108], 'should return a function that returns an array of the originally supplied functions called');
  });

  test("accessor", function() {
    var f = _.accessor('a');

    equal(f({a: 42}), 42, 'should retrieve a pluckable field');
    equal(f({z: 42}), undefined, 'should fail to retrieve a field if not there');
  });
});
