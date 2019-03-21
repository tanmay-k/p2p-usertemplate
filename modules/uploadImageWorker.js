//var files;
//var archive;
self.onmessage = function(event)	{
	//console.log(event.data);
	//file = event.data;
	//returnArrayBuffer();

	//if( event.data.hasOwnProperty('url') )	{
	//	archive = event.data;
	//	console.log(archive);
	//}
	//if( typeof(event.data) === 'object' )	{
	//	files = event.data;
	//}
	//else if( typeof(event.data) === 'object' )	{
	if ( event.data.__proto__ && event.data.__proto__.constructor === FileList ) {
		//if( !( typeof(archive) === 'undefined' ) )
		console.log(event.data);
		getImage(event.data);
	}
};
//self.postMessage('hello from worker!');
/*var returnArrayBuffer = function()	{
	var fileData = new ArrayBuffer(file.size);
	var reader = new FileReader();
	reader.onload = async function()	{
		//fileData = reader.result;
		//console.log(fileData);
		self.postMessage(reader.result);
	};
	reader.readAsArrayBuffer(file);
	//console.log(typeof fileData);
	//console.log(file);
	//self.postMessage(fileData,[fileData]);
}*/

var getImage = async function(files)	{
	var fileNames = [];
	var i;
	for(i=0;i<files.length;i++)	{
		const file = files[i];
		const reader = new FileReader();
		//const targetPath = `/posts/images/${file.name}`;

		fileNames.push(files[i].name);

		reader.onload = async function()	{
			/*try {
				await archive.stat(targetPath);
			} catch (e) {
				await archive.writeFile(targetPath,reader.result);
			} finally {

			}*/
			self.postMessage(reader.result);
			setTimeout(function(){},200);
		}
		reader.readAsArrayBuffer(file);
	}

	console.log(i);
	if( i == ( files.length - 1 ) )	{
		self.postMessage(fileNames);
		self.setTimeout(function()	{self.postMessage("done");},300);
	}
	else {
		self.postMessage("ERROR: Failed to upload all images!");
	}
}
