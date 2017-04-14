import { assert } from 'chai';
import ExpressionAnalyzer from '../../../lib/base/baseDAO/expression-analyzer';
import EXPRESSION_KEYS from '../../../lib/base/baseDAO/expressions';

describe('Expression analyze suite', () => {
  const expressionAnalyzer = new ExpressionAnalyzer();
  const defaultExpressions = ['Hello', 'Param', 1, {}];
  const inExpressions = ['1,2,3', 'John, Joi , Doe'];
  const likeExpression = ['(name|Jo)', '( age | 2 )'];

  it('analyzes default expressions', () => {
    defaultExpressions.forEach((exp) => {
      assert.equal(expressionAnalyzer.analyze(exp), EXPRESSION_KEYS.DEFAULT);
    });
  });

  it('analyzes $in expressions', () => {
    inExpressions.forEach((exp) => {
      assert.equal(expressionAnalyzer.analyze(exp), EXPRESSION_KEYS.IN);
    });
  });

  it('analyzes $like expressions', () => {
    likeExpression.forEach((exp) => {
      assert.equal(expressionAnalyzer.analyze(exp), EXPRESSION_KEYS.LIKE);
    });
  });
});
