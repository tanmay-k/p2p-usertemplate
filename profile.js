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
	var oldPath = profile.avatar;
	//var avatarImg = getNameAndExtension(updatedAvatar.name);
	var targetPath = oldPath;//`/avatar.${avatarImg[1]}`;
	if( typeof(updatedAvatar) !== 'undefined' )	{
		//var path = `/${updatedAvatar.name}`;
		var reader = new FileReader();
		avatarImg = getNameAndExtension(updatedAvatar.name);
		targetPath = `/avatar.${avatarImg[1]}`;
		reader.onload = async function()	{
			try {
				//await archive.stat(path);//Check if current avatar is same as new. If not same then upload else no need to upload;
				//var avatarImg = getNameAndExtension(updatedAvatar.name);
				//var targetPath = `/avatar.${avatarImg[1]}`;
				//setTimeout(async function(){await archive.writeFile(targetPath,reader.result);},200);
				//await archive.unlink(profile.avatar);
				await archive.unlink(profile.avatar);
				await archive.writeFile(targetPath,reader.result);
				//profile.avatar = targetPath;
				//console.log(profile.avatar);
			} catch (e) {

			} finally {
			}
		}
		reader.readAsArrayBuffer(updatedAvatar);
	}

	//profile.name = document.querySelector('#user-name').value;
	//profile.about = document.querySelector('#about-user').value;
	//var newProfile = JSON.stringify(profile);
	// TODO: create new JSON object and save it instead of modifying existing object
	var updatedProfile = {
		'name': document.querySelector('#user-name').value,
		'about': document.querySelector('#about-user').value,
		'avatar': targetPath,
		'createdAt': profile.createdAt
	};
	var prof = JSON.stringify(updatedProfile);
	console.log(updatedProfile);
	setTimeout(async function(){
		await archive.unlink('/profile.json');
		await archive.writeFile('/profile.json',prof);
		await archive.configure({
			title:'P2P-Photo Share user: '+updatedProfile.name
		});
		setTimeout(function(){profile=updatedProfile;renderProfile();},2000);},5000);
	disableSave();
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
		reader.readAsDataURL(updatedAvatar);
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

var checkOwnership = async function()	{
	var info = await archive.getInfo();
	if( info.isOwner )	{
		document.querySelector('#name-edit').addEventListener('click',enableUserEdit);
		document.querySelector('#about-edit').addEventListener('click',enableAboutEdit);
		document.querySelector('#name-edit').addEventListener('input',enableSave);
		document.querySelector('#about-edit').addEventListener('input',enableSave);
		document.querySelector('#save-button').addEventListener('click',saveChanges);

		document.querySelector('input[type="file"]').addEventListener('change', uploadImage);
		document.querySelector('#acceptBtn').addEventListener('click',uploadProfilePhoto);
		document.querySelector('#cancelBtn').addEventListener('click',cancelImage);
	}
	else {
		document.querySelector('input[type="file"]').setAttribute('data-toggle','');
		document.querySelector('input[type="file"]').setAttribute('data-target','');
		document.querySelector('input[type="file"]').type = "";
	}
};

checkOwnership();
