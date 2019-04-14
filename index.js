var archive = new DatArchive(window.location);
var uploadedImages;
var timeOut = 5000; //used to create delay while creating new album
var albumArchive;
/* Render profile */
////////////////////////////////////////////////////////////////////////////////

var renderProfile = async function()	{
	try {
		//var profileSection = document.getElementById("profileSection");
		var prof = await archive.readFile('/profile.json');//Returns string
		var profile = JSON.parse(prof);//Convert string to JSON object
		document.querySelector('title').innerHTML = profile.name;
		document.querySelector('img[class="card-img-top"]').src = profile.avatar;
		document.querySelector('h4[class="card-title"]').innerHTML = profile.name;
		document.querySelector('p[class="card-text"]').innerHTML = profile.about;
	} catch (e) {

		console.log(e);
	} finally {
	}
};

//window on load
renderProfile();

////////////////////////////////////////////////////////////////////////////////
//Check if user is the owner of archive,
//if no, then don't allow that person to create, delete the archive
var checkOwnership = async function()	{
	var info =  await archive.getInfo();
	if( !info.isOwner )	{
		document.querySelector('#new-album').disabled = true;
		document.querySelector('#sharePhotos').disabled = true;
		document.querySelector('#deletePhotos').disbaled = true;
		//document.querySelector('#profile-link').href = '#';
	}
};
checkOwnership();
////////////////////////////////////////////////////////////////////////////////

var uploadImage = async function(event)	{
	var fileTag = document.querySelector('input[type="file"]');
	//if( event.target.files )	{
	if( fileTag.files )	{
		//const {files} = event.target;
		const files = fileTag.files;
		var fileNames = [];

		//Disable the new album button so that only one album can be created at a time
		var createAlbumBtn = document.querySelector("#postPhotos")
		createAlbumBtn.disabled = true;
		var spinner = document.createElement('span');
		spinner.setAttribute('class','spinner-grow spinner-grow-sm');
		spinner.setAttribute('data-toggle','tooltip');
		spinner.setAttribute('title','Please wait!... Creating new album...');
		createAlbumBtn.appendChild(spinner);

		//sessionStorage.setItem("fileArray",files);
		//window.open("newAlbum.html","Uploading Photos!");

		/*var albumArchive = await DatArchive.create(
			{
				title: "P2P-Album: "+document.querySelector('#album-name').value,
				description: "An album archive for p2p-photoshare",
				//type: "user-album",
				prompt: true
			}
		);*/
		try {
			var albumTemplateRawUrl = await DatArchive.resolveName('dat://album-template.hashbase.io/');
			albumArchive = await DatArchive.fork(`dat://${albumTemplateRawUrl}`,{
	  			title: 'pixfly Album: ' + document.querySelector('#album-name').value,
	  			description: 'Photos you upload will be stored here',
	  			prompt: true
			});

			var time = Date.now().toString();
			var albumConfigObj = {
				"name": document.querySelector('#album-name').value,
				"parent": archive.url,
				"createdAt": time
			};

			var albumConfigStr = JSON.stringify(albumConfigObj);

			await albumArchive.writeFile('/config.json',albumConfigStr);
		//console.log(albumArchive);

			for(let i=0;i<files.length;i++)	{
				const reader = new FileReader();
				const file = files[i];
				fileNames.push([file.name,""]);
				console.log(file.size);
				//var msg = (file.size > 1048576‬) ? "File size 1 > 1MB" : "File size is okay to be uploaded through UI";
				//console.log(msg);
				reader.onload = async function()	{
					var targetPath = `/posts/images/${file.name}`;
					setTimeout(async function(){albumArchive.writeFile(targetPath,reader.result);},timeOut+=3000);
				};
			//setTimeout(function(){reader.readAsArrayBuffer(file);},timeOut+=5000);
				reader.readAsArrayBuffer(file);
			}

			createAlbum(fileNames,albumArchive.url);//Now create album.json
	} catch (e) {
		createAlbumBtn.disabled = false;
	} finally {
}

var createAlbum = async function(imageNames,archiveURL)	{
	var albumName = document.querySelector('#album-name').value;
	//var albumName = "firstAlbum";

	//var jsonFileName = getJsonFileName(8);
	var targetPath = `/posts/albums/${albumName}.json`;
	try {
		await archive.stat(targetPath);
		//Album already exist
		// TODO: Update existing album
	} catch (e) {
		//Album does not exist so create new one
		var curTime = Date.now().toString();
		var newAlbum = {
			'name': albumName,
			'url': archiveURL,
			'images': imageNames,
			'createdAt': curTime
		}
		var newAlbumString = JSON.stringify(newAlbum);
		await albumArchive.writeFile(targetPath,newAlbumString);
		await archive.writeFile(targetPath,newAlbumString);

	} finally {
	}

	setTimeout(function(){
		appendAlbum(albumName);
		var createAlbumBtn = document.querySelector("#postPhotos");
		createAlbumBtn.innerHTML = 'New Album';
		createAlbumBtn.disabled = false;// enable the new album button
	},timeOut+500);	//Reload album list after all images gets uploaded
}

//Just returns random alphanumeric string of given length.
//Although this method is not in use currently, but I think it might be useful in future
var getRandomAlphaNumericString = function(len)	{
  	var text = "";

  	var charset = "abcdefghijklmnopqrstuvwxyz0123456789";

  	for (var i = 0; i < len; i++)	{
    		text += charset.charAt(Math.floor(Math.random() * charset.length));
  	}
  	return text;
}

var redirectToAlbum = function(event)	{
	//alert('We received your images. This page is under construction.');
	//event.preventDefault();
	//event.stopPropagation();
	var clickedId = event.target.attributes['id'].value;
	localStorage.setItem('clickedAlbum',clickedId);
	window.location = '/album.html';
}

var appendAlbum = async function(name)	{
	var albumList = document.querySelector('#album-list');
	//console.log(albumList);

	var anchorEl,mediaEl,mediaBodyEl,albumNameEl,nameTextEl;

	var albumName = name.endsWith('.json')?`/posts/albums/${name}`:`/posts/albums/${name}.json`;
	var albumStr = await archive.readFile(albumName);
	var album = JSON.parse(albumStr);
	anchorEl = document.createElement('a');
	//anchorEl.setAttribute('href','#');
	anchorEl.setAttribute('href',album.url);
	anchorEl.setAttribute('data-target','_blank');
	anchorEl.setAttribute('id',`a-${name.includes(' ')?name.split(' ')[0]:name}`)
	//anchorEl.addEventListener('click',redirectToAlbum);

	mediaEl = document.createElement('div');
	mediaEl.setAttribute('class','media border p-3');
	mediaEl.setAttribute('id',`${name.includes(' ')?name.split(' ')[0]:name}`);

	mediaBodyEl = document.createElement('div');
	mediaBodyEl.setAttribute('class','media-body');

	albumNameEl = document.createElement('h3');
	//albumNameEl.setAttribute('id',name);
	//nameTextEl = document.createTextNode(name.includes('.')?name.split('.')[0]:name);
	anchorEl.innerText = name.includes('.')?name.split('.')[0]:name;
	//albumNameEl.appendChild(nameTextEl);
	albumNameEl.appendChild(anchorEl);
	mediaBodyEl.appendChild(albumNameEl);
	mediaEl.appendChild(mediaBodyEl);
	albumList.appendChild(mediaEl);

	var info = await archive.getInfo();

	if( info.isOwner )	{
		var deleteBtn = document.createElement('button');
		deleteBtn.setAttribute('type','button');
		deleteBtn.setAttribute('id',`del-${name.includes(' ')?name.split(' ')[0]:name}`);
		deleteBtn.setAttribute('class','btn btn-outline-danger btn-sm m-2 float-right');

		var deleteicon = document.createElement('i')//document.createElement('span');
		//deleteicon.setAttribute('class','glyphicon glyphicon-trash');
		//deleteicon.setAttribute('src',imgSrc);
		//deleteicon.setAttribute('id',`cardD-${i}`);
		deleteicon.setAttribute('class','fa fa-trash');
		deleteicon.setAttribute('aria-hidden','true');
		deleteicon.setAttribute('id',`delico-${name.includes(' ')?name.split(' ')[0]:name}`);
		deleteicon.addEventListener('click',deleteAlbum);
		deleteBtn.appendChild(deleteicon);
		deleteBtn.addEventListener('click',deleteAlbum);

		//mediaBodyEl.appendChild(deleteBtn);
		albumNameEl.appendChild(deleteBtn);

		var shareBtn = document.createElement('button');
		shareBtn.setAttribute('type','button');
		shareBtn.setAttribute('id',`shr-${name.includes(' ')?name.split(' ')[0]:name}`);
		shareBtn.setAttribute('class','btn btn-outline-primary btn-sm m-2 float-right');
		shareBtn.addEventListener('click',shareAlbum);

		var shareIcon = document.createElement('i');
		shareIcon.setAttribute('class','fa fa-share-alt-square');
		shareIcon.setAttribute('aria-hidden','true');
		shareIcon.setAttribute('id',`shrico-${name}`);
		shareIcon.addEventListener('click',shareAlbum);

		shareBtn.appendChild(shareIcon);
		//mediaBodyEl.appendChild(shareBtn);
		albumNameEl.appendChild(shareBtn);
	}
/*
	mediaBodyEl.appendChild(albumNameEl);
	mediaEl.appendChild(mediaBodyEl);
	anchorEl.appendChild(mediaEl);
	albumList.appendChild(anchorEl);*/

	/*anchorEl.appendChild(nameTextEl);
	albumNameEl.appendChild(anchorEl);
	mediaBodyEl.appendChild(albumNameEl);
	mediaEl.appendChild(mediaBodyEl);*/
};

var shareAlbum = function(event)	{
	var id = event.target.attribute.id.value;
	var textBox = document.createElement('input');
	textBox.type = "text";
	textBox.style = "visiblity:hidden";
	textBox.value = document.querySelector(`a-${id.split('-')[1]}`);
	document.appendChild(textBox);

	textBox.select();
	textBox.execCommand("copy");
	alert("Album URL copied to clipboard!, Now you can share it anywhere...");
}

var deleteAlbum = async function(e)	{
	var albumList = document.querySelector('#album-list');
	if( ( e.toElement.localName === "i" & e.toElement.className === "fa fa-trash" ) || ( e.toElement.localName === "button" & e.toElement.className === "btn btn-outline-danger btn-sm m-2 float-right" ) )	{
		var id = event.target.attributes['id'].value;
		var albumMedia = document.querySelector(`#a-${id.split('-')[1]}`);
		console.log(albumMedia);
		var albumRef = albumMedia.href;
		console.log(albumRef);
		var albumToDelete = document.querySelector(`#${id.split('-')[1]}`);
		await DatArchive.unlink(albumRef);
		albumList.removeChild(albumToDelete);

		console.log(`/posts/albums/${id.split('-')[1]}.json`);
		await archive.unlink(`/posts/albums/${id.split('-')[1]}.json`);
	}
}

//document.querySelector('#new-album').addEventListener('change',uploadImage);
document.querySelector('#upload-images').addEventListener('click',uploadImage);//confirmUpload)

var loadAlbums = async function()	{
	try {
		var paths = await archive.readdir('/posts/albums');
		console.log(paths);
		for(let i=0;i<paths.length;i++)	{
			var path = `/posts/albums/${paths[i]}`;
			console.log(path);
			if( path.endsWith('.empty') )	{
				//await archive.unlink(path);// do not uncomment this line, it can cause major problems!
				continue;//ignore the .empty file
			}
			try {
				var albumStr = await archive.readFile(path);
				var album = JSON.parse(albumStr);
				var arch = new DatArchive(album.url);
				//await arch.stat('/index.html');
				appendAlbum(paths[i]);
			} catch (e) {
				console.log(e);
			} finally {

			}
		}
	} catch (e) {
		console.log(e);
	} finally {

	}
}

loadAlbums();

// returns a function that calculates lanczos weight
function lanczosCreate(lobes) {
    return function(x) {
        if (x > lobes)
            return 0;
        x *= Math.PI;
        if (Math.abs(x) < 1e-16)
            return 1;
        var xx = x / lobes;
        return Math.sin(x) * Math.sin(xx) / x / xx;
    };
}

// elem: canvas element, img: image element, sx: scaled width, lobes: kernel radius
function thumbnailer(elem, img, sx, lobes) {
    this.canvas = elem;
    elem.width = img.width;
    elem.height = img.height;
    elem.style.display = "none";
    this.ctx = elem.getContext("2d");
    this.ctx.drawImage(img, 0, 0);
    this.img = img;
    this.src = this.ctx.getImageData(0, 0, img.width, img.height);
    this.dest = {
        width : sx,
        height : Math.round(img.height * sx / img.width),
    };
    this.dest.data = new Array(this.dest.width * this.dest.height * 3);
    this.lanczos = lanczosCreate(lobes);
    this.ratio = img.width / sx;
    this.rcp_ratio = 2 / this.ratio;
    this.range2 = Math.ceil(this.ratio * lobes / 2);
    this.cacheLanc = {};
    this.center = {};
    this.icenter = {};
    setTimeout(this.process1, 0, this, 0);
}

thumbnailer.prototype.process1 = function(self, u) {
    self.center.x = (u + 0.5) * self.ratio;
    self.icenter.x = Math.floor(self.center.x);
    for (var v = 0; v < self.dest.height; v++) {
        self.center.y = (v + 0.5) * self.ratio;
        self.icenter.y = Math.floor(self.center.y);
        var a, r, g, b;
        a = r = g = b = 0;
        for (var i = self.icenter.x - self.range2; i <= self.icenter.x + self.range2; i++) {
            if (i < 0 || i >= self.src.width)
                continue;
            var f_x = Math.floor(1000 * Math.abs(i - self.center.x));
            if (!self.cacheLanc[f_x])
                self.cacheLanc[f_x] = {};
            for (var j = self.icenter.y - self.range2; j <= self.icenter.y + self.range2; j++) {
                if (j < 0 || j >= self.src.height)
                    continue;
                var f_y = Math.floor(1000 * Math.abs(j - self.center.y));
                if (self.cacheLanc[f_x][f_y] == undefined)
                    self.cacheLanc[f_x][f_y] = self.lanczos(Math.sqrt(Math.pow(f_x * self.rcp_ratio, 2)
                            + Math.pow(f_y * self.rcp_ratio, 2)) / 1000);
                weight = self.cacheLanc[f_x][f_y];
                if (weight > 0) {
                    var idx = (j * self.src.width + i) * 4;
                    a += weight;
                    r += weight * self.src.data[idx];
                    g += weight * self.src.data[idx + 1];
                    b += weight * self.src.data[idx + 2];
                }
            }
        }
        var idx = (v * self.dest.width + u) * 3;
        self.dest.data[idx] = r / a;
        self.dest.data[idx + 1] = g / a;
        self.dest.data[idx + 2] = b / a;
    }

    if (++u < self.dest.width)
        setTimeout(self.process1, 0, self, u);
    else
        setTimeout(self.process2, 0, self);
};
thumbnailer.prototype.process2 = function(self) {
    self.canvas.width = self.dest.width;
    self.canvas.height = self.dest.height;
    self.ctx.drawImage(self.img, 0, 0, self.dest.width, self.dest.height);
    self.src = self.ctx.getImageData(0, 0, self.dest.width, self.dest.height);
    var idx, idx2;
    for (var i = 0; i < self.dest.width; i++) {
        for (var j = 0; j < self.dest.height; j++) {
            idx = (j * self.dest.width + i) * 3;
            idx2 = (j * self.dest.width + i) * 4;
            self.src.data[idx2] = self.dest.data[idx];
            self.src.data[idx2 + 1] = self.dest.data[idx + 1];
            self.src.data[idx2 + 2] = self.dest.data[idx + 2];
        }
    }
    self.ctx.putImageData(self.src, 0, 0);
    self.canvas.style.display = "block";
};

var shim = shim || {};
shim.init = function(){
	shim.closestPolyfill();
}
shim.closestPolyfill = function(){
	// matches polyfill
	this.Element && function(ElementPrototype) {
	    ElementPrototype.matches = ElementPrototype.matches ||
	    ElementPrototype.matchesSelector ||
	    ElementPrototype.webkitMatchesSelector ||
	    ElementPrototype.msMatchesSelector ||
	    function(selector) {
	        var node = this, nodes = (node.parentNode || node.document).querySelectorAll(selector), i = -1;
	        while (nodes[++i] && nodes[i] != node);
	        return !!nodes[i];
	    }
	}(Element.prototype);

	// closest polyfill
	this.Element && function(ElementPrototype) {
	    ElementPrototype.closest = ElementPrototype.closest ||
	    function(selector) {
	        var el = this;
	        while (el.matches && !el.matches(selector)) el = el.parentNode;
	        return el.matches ? el : null;
	    }
	}(Element.prototype);
}

// helper for enabling IE 8 event bindings
function addEvent(el, type, handler) {
    if (el.attachEvent) el.attachEvent('on'+type, handler); else el.addEventListener(type, handler);
}

// live binding helper
function live(selector, event, callback, context) {
    addEvent(context || document, event, function(e) {
        var found, el = e.target || e.srcElement;
        while (el && !(found = el.id == selector)) el = el.parentElement;
        if (found) callback.call(el, e);
    });
}

shim.init();
