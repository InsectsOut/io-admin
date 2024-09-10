function calculatePercentage(parentWidth, childWidth) {
    const percentage = (childWidth / parentWidth) * 100;
    return percentage.toFixed(2) + '%';
}

const args = process.argv.slice(2);
if (args.length !== 2) {
    console.error('Usage: node calculatePercentage.js <parentWidth> <childWidth>');
    process.exit(1);
}

const parentWidth = parseInt(args[0]);
const childWidth = parseInt(args[1]);

if (isNaN(parentWidth) || isNaN(childWidth)) {
    console.error('Invalid input. Widths must be numbers.');
    process.exit(1);
}

const percentage = calculatePercentage(parentWidth, childWidth);
console.log(`The child width of ${childWidth}px is ${percentage} of the parent width of ${parentWidth}px.`);