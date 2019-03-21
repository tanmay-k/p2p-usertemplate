const archive = new DatArchive(window.location);

//////////////////////////////Render profile////////////////////////////////////

var prof; //= await archive.readFile('/profile.json');//Returns string
var profile;// = JSON.parse(prof);//Convert string to JSON object
var updatedAvatar;

var renderProfile = async function()	{
	try {
		prof = await archive.readFile('/profile.json');//Returns string
		profile = JSON.parse(prof);//Convert string to JSON object
		document.querySelector('title').value = profile.name;
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
	console.log(event.target.attributes);

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

var saveChanges = function()	{
//	alert('GOOD!');
	if( typeof(profile) !== 'undefined' )	{
		profile.name = document.querySelector('#name-edit').value;
		profile.about = document.querySelector('#about-edit').value;

		var path = `/${updatedAvatar.files[0].name}`;
		var oldPath = Profile.avatar;
		if( typeof(updatedAvatar) !== 'undefined' )	{
			var reader = new FileReader();
			reader.onload = async function()	{
				try {
					await archive.stat(path);//Check if current avatar is same as new. If not same then upload else no need to upload;
				} catch (e) {
					setTimeout(async function(){await archive.writeFile('/',reader.result);profile.avatar = path;},500);
				} finally {

				}
			}
			reader.readAsArrayBuffer(updatedAvatar.files[0]);
		}

		//var newProfile = JSON.stringify(profile);
		//await archive.unlink(oldPath);
		//await archive.writeFile(path,newProfile);
	}
};

document.querySelector('#name-edit').addEventListener('click',enableUserEdit);
document.querySelector('#about-edit').addEventListener('click',enableAboutEdit);
document.querySelector('#name-edit').addEventListener('input',enableSave);
document.querySelector('#about-edit').addEventListener('input',enableSave);
document.querySelector('#save-button').addEventListener('click',saveChanges);
