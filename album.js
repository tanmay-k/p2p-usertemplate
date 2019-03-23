var archive = new DatArchive(window.location);
var albumToRender = localStorage.getItem('clickedAlbum');
//alert(albumToRender);
/* Adding caption
var displayImages = async function()	{
	const albumPath = albumToRender.endsWith('.json')?`/posts/albums/${albumToRender}`:`/posts/albums/${albumToRender}.json`;
	const imagePath = `/posts/images`;
	try {
		await archive.stat(albumPath);//check if that album exist

		var albumStr = await archive.readFile(albumPath);
		var album = JSON.parse(albumStr);
		var dir = await archive.readdir(imagePath);
		var flag = true;
		for(let i=0;i<album.images.length;i++)	{
			const imgSrc = `${imagePath}/${album.images[i]}`;

			/////////////////////////////////////////////
			//var row = document.createElement('div');
			//row.setAttribute('class','row');

			//var col1 = document.createElement('div');
			//col1.setAttribute('class','col')

			//var col2 = document.createElement('div');
			//col2.setAttribute('class','col');

			//////////////////////////////////////////////
			var imgElement = document.createElement('img');
			imgElement.setAttribute('src',imgSrc);
			imgElement.setAttribute('alt',album.images[i]);
			imgElement.setAttribute('height','100%');
			imgElement.setAttribute('width','100%');
			//imgElement.setAttribute('class',flag?'img-fluid img-thumbnail float-left mt-3 mb-3':'img-fluid img-thumbnail float-right mt-3 mb-3');
			imgElement.setAttribute('class','img-fluid img-thumbnail mt-4 mb-4 mx-auto d-block');
			//col1.appendChild(imgElement);
			//row.appendChild(col1);
			//flag?col1.appendChild(imgElement):col2.appendChild(imgElement);
			//flag?row.appendChild(col1):row.appendChild(col2);
			//flag = flag?false:true;
			document.querySelector('div[class="col-sm-8"]').appendChild(imgElement);
		}

	} catch (e) {
		console.log(e);
	} finally {

	}
}
*/

var displayImages = async function()	{
	const albumPath = albumToRender.endsWith('.json')?`/posts/albums/${albumToRender}`:`/posts/albums/${albumToRender}.json`;
	const imagePath = `/posts/images`;
	try {
		await archive.stat(albumPath);//check if that album exist

		var albumStr = await archive.readFile(albumPath);
		var album = JSON.parse(albumStr);
		var dir = await archive.readdir(imagePath);
		var flag = true;
		for(let i=0;i<album.images.length;i++)	{
			//const imgSrc = `${imagePath}/${album.images[i]}`;
			const imgSrc = `${imagePath}/${album.images[i][0]}`;

			/////////////////////////////////////////////
			//var row = document.createElement('div');
			//row.setAttribute('class','row');

			//var col1 = document.createElement('div');
			//col1.setAttribute('class','col')

			//var col2 = document.createElement('div');
			//col2.setAttribute('class','col');

			//////////////////////////////////////////////
			var imgElement = document.createElement('img');
			imgElement.setAttribute('src',imgSrc);
			imgElement.setAttribute('alt',album.images[i]);
			imgElement.setAttribute('height','100%');
			imgElement.setAttribute('width','100%');
			//imgElement.setAttribute('class',flag?'img-fluid img-thumbnail float-left mt-3 mb-3':'img-fluid img-thumbnail float-right mt-3 mb-3');
			imgElement.setAttribute('class','img-fluid img-thumbnail mt-4 mb-4 mx-auto d-block');
			//col1.appendChild(imgElement);
			//row.appendChild(col1);
			//flag?col1.appendChild(imgElement):col2.appendChild(imgElement);
			//flag?row.appendChild(col1):row.appendChild(col2);
			//flag = flag?false:true;
			document.querySelector('div[class="col-sm-8"]').appendChild(imgElement);
		}

	} catch (e) {
		console.log(e);
	} finally {

	}
}

displayImages();

var deleteImage = function()	{

}
