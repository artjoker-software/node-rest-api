import EXPRESSION_KEYS from './expressions';

export default class ExpressionAnalyzer {

  static IN_EXPRESSION_REGEX = /^([a-zA-Z0-9\-_ -]+)([,][a-zA-Z0-9\-_ -]+)*$/i;
  static LIKE_EXPRESSION_REGEX = /^(\([a-zA-Z0-9\-_ ]+\|[0-9a-zA-Z0-9\-_ ]+\))$/i;

  analyzers;

  constructor() {
    this.analyzers = [
      this.isInExpression,
      this.isLikeExpression
    ];
  }

  analyze(string) {
    for (const analyzer of this.analyzers) {
      const analysisResult = analyzer(string);
      if (analysisResult) {
        return analysisResult;
      }
    }
    return EXPRESSION_KEYS.DEFAULT;
  }

  isInExpression(expression) {
    return (ExpressionAnalyzer.IN_EXPRESSION_REGEX.test(String(expression)) && String(expression).indexOf(',') > 0)
      ? EXPRESSION_KEYS.IN
      : null;
  }

  isLikeExpression(string) {
    return (ExpressionAnalyzer.LIKE_EXPRESSION_REGEX.test(string))
      ? EXPRESSION_KEYS.LIKE
      : null;
  }

}

