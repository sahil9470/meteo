var Scanner = HTML._$.Scanner;
var getComment = HTML._$.getComment;
var getDoctype = HTML._$.getDoctype;

Tinytest.add("html - comments", function (test) {
  var succeed = function (input, content) {
    var scanner = new Scanner(input);
    var result = getComment(scanner);
    test.isTrue(result);
    test.equal(scanner.pos, content.length + 7);
    test.equal(result, {
      t: 'Comment',
      v: content
    });
  };

  var ignore = function (input) {
    var scanner = new Scanner(input);
    var result = getComment(scanner);;
    test.isFalse(result);
    test.equal(scanner.pos, 0);
  };

  var fatal = function (input, messageContains) {
    var scanner = new Scanner(input);
    var error;
    try {
      getComment(scanner);
    } catch (e) {
      error = e;
    }
    test.isTrue(error);
    if (error)
      test.isTrue(messageContains && error.message.indexOf(messageContains) >= 0, error.message);
  };

  ignore("<!DOCTYPE>");
  ignore("<!-a");
  ignore("<--");
  ignore("<!");
  ignore("abc");
  ignore("<a");

  fatal('<!--', 'Unclosed');
  fatal('<!---', 'Unclosed');
  fatal('<!----', 'Unclosed');
  fatal('<!-- -', 'Unclosed');
  fatal('<!-- --', 'Unclosed');
  fatal('<!-- -- abcd', 'Unclosed');
  fatal('<!-- ->', 'Unclosed');
  fatal('<!-- a--b -->', 'cannot contain');
  fatal('<!--x--->', 'must end at first');

  fatal('<!-- a\u0000b -->', 'cannot contain');
  fatal('<!--\u0000 x-->', 'cannot contain');

  succeed('<!---->', '');
  succeed('<!---x-->', '-x');
  succeed('<!--x-->', 'x');
  succeed('<!-- hello - - world -->', ' hello - - world ');
});

Tinytest.add("html - doctype", function (test) {
  var succeed = function (input, expectedProps) {
    var scanner = new Scanner(input);
    var result = getDoctype(scanner);
    test.isTrue(result);
    test.equal(scanner.pos, result.v.length);
    test.equal(input.slice(0, result.v.length), result.v);
    var actualProps = _.extend({}, result);
    delete actualProps.t;
    delete actualProps.v;
    test.equal(actualProps, expectedProps);
  };

  var fatal = function (input, messageContains) {
    var scanner = new Scanner(input);
    var error;
    try {
      getDoctype(scanner);
    } catch (e) {
      error = e;
    }
    test.isTrue(error);
    if (error)
      test.isTrue(messageContains && error.message.indexOf(messageContains) >= 0, error.message);
  };

  succeed('<!DOCTYPE html>', {name: 'html'});
  succeed('<!DOCTYPE htML>', {name: 'html'});
  succeed('<!DOCTYPE HTML>', {name: 'html'});
  fatal('<!DOCTYPE', 'Expected space');
  fatal('<!DOCTYPE ', 'Malformed DOCTYPE');
  fatal('<!DOCTYPE  ', 'Malformed DOCTYPE');
  fatal('<!DOCTYPE>', 'Expected space');
  fatal('<!DOCTYPE >', 'Malformed DOCTYPE');
  fatal('<!DOCTYPE\u0000', 'Expected space');
  fatal('<!DOCTYPE \u0000', 'Malformed DOCTYPE');
  fatal('<!DOCTYPE html\u0000>', 'Malformed DOCTYPE');
  fatal('<!DOCTYPE html', 'Malformed DOCTYPE');
  succeed('<!DOCTYPE html \u000c>', {name: 'html'});

});