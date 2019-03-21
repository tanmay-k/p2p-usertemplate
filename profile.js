const archive = new DatArchive(window.location);

//////////////////////////////Render profile////////////////////////////////////

var prof; //= await archive.readFile('/profile.json');//Returns string
var profile;// = JSON.parse(prof);//Convert string to JSON object
var updatedAvatar;

var renderProfile = async function()	{
	try {
		prof = await archive.readFile('/profile.json');//Returns string
		profile = JSON.parse(prof);//Convert string to JSON object
		document.querySelector('title').innerHTML = profile.name;
		document.querySelector('#avatar').src = profile.avatar;
		document.querySelector('#user-name').value = profile.name;
		document.querySelector('#about-user').value = profile.about;
	} catch (e) {
		console.log('ERROR: Missing profile.json');
		return;
	} finally {

	}
};

renderProfile();
////////////////////////////////////////////////////////////////////////////////
var enableUserEdit = function(event)	{
	//console.log(event.target.attributes);

	var input = document.querySelector('#user-name');
	input.disabled = false;//input.disabled === 'true'?false:true;

	//document.querySelector('#save-button').disabled = false;
	return;
};

var enableAboutEdit = function()	{
	var input = document.querySelector('#about-user');
	input.disabled = false;//input.disabled === 'true'?false:true;

	//document.querySelector('#save-button').disabled = false;
	return;
};

var enableSave = function(){document.querySelector('#save-button').disabled = false;};
var disableSave = function(){document.querySelector('#save-button').disabled = true;};

var saveChanges = async function()	{
//	alert('GOOD!');
	if( typeof(updatedAvatar) !== 'undefined' )	{
		//var path = `/${updatedAvatar.name}`;
		var oldPath = profile.avatar;
		var avatarImg = getNameAndExtension(updatedAvatar.name);
		var targetPath = `/avatar.${avatarImg[1]}`;
		var reader = new FileReader();
		reader.onload = async function()	{
			try {
				//await archive.stat(path);//Check if current avatar is same as new. If not same then upload else no need to upload;
				//var avatarImg = getNameAndExtension(updatedAvatar.name);
				//var targetPath = `/avatar.${avatarImg[1]}`;
				//setTimeout(async function(){await archive.writeFile(targetPath,reader.result);},200);
				await archive.writeFile(targetPath,reader.result);
				profile.avatar = targetPath;
			} catch (e) {

			} finally {
				}
		}
		reader.readAsArrayBuffer(updatedAvatar);
	}

	profile.name = document.querySelector('#user-name').value;
	profile.about = document.querySelector('#about-user').value;
	var newProfile = JSON.stringify(profile);
	await archive.unlink('/profile.json');
	await archive.writeFile('/profile.json',newProfile);
	await archive.configure({
		title:'P2P-Photo Share user: '+profile.name
	});
	setTimeout(function(){renderProfile();},200);
};

var uploadImage = function(event)	{
	if( event.target.files )	{
		const {files} = event.target;
		updatedAvatar = files[0];
		//document.querySelector('#change-dp-modal').style.display = 'block';
		var tempImg = document.querySelector('#temp-profile');

		var reader = new FileReader()
		reader.onload = function()	{
			var dataURL = reader.result;
			tempImg.src=dataURL;
		};
		reader.readAsDataURL(files[0]);
		enableSave();
	}
};

var uploadProfilePhoto = function(event)	{
	document.querySelector('#update-dp-modal').style.display='none';
	var avatar = document.querySelector('#avatar');
	var img = document.querySelector('#temp-profile');
	avatar.src = img.src;
};

var cancelImage = function()	{
	document.querySelector('#update-dp-modal').style.display='none';
};

var getNameAndExtension = function(fileName)	{
	extn = fileName.split('.');
	return extn;
}

document.querySelector('#name-edit').addEventListener('click',enableUserEdit);
document.querySelector('#about-edit').addEventListener('click',enableAboutEdit);
document.querySelector('#name-edit').addEventListener('input',enableSave);
document.querySelector('#about-edit').addEventListener('input',enableSave);
document.querySelector('#save-button').addEventListener('click',saveChanges);

document.querySelector('input[type="file"]').addEventListener('change', uploadImage);
document.querySelector('#acceptBtn').addEventListener('click',uploadProfilePhoto);
document.querySelector('#cancelBtn').addEventListener('click',cancelImage);
