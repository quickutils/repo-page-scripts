
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
		getOrganizationProfileInfo('https://api.github.com/orgs/' + name, name); 
		getOrganizationOrProfileRepos(name);
		
	} else if (PageType === 2) {
		//repo
		
	}
	
}

function getOrganizationProfileInfo(apiEndpoint, name) {
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
			
			if (data.org.description) {
				setOrganizationOrProfileInfo(data);
			} else {
				getOrganizationProfileInfo('https://api.github.com/users/' + name, name);
			}
			
		});  
	}
}

function setOrganizationOrProfileInfo(org) {
	setMeta(org);
	setTitle(org);
}

function getOrganizationOrProfileRepos(orgName) {
	if (TestType !== 0) {
		if (TestType === 1) {
			setOrganizationBody(getOrgReposTest());
			
		} else if (TestType === 2) {
			setProfileBody(getProfileReposTest());
			
		}
		
	} else {
		getJSONP('https://api.github.com/users/' + orgName + '/repos', function(data){
			setOrganizationBody(data);
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

function setProfileBody(repos) {
	document.body.innerHTML += `<div class="container" id="container">
		<button class="tablink" onclick="openPage('Repositories', this)" id="defaultOpen">Repositories</button>
		<button class="tablink" onclick="openPage('Organizations', this)" >Organizations</button>
		<button class="tablink" onclick="openPage('Gists', this)">Gists</button>
		<button class="tablink" onclick="openPage('All-Repos', this)">All Repos</button>
		
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
	var titleDivContent = `<div class="org-title" id="org-title">
		<br/><img id="org-title-image" class="circular_image" alt="${org.description}" src="${org.avatar_url}">
		<br/><br/><a href="${org.html_url}"><span id="org-title-title" >${org.name}</span></a>
		<p>`
				
		+ (org.description ? `${org.description}` : ``) +
				
		`</p></div>`;
	document.body.innerHTML += titleDivContent; 
}

function setIcon(imageLink) {
	var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = imageLink;
    document.getElementsByTagName('head')[0].appendChild(link);
}

function getJSONP(url, success) {
    var xmlhttp = new XMLHttpRequest();
	xmlhttp.open('GET', url, true);
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4) {
			if(xmlhttp.status == 200) {
				var obj = JSON.parse(xmlhttp.responseText);
				success(obj);
			 }
		}
	};
	xmlhttp.send(null);
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
