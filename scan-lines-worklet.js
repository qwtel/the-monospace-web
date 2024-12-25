if (typeof registerPaint === 'function') {
  class ScanLinesWorklet {
    static get inputProperties() {
      return ['--line-width', '--line-spacing', '--line-color'];
    }

    parseProps(props) {
      const lineWidth = props.get('--line-width');
      const lineSpacing = props.get('--line-spacing');
      const lineColor = props.get('--line-color');
      const isUnknown = (value) => value instanceof CSSUnparsedValue;

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

      // Draw horizontal lines across the width of the canvas
      for (let y = 0; y < size.height; y += lineSpacing) {
        context.beginPath();
        context.moveTo(0, y); // Start at the left edge (x = 0) and the current y-position
        context.lineTo(size.width, y); // Draw a line to the right edge (x = size.width)
        context.stroke();
      }
    }
  }

  registerPaint('scan-lines', ScanLinesWorklet);
}
