window.addEventListener('DOMContentLoaded', () => {
  // Array with set of curves points
  let curves = [];
  // Array with points for one curve
  let points = [];

  // Get the canvas and image elements
  const canvas = document.getElementById('curve-canvas');
  const image = document.getElementById('football-field');

  // Setting canvas
  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext('2d');
  const canvasRect = canvas.getBoundingClientRect();
  const POINT_COLOR = 'orangered';
  const ACTIVE_POINT_COLOR = 'cyan';
  const CURVE_COLOR = 'yellowgreen';

  // Active point that dragging now
  let activePoint = null;

  // Draw one point
  const drawPoint = function (point) {
    ctx.strokeStyle = point.color;
    ctx.strokeRect(point.x, point.y, 7, 7);
  };

  // Draw curve
  const drawCurve = function (points) {
    if (points.length === 3) {
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      ctx.quadraticCurveTo(points[1].x, points[1].y, points[2].x, points[2].y);
      ctx.lineWidth = 2;
      ctx.strokeStyle = CURVE_COLOR;
      ctx.stroke();
    }

    // Draw control points
    points.forEach(drawPoint);
  };

  // Function to draw all curves on canvas
  const drawCurves = function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    curves.forEach(drawCurve);
  };

  // Handle mousedown event
  const handleMouseDown = function (e) {
    const mouseX = e.clientX - canvasRect.left;
    const mouseY = e.clientY - canvasRect.top;

    // Check if we choose an existing point and set it as active
    const allPoints = curves.flat();

    for (const [index, point] of allPoints.entries()) {
      const dx = mouseX - point.x;
      const dy = mouseY - point.y;
      const distance = dx * dx + dy * dy;
      if (distance <= 100) {
        const curveIndex = Math.floor(index / 3);
        const pointIndex = index % 3;
        activePoint = { curveIndex, pointIndex };
        break;
      }
    }

    // Don't create new curve if choose existing point
    if (activePoint) return;

    // Create new curve
    if (points.length < 3) {
      points.push({ x: mouseX, y: mouseY, color: POINT_COLOR });

      if (points.length === 2) {
        // Calculate and add the middle point
        const middleX = (points[0].x + points[1].x) / 2;
        const middleY = (points[0].y + points[1].y) / 2;
        points.splice(1, 0, { x: middleX, y: middleY, color: POINT_COLOR });
      }

      drawCurve(points);
    }

    // Reset points for the next curve and save set of used curves points
    if (points.length === 3) {
      curves.push(points);
      points = [];
    }
  };

  // Handle mousemove event
  const handleMouseMove = function (e) {
    if (!activePoint) {
      return;
    }

    const mouseX = e.clientX - canvasRect.left;
    const mouseY = e.clientY - canvasRect.top;

    const { curveIndex, pointIndex } = activePoint;
    curves[curveIndex][pointIndex].x = mouseX;
    curves[curveIndex][pointIndex].y = mouseY;
    curves[curveIndex][pointIndex].color = ACTIVE_POINT_COLOR;

    drawCurves();
  };

  // Handle mouseup event
  const handleMouseUp = function () {
    if (!activePoint) {
      return;
    }

    const { curveIndex, pointIndex } = activePoint;
    curves[curveIndex][pointIndex].color = POINT_COLOR;
    drawPoint(curves[curveIndex][pointIndex]);
    activePoint = null;
  };

  // Add event listeners to canvas
  canvas.addEventListener('mousedown', handleMouseDown);
  canvas.addEventListener('mousemove', handleMouseMove);
  canvas.addEventListener('mouseup', handleMouseUp);

  // Clear canvas
  const clearBtn = document.getElementById('clear-button');

  const clearCanvas = function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    curves = [];
    points = [];
  };

  clearBtn.addEventListener('click', clearCanvas);
});
