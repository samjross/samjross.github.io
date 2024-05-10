$('#anglecalculator').on('submit', ev => {
	ev.preventDefault();
	// check x and z degrees are within range, 0-90
	const xdeg = ev.target.xdeg.value;
	const zdeg = ev.target.zdeg.value;
	if (!xdeg || !zdeg) return alert('you must input x° and z°');
	if (xdeg < 0 || xdeg > 90) return alert('you must enter values between 0 and 90');
	if (zdeg < 0 || zdeg > 90) return alert('you must enter values between 0 and 90');

	const results = findAngles(xdeg, zdeg);
	$('#results').show();
	$('#xangleresult').text(results.xangle.toFixed(3));
	$('#yangleresult').text(results.yangle.toFixed(3));
	// nxlength, nylength, nzlength
	$('#xlength').text(results.nxlength.toFixed(3));
	$('#ylength').text(results.nylength.toFixed(3));
	$('#zlength').text(results.nzlength.toFixed(3));
	console.log(results);
});



function findAngles(xDeg, zDeg) {
	// https://jsfiddle.net/3aqew0c9/3/
  const startingVectors = {
  	x: [1,0,0],
    y: [0,-1,0],
    z: [0,0,1]
  };
  
  // step 1
  // the first goal is to rotate those starting vectors by -zDeg, -xDeg
  const newVectors = {
        x: rotateVectorX(-xDeg, rotateVectorZ(-zDeg, startingVectors.x)),// rotateVectorZ(-zDeg,rotateVectorX(-xDeg, startingVectors.x)),
  	    y: rotateVectorX(-xDeg,rotateVectorZ(-zDeg, startingVectors.y))	,
  	    z: rotateVectorX(-xDeg,rotateVectorZ(-zDeg, startingVectors.z))
  };
  
  // $('td#newxv').text(JSON.stringify(newVectors.x));
  // $('td#newyv').text(JSON.stringify(newVectors.y));
  // $('td#newzv').text(JSON.stringify(newVectors.z));
  
  // step 2: project new vectors onto downward-pointing plane
  // vector that defines downward pointing plane is [0,0,-1]
  // https://math.stackexchange.com/questions/100439/determine-where-a-vector-will-intersect-a-plane
  // turns out, the way to project upward toward a downward-pointing plane is to just ignore the z-component of the newVectors, and use the x and ys, with 0,0 as center
  
  // $('td#xproj').text(`(${newVectors.x[0]}, ${newVectors.x[1]})`);
  // $('td#yproj').text(`(${newVectors.y[0]}, ${newVectors.y[1]})`);
  // $('td#zproj').text(`(${newVectors.z[0]}, ${newVectors.z[1]})`);
  
  // step 3: calculate the angles and length
  const xangle = Math.atan(newVectors.x[1] / newVectors.x[0]) * 180/ Math.PI
  // $('#xangle').text(xangle + '°');
  const yangle = Math.atan(newVectors.y[1] / newVectors.y[0]) * 180/ Math.PI
  // $('#yangle').text(yangle + '°');
  // z is always straight up so don't bother calculating this
  // if you wanted to, i guess you would put -90°
  
  // now lengths
  const xlength = (newVectors.x[0] ** 2 + newVectors.x[1] ** 2 ) ** 0.5;
  const ylength = (newVectors.y[0] ** 2 + newVectors.y[1] ** 2 ) ** 0.5;
  const zlength = (newVectors.z[0] ** 2 + newVectors.z[1] ** 2 ) ** 0.5;
  // $('#xlength').text(xlength);
  // $('#ylength').text(ylength);
  // $('#zlength').text(zlength);
  
  // normalize it by setting the longest length to 1
  // first find max length
  const maxLength = Math.max(xlength, ylength, zlength);
  const multiplier = 1 / maxLength;
  const nxlength = xlength * multiplier;
  const nylength = ylength * multiplier;
  const nzlength = zlength * multiplier;
  // $('#nxlength').text(nxlength);
  // $('#nylength').text(nylength);
  // $('#nzlength').text(nzlength);
  return {
  	xangle, yangle, nxlength, nylength, nzlength
  };
}

// rotating vectors described here
// https://stackoverflow.com/questions/14607640/rotating-a-vector-in-3d-space
function rotateVectorX(deg, vec) {
	// vector is an array [x,y,z]
  const answerVector = [vec[0], null, null]; // x is the same, we need to calculate y and z
  // y = y cos θ − z sin θ
  answerVector[1] = vec[1] * Math.cos(dtr(deg)) - vec[2] * Math.sin(dtr(deg));
  // z = y sin θ + z cos θ
  answerVector[2] = vec[1] * Math.sin(dtr(deg)) + vec[2] * Math.cos(dtr(deg));
  return answerVector;
}

function rotateVectorZ(deg, vec) {
	// vector is an array [x,y,z]
  const answerVector = [null, null, vec[2]]; // z is the same, we need to calculate x and y
  // x = x cos θ − y sin θ
  answerVector[0] = vec[0] * Math.cos(dtr(deg)) - vec[1] * Math.sin(dtr(deg));
  // y = x sin θ + y cos θ
  answerVector[1] = vec[0] * Math.sin(dtr(deg)) + vec[1] * Math.cos(dtr(deg));
  return answerVector;
}

function dtr(deg) {
	return deg*Math.PI/180;
}