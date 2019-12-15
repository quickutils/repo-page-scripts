
/**
TestType
0 = Not Test
1 = Org
2 = Profile
3 = Repo

**/

/**
PageType
0 = None
1 = Org/Profile
2 = Repo

**/
var TestType = (typeof TestType === "undefined" ? 0 : TestType );
var LoadedOrgs = false;
var LoadedGists = false;
var LoadedAllRepos = false;

main()
function main() {
	var PageType = 1;
	var url = window.location.href ; //"https://quickutils.github.io/";//
	var splited = url.replace("https://", '').replace(/\\|\//g, '').split("?")[0].split(".github.io");
	var name = splited[0].replace(".github.io/", '');
	if (splited.length > 1 && splited[1].trim() != "") {
		PageType = 2;
		name = splited[1];
	}
	if (PageType === 1) {
		getOrganizationProfileInfo('https://api.github.com/users/' + name, name); 
		
	} else if (PageType === 2) {
		//repo
		
	}
	
}

function getOrganizationProfileInfo(apiEndpoint, name) {
	document.body.innerHTML += `<div class="org-title" id="org-title"></div>`; 
	if (TestType !== 0) {
		if (TestType === 1) {
			setOrganizationOrProfileInfo(getOrginfoTest());
			
		} else if (TestType === 2) {
			setOrganizationOrProfileInfo(getProfileinfoTest());
			
		} else if (TestType === 3) {
			//repo header
			
		}
	} else {
		getJSONP(apiEndpoint, function(data){
			if (data.description || data.bio) {
				setOrganizationOrProfileInfo(data);
			} else {
				getOrganizationProfileInfo('https://api.github.com/orgs/' + name, name);
			}
			
		}, function(err) {
			getOrganizationProfileInfo('https://api.github.com/orgs/' + name, name);
		});  
	}
}

function setOrganizationOrProfileInfo(org) {
	setMeta(org);
	setTitle(org);
	getOrganizationOrProfileRepos(org);
}

function getOrganizationOrProfileRepos(org) {
	if (TestType !== 0) {
		if (TestType === 1) {
			setOrganizationBody(getOrgReposTest());
			
		} else if (TestType === 2) {
			setProfileBody(org, getProfileReposTest());
			
		}
		
	} else {
		getJSONP('https://api.github.com/users/' + org.login + '/repos', function(data){
			if (org.type === "User") {
				setProfileBody(org, data);
			} else {
				setOrganizationBody(data);
			}
		}, function(err) {
			
		});  
	}
}

function setOrganizationBody(repos) {
	document.body.innerHTML += `<div class="org-main" id="org-main"> </div>`;
	var div = document.getElementById('org-main');
	for (var repo of repos) {
		var repoHTML = `
			<div class="org-main-repo">
				<i class="fa fa-book"></i>
				<a href="https://${repo.owner.login}.github.io/${repo.name}"><span style="margin-left:5px;">${repo.name}</span></a>
				<p>`
				
				+ (repo.description ? `${repo.description}` : ``) +
				
				`</p>`
				
				+ (repo.language ? `<i class="fa fa-circle color-${repo.language.replace(' ', '-').toLowerCase()}"></i> ${repo.language}` : `<i class="fa fa-circle"></i> None`) +
				
				`<stat> <i class="fa fa-star"></i> ${repo.stargazers_count}</stat>
				<stat> <i class="fa fa-code-fork"></i> ${repo.forks_count}</stat>
				</div>
		`;
		div.innerHTML += (repoHTML);
	}
}

function setProfileBody(org, repos) {
	document.body.innerHTML += `<div class="container" id="container">
		<button class="tablink" onclick="openRepositories(this, '${org.repos_url}')" id="defaultOpen">Repositories</button>
		<button class="tablink" onclick="openOrganization(this, '${org.organizations_url}')" >Organizations</button>
		<button class="tablink" onclick="openGists(this, '${org.gists_url.split('{')[0]}')">Gists</button>
		<button class="tablink" onclick="openAllRepos(this, '${org.repos_url}', '${org.organizations_url}')">All Repos</button>
		
		<div id="Repositories" class="tabcontent">
			<div class="org-main" id="org-main-repos">
			</div>
		</div>
		<div id="Organizations" class="tabcontent">
			<div class="org-main" id="org-main-orgs">
			</div>
		</div>
		<div id="Gists" class="tabcontent">
			<div class="org-main" id="org-main-gists">
			</div>
		</div>
		<div id="All-Repos" class="tabcontent">
			<div class="org-main" id="org-main-all">
			</div>
		</div>
	</div>`;
	var div = document.getElementById('org-main-repos');
	for (var repo of repos) {
		var repoHTML = `
			<div class="org-main-repo">
				<i class="fa fa-book"></i>
				<a href="https://${repo.owner.login}.github.io/${repo.name}"><span style="margin-left:5px;">${repo.name}</span></a>
				<p>`
				
				+ (repo.description ? `${repo.description}` : ``) +
				
				`</p>`
				
				+ (repo.language ? `<i class="fa fa-circle color-${repo.language.replace(' ', '-').toLowerCase()}"></i> ${repo.language}` : `<i class="fa fa-circle"></i> None`) +
				
				`<stat> <i class="fa fa-star"></i> ${repo.stargazers_count}</stat>
				<stat> <i class="fa fa-code-fork"></i> ${repo.forks_count}</stat>
				</div>
		`;
		div.innerHTML += (repoHTML);
	}
	document.getElementById('defaultOpen').click();
}

function setMeta(org) {
	setIcon(org.avatar_url);
	if (document.querySelector('meta[name="description"]') !== null) document.querySelector('meta[name="description"]').setAttribute("content", org.description);
	if (document.querySelector('meta[property="og:title"]') !== null) document.querySelector('meta[property="og:title"]').setAttribute("content", org.name);
	if (document.querySelector('meta[property="og:image"]') !== null) document.querySelector('meta[property="og:image"]').setAttribute("content", org.avatar_url);
	if (document.querySelector('meta[property="og:description"]') !== null) document.querySelector('meta[property="og:description"]').setAttribute("content", org.description);
}

function setTitle(org) {
	document.title = org.name ;
	var titleDivContent = `
		<br/><img id="org-title-image" class="circular_image" alt="${org.description}" src="${org.avatar_url}">
		<br/><br/><a href="${org.html_url}"><span id="org-title-title" >${org.name}</span></a>
		<p>`
				
		+ (org.description ? `${org.description}` : ``) +
				
		`</p>`;
	document.getElementById('org-title').innerHTML += titleDivContent; 
}

function setIcon(imageLink) {
	var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = imageLink;
    document.getElementsByTagName('head')[0].appendChild(link);
}

function getJSONP(url, success, failed) {
    var xmlhttp = new XMLHttpRequest();
	xmlhttp.open('GET', url, true);
	xmlhttp.setRequestHeader("Content-Type", "application/json");
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4) {
			if(xmlhttp.status == 200) {
				var obj = JSON.parse(xmlhttp.responseText);
				success(obj);
			} else if(xmlhttp.status == 404){
				var obj = (xmlhttp.responseText ? JSON.parse(xmlhttp.responseText) : {} );
				failed(obj);
			}
		}
	};
	xmlhttp.send(null);
}

function getStringP(url, success, failed) {
    var xmlhttp = new XMLHttpRequest();
	xmlhttp.open('GET', url, true);
	xmlhttp.setRequestHeader("Content-Type", "text/plain; charset=utf-8");
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4) {
			if(xmlhttp.status == 200) {
				success(xmlhttp.responseText);
			} else if(xmlhttp.status == 404){
				var obj = (xmlhttp.responseText ? xmlhttp.responseText : '' );
				failed(obj);
			}
		}
	};
	xmlhttp.send(null);
}

function openRepositories(elmnt, apiEndpoint) {
	openPage('Repositories', elmnt);
}

function openOrganization(elmnt, apiEndpoint) {
	openPage('Organizations', elmnt);
	if (LoadedOrgs === false) {
		if (TestType !== 0) {
			if (TestType === 2) {
				renderUserOrganizations(getTestUserOrgs());
			}
			
		} else {
			getJSONP(apiEndpoint, function(data){
				renderUserOrganizations(data);
			}, function(err){});  
		}
	}
}

function renderUserOrganizations(orgs) {
	var div = document.getElementById('org-main-orgs');
	for (var org of orgs) {
		var repoHTML = `
			<div class="org-main-org">
				<img id="org-title-image" class="image" alt="${org.login}" src="${org.avatar_url}">
				<br/><a class="title" href="https://${org.login}.github.io">${org.login}</a>
				<a href="https://${org.login}.github.io"><p>`
				
				+ (org.description ? `${org.description}` : ``) +
				
				`</p></a>
		`;
		div.innerHTML += (repoHTML);
	}
	LoadedOrgs = true;
}

function openGists(elmnt, apiEndpoint) {
	openPage('Gists', elmnt);
	if (LoadedGists === false) {
		if (TestType !== 0) {
			if (TestType === 2) {
				renderUserGist(getTestUserGists());
			}
			
		} else {
			getJSONP(apiEndpoint, function(data){
				renderUserGist(data);
			}, function(err){});  
		}
	}
}

function renderUserGist(gists) {
	var div = document.getElementById('org-main-gists');
	for (var gist of gists) {
		var fileObj = gist.files[Object.keys(gist.files)[0]];
		var repoHTML = `
			<div class="org-main-gist">
				<a class="title" href="${gist.html_url}">${fileObj.filename}</a>`
				
				+ (fileObj.language ? `<i class="fa fa-circle color-${fileObj.language.replace(' ', '-').toLowerCase()}"></i> ${fileObj.language}` : ``) +
				
				`<a href="${gist.html_url}"><p>`
				
				+ (gist.description ? `${gist.description}` : ``) +
				
				`</p></a>
				<textarea id="gist-${fileObj.filename}" readonly></textarea>
			</div>`;
		div.innerHTML += (repoHTML);
		if (TestType !== 0) {
			if (TestType === 2) {
				document.getElementById(`gist-${fileObj.filename}`).innerHTML = getTestUserGistContent();
			}
			
		} else {
			getStringP(fileObj.raw_url, function(data){
				document.getElementById(`gist-${fileObj.filename}`).innerHTML = data;
			}, function(err){document.getElementById(`gist-${fileObj.filename}`).innerHTML = err;});  
		}
	}
	LoadedGists = true;
}

function openAllRepos(elmnt, reposEndpoint, orgsEndpoint) {
	openPage('All-Repos', elmnt);
	if (LoadedAllRepos === false) {
		console.log(reposEndpoint);
		console.log(orgsEndpoint);
	}
}

function openPage(pageName,elmnt) {
	var i, tabcontent, tablinks;
	tabcontent = document.getElementsByClassName("tabcontent");
	for (i = 0; i < tabcontent.length; i++) {
		tabcontent[i].style.display = "none";
	}
	tablinks = document.getElementsByClassName("tablink");
	for (i = 0; i < tablinks.length; i++) {
		tablinks[i].style.backgroundColor = "";
		tablinks[i].style.color = "black";
	}
	document.getElementById(pageName).style.display = "block";
	elmnt.style.backgroundColor = '#ededed';
	elmnt.style.border = '1px solid #ebeae8';
}
