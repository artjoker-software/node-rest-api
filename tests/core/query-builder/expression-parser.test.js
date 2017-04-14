import { assert } from 'chai';
import ExpressionParser from '../../../lib/base/baseDAO/expression-parser';
import EXPRESSION_KEYS from '../../../lib/base/baseDAO/expressions';

describe('Expression parser suite', () => {
  const expressionParser = new ExpressionParser();
  const defaultExpressions = ['Hello', 'Param', 1, {}];
  const inExpressions = ['1,2,3', 'John, Joi , Doe'];
  const likeExpressions = ['(name|Jo)', '( age | 2 )'];
  const fieldName = 'myFieldName';
  const populateParams = '(id=asd, dsa ;$select= internet, wifi , -cookies ;$like=name, Steve , lastname,Coco;$limit=23; $skip=10;$sort=-id , type;)';

  it('parses default expressions', () => {
    for (const expression of defaultExpressions) {
      const parseResult = expressionParser.parseDefaultExpression(expression, fieldName);
      assert.deepEqual(parseResult, { [fieldName]: expression });
    }
  });

  it('parses in expressions', () => {
    for (const expression of inExpressions) {
      const parseResult = expressionParser.parseInExpression(expression, fieldName);
      const parsedExpression = expression.split(',').map(exp => exp.trim());
      assert.deepEqual(parseResult, { [fieldName]: { $in: parsedExpression } });
    }
  });

  it('parses like expression', () => {
    const firstLikeExpressionParseResult = expressionParser.parseLikeExpression(likeExpressions[0]);
    const secondLikeExpressionParseResult = expressionParser.parseLikeExpression(likeExpressions[1]);

    assert.deepEqual(firstLikeExpressionParseResult, { name: { $regex: 'Jo', $options: 'i' } });
    assert.deepEqual(secondLikeExpressionParseResult, { age: { $regex: '2', $options: 'i' } });
  });

  it('parses populate expression', () => {
    const defaultPopulateOptions = expressionParser.parsePopulateParams('path', '');
    assert.deepEqual(defaultPopulateOptions, {
      match: {},
      options: {},
      path: 'path',
      select: '-_id'
    });

    const populateOptions = expressionParser.parsePopulateParams('path', populateParams);
    assert.deepEqual(populateOptions, {
      match: {
        id: { $in: ['asd', 'dsa'] },
        lastname: /Coco/i,
        name: /Steve/i
      },
      options: {
        limit: 23,
        skip: 10,
        sort: '-id type'
      },
      path: 'path',
      select: 'internet wifi -cookies -_id'
    });
  });

  it('parses expression by expression key', () => {
    const parseResult = expressionParser.parse(EXPRESSION_KEYS.IN, inExpressions[0], 'ids');
    assert.deepEqual(parseResult, { ids: { $in: ['1', '2', '3'] } });
  });

  it('parses expression with unknown expression key', () => {
    const parseResult = expressionParser.parse('some-unknown-key', inExpressions[0], 'ids');
    assert.deepEqual(parseResult, { ids: inExpressions[0] });
  });
});
