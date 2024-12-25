if (typeof registerPaint === 'function') {

  const isUnknown = (value) => value instanceof CSSUnparsedValue;

  class HatchedLinesWorklet {
    static get inputProperties() {
      return ['--line-width', '--line-spacing', '--line-color'];
    }

    parseProps(props) {
      const lineWidth = props.get('--line-width');
      const lineSpacing = props.get('--line-spacing');
      const lineColor = props.get('--line-color');

      return {
        lineWidth: isUnknown(lineWidth) ? parseFloat(lineWidth.toString(), 10) || 2 : lineWidth.value,
        lineSpacing: isUnknown(lineSpacing) ? parseFloat(lineSpacing.toString(), 10) || 10 : lineSpacing.value,
        lineColor: isUnknown(lineColor) ? lineColor.toString().trim() || '#000' : lineColor.toString(),
      };
    }

    paint(context, size, props) {
      const { lineWidth, lineSpacing, lineColor } = this.parseProps(props);

      context.strokeStyle = lineColor;
      context.lineWidth = lineWidth;

      const diagonalLength = Math.sqrt(size.width ** 2 + size.height ** 2); // Length of diagonal for 45° line coverage

      // // Draw lines from top-left to bottom-right (positive 45° angle)
      // for (let i = -diagonalLength; i < diagonalLength; i += lineSpacing) {
      //   context.beginPath();
      //   context.moveTo(i, 0); // Start point for each line
      //   context.lineTo(i + size.height, size.height); // End point of line across the canvas
      //   context.stroke();
      // }

      // Draw lines from top-right to bottom-left (135° angle)
      for (let i = diagonalLength; i > -diagonalLength; i -= lineSpacing) {
        context.beginPath();
        context.moveTo(size.width - i, -1); // Start point for each line (from top-right)
        context.lineTo(size.width - i - size.height, size.height + 1); // End point of line (toward bottom-left)
        context.stroke();
      }
    }
  }

  registerPaint('hatched-lines', HatchedLinesWorklet);
}
