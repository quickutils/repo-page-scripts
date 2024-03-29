
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
var TestType = (typeof TestType === "undefined" ? 0 : TestType);
var ShowForked = (typeof ShowForked === "undefined" ? false : ShowForked);
var LoadedOrgs = false;
var LoadedGists = false;
var LoadedAllRepos = false;
var LoadedReleases = false;
var LoadedContributors = false;
var Started = false;

loadScript("https://cdnjs.cloudflare.com/ajax/libs/showdown/1.9.1/showdown.min.js", function () {
	if (Started === false) main();
});
let branch = "master";
function main() {
	Started = true;
	var PageType = 1;
	var url = window.location.href; //"https://quickutils.github.io/";//
	var splited = url.replace("https://", '').replace(/\\|\//g, '').split("?")[0].split(".github.io");
	var name = splited[0].replace(".github.io/", '');
	var owner = name;
	if (splited.length > 1 && splited[1].trim() != "") {
		PageType = 2;
		name = splited[1];
	}
	branch = new URL(url).searchParams.get("branch") || "master";
	if (PageType === 1) {
		//org and profile
		getOrganizationProfileInfo('https://api.github.com/users/' + name, name);

	} else if (PageType === 2) {
		//repo
		getJSONP(`https://api.github.com/repos/${owner}/${name}`, function (data) {
			document.body.innerHTML += `<div class="org-title" id="org-title"></div>`;
			setRepoPageInfo(data);

		}, function (err) {

		});
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
			setRepoPageInfo(getTestRepoApi());

		}
	} else {
		getJSONP(apiEndpoint, function (data) {
			if (data.id) {
				setOrganizationOrProfileInfo(data);
			} else {
				getOrganizationProfileInfo('https://api.github.com/orgs/' + name, name);
			}

		}, function (err) {
			getOrganizationProfileInfo('https://api.github.com/orgs/' + name, name);
		});
	}
}

function setRepoPageInfo(repo) {
	setRepoBody(repo, function (repo) {
		setMeta(repo);
		setContributingGuide(repo);
		setRoadmap(repo);
		//setBodyTitle(repo);
	}, function () {

	});
}

function setOrganizationOrProfileInfo(org) {
	setMeta(org);
	setBodyTitle(org);
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
		getJSONP('https://api.github.com/users/' + org.login + '/repos', function (data) {
			if (org.type === "User") {
				setProfileBody(org, data);
			} else {
				setOrganizationBody(data);
			}
		}, function (err) {

		});
	}
}

function setOrganizationBody(unSortedrepos) {
	sortByStarCount(unSortedrepos, function (repos) {
		document.body.innerHTML += `<div class="org-main" id="org-main"> </div>`;
		var div = document.getElementById('org-main');
		for (var repo of repos) {
			if (ShowForked === false && repo.fork == true) continue;
			var repoHTML = `
				<div class="org-main-repo">
					<i class="fa fa-book"></i>
					<a href="https://${repo.owner.login}.github.io/${repo.name}"><span style="margin-left:5px;">${repo.name}</span></a>
					<p>`

				+ (repo.description ? `${repo.description}` : ``) +

				`</p>`

				+ (repo.language ? `<i class="fa fa-circle color-${repo.language.toLowerCase().replace('+', 'p').replace("'", '').replace('#', 'sharp').replace('*', 'star').replace('!', 'not').replace(':', '').replace(' ', '-')}"></i> ${repo.language}` : `<i class="fa fa-circle"></i> None`) +

				`<stat> <i class="fa fa-star"></i> ${repo.stargazers_count}</stat>
					<stat> <i class="fa fa-code-fork"></i> ${repo.forks_count}</stat>
					</div>
			`;
			div.innerHTML += (repoHTML);
		}
	});
}

function setProfileBody(org, unSortedrepos) {
	sortByStarCount(unSortedrepos, function (repos) {
		document.body.innerHTML += `<div class="container" id="container">
			<div class="org-main">
				<button class="tablink org-main-button" onclick="openRepositories(this, '${org.repos_url}')" id="defaultOpen">Repositories</button>
				<button class="tablink org-main-button" onclick="openOrganization(this, '${org.organizations_url}')" >Organizations</button>
				<button class="tablink org-main-button" onclick="openGists(this, '${org.gists_url.split('{')[0]}')">Gists</button>
			</div>
			
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
			if (ShowForked === false && repo.fork == true) continue;
			var repoHTML = `
				<div class="org-main-repo">
					<i class="fa fa-book"></i>
					<a href="https://${repo.owner.login}.github.io/${repo.name}"><span style="margin-left:5px;">${repo.name}</span></a>
					<p>`

				+ (repo.description ? `${repo.description}` : ``) +

				`</p>`

				+ (repo.language ? `<i class="fa fa-circle color-${repo.language.replace('+', 'p').replace("'", '').replace("#", 'sharp').replace("*", 'star').replace("!", 'not').toLowerCase()}"></i> ${repo.language}` : `<i class="fa fa-circle" style="color:black;"></i> None`) +

				`<stat> <i class="fa fa-star"></i> ${repo.stargazers_count}</stat>
					<stat> <i class="fa fa-code-fork"></i> ${repo.forks_count}</stat>
					</div>
			`;
			div.innerHTML += (repoHTML);
		}
		document.getElementById('defaultOpen').click();
	});
}

function setContributingGuide(repo) {
	if (TestType !== 0) {
		if (TestType === 3) {
			continueSetContributingGuide(getTestContributingGuide());
		}
	} else {
		getStringP(getContributingLink(repo.owner.login, repo.name), undefined, function (data, extraParam) {
			continueSetContributingGuide(data);
		}, function (errCode) {
			if (errCode == 404) {
				getStringP(getContributingLink2(repo.owner.login, repo.name), undefined, function (data, extraParam) {
					continueSetContributingGuide(data);
				}, function (err) { });
			} else {
				error();
			}
		});
	}
}

function continueSetContributingGuide(guideRaw) {
	document.getElementById('left-sidenav').innerHTML += `<a class="left-sidenav-a" href="#" onclick="openRepoPage('Contributing-Guide', this)" >Contributing Guide</a>`;
	document.getElementById('Contributing-Guide').innerHTML = (new showdown.Converter().makeHtml(guideRaw));
}

function setRoadmap(repo) {
	if (TestType !== 0) {
		if (TestType === 3) {
			continueSetRoadmap(getTestRoadmap());
		}
	} else {
		getStringP(getRoadmapLink(repo.owner.login, repo.name), undefined, function (data, extraParam) {
			continueSetRoadmap(data);
		}, function (errCode) {
			if (errCode == 404) {
				getStringP(getRoadmapLink2(repo.owner.login, repo.name), undefined, function (data, extraParam) {
					continueSetRoadmap(data);
				}, function (err) { });
			} else {
				error();
			}
		});
	}
}

function continueSetRoadmap(roadmapRaw) {
	document.getElementById('left-sidenav').innerHTML += `<a class="left-sidenav-a" href="#" onclick="openRepoPage('Roadmap', this)" >Roadmap</a>`;
	document.getElementById('Roadmap').innerHTML = (new showdown.Converter().makeHtml(roadmapRaw).split("[ ]").join(`<input type="checkbox" disabled="disabled">`).split("[x]").join(`<input type="checkbox" disabled="disabled" checked="checked">`));
}

function setRepoBody(repo, callback, error) {
	if (TestType !== 0) {
		if (TestType === 3) {
			continueSetRepoBody(repo, getTestReadme(), callback);
		}
	} else {
		getStringP(getReadmeLink(repo.owner.login, repo.name), callback, function (data, extraParam) {
			continueSetRepoBody(repo, data, extraParam);
		}, function (errCode) {
			if (errCode == 404) {
				getStringP(getReadmeLink2(repo.owner.login, repo.name), callback, function (data, extraParam) {
					continueSetRepoBody(repo, data, extraParam);
				}, function (err) { });
			} else {
				error();
			}
		});
	}
}

function continueSetRepoBody(repo, readmeRaw, callback) {
	document.body.innerHTML += `<div class="container" id="container">
		<div class="left-sidenav" id="left-sidenav">			
			<a class="left-sidenav-a" href="#" onclick="openRepoPage('Home', this)" id="defaultOpen">Home</a>`

		+ (repo.has_downloads ? `<a class="left-sidenav-a" href="#" onclick="openReleasePage(this, '${repo.releases_url.split('{')[0]}')">Releases</a>` : ``) +

		`<a class="left-sidenav-a" href="#" onclick="openContributorsPage(this, '${repo.contributors_url}')">Contributors</a>
			`

		+ (repo.has_wiki ? `<a class="left-sidenav-a" href="${repo.html_url}/wiki">Wiki</a>` : ``) +

		`<a class="left-sidenav-a" href="https://${repo.owner.login}.github.io/">Author</a>
			<a class="left-sidenav-a" href="${repo.html_url}">Source</a>
		</div>
		
		<div id="main-panel-view">
			<div id="Home" class="tabcontent">
				
			</div>
			<div id="Releases" class="tabcontent">
				<div class="org-main" id="org-main-releases">
				
				</div>
			</div>
			<div id="Contributors" class="tabcontent">
				<div class="org-main" id="org-main-contibutors">
				</div>
			</div>
			<div id="Contributing-Guide" class="tabcontent">
				
			</div>
			<div id="Roadmap" class="tabcontent">
				
			</div>
		</div>
	</div>`;
	var elem = document.createElement('div');
	elem.innerHTML = readmeRaw.substr(0, 300);
	if (elem.querySelector('img') != null) {
		repo.avatar_url = elem.querySelector('img').src;
	} else {
		repo.avatar_url = repo.owner.avatar_url;
	}
	var readMeLines = readmeRaw.split('\n');
	for (var readMeLine of readMeLines) {
		if (readMeLine.startsWith('#') && readMeLine.indexOf('</') < 0) {
			var segment = readMeLine.split("#").join("").trim();
			//add to right side bar
		}
	}
	var converter = new showdown.Converter();
	converter.setOption('ghCompatibleHeaderId', true);
	var html = converter.makeHtml(readmeRaw);
	var imgLink = html.substr(html.indexOf('<img src="'), html.indexOf('<img src="') - html.indexOf(html.indexOf('<img src="'), '"'));
	document.getElementById('Home').innerHTML = (html);
	//console.log(html);

	callback(repo);
	document.getElementById('defaultOpen').click();
}

function setMeta(org) {
	document.title = org.name;
	if (org.avatar_url) setIcon(org.avatar_url);
	var meta = document.createElement('meta');
	meta.name = "description";
	meta.content = org.description;
	document.getElementsByTagName('head')[0].appendChild(meta);

	meta = document.createElement('meta');
	meta.property = "og:title";
	meta.content = org.name;
	document.getElementsByTagName('head')[0].appendChild(meta);

	meta = document.createElement('meta');
	meta.property = "og:image";
	meta.content = org.avatar_url;
	document.getElementsByTagName('head')[0].appendChild(meta);

	meta = document.createElement('meta');
	meta.property = "og:description";
	meta.content = org.description;
	document.getElementsByTagName('head')[0].appendChild(meta);
}

function setBodyTitle(org) {
	var titleDivContent = `
		<br/><img id="org-title-image" class="circular_image" alt="${org.description}" src="${org.avatar_url}">
		<br/><br/><a href="${org.html_url}"><span id="org-title-title" >${org.name}</span></a>
		<p>`

		+ (org.description ? `${org.description}` : (org.bio ? `${org.bio}` : ``)) +

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
	xmlhttp.onreadystatechange = function () {
		if (xmlhttp.readyState == 4) {
			if (xmlhttp.status == 200) {
				var obj = JSON.parse(xmlhttp.responseText);
				success(obj);
			} else if (xmlhttp.status == 404) {
				var obj = (xmlhttp.responseText ? JSON.parse(xmlhttp.responseText) : {});
				failed(obj);
			}
		}
	};
	xmlhttp.send(null);
}

function getStringP(url, extraParam, success, failed) {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open('GET', url, true);
	xmlhttp.setRequestHeader("Content-Type", "text/plain; charset=utf-8");
	xmlhttp.onreadystatechange = function () {
		if (xmlhttp.readyState == 4) {
			if (xmlhttp.status == 200) {
				success(xmlhttp.responseText, extraParam);
			} else {
				failed(xmlhttp.status);
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
			getJSONP(apiEndpoint, function (data) {
				renderUserOrganizations(data);
			}, function (err) { });
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
			getJSONP(apiEndpoint, function (data) {
				renderUserGist(data);
			}, function (err) { });
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
				<textarea id="gist-${fileObj.filename}" onclick="openLink('${gist.html_url}')" readonly></textarea>
			</div>`;
		div.innerHTML += (repoHTML);
		if (TestType !== 0) {
			if (TestType === 2) {
				document.getElementById(`gist-${fileObj.filename}`).innerHTML = getTestUserGistContent();
			}

		} else {
			getStringP(fileObj.raw_url, `gist-${fileObj.filename}`, function (data, extraParam) {
				document.getElementById(extraParam).innerHTML = data;
			}, function (err) { });
		}
	}
	LoadedGists = true;
}

function openPage(pageName, elmnt) {
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

function openReleasePage(elmnt, apiEndpoint) {
	openRepoPage('Releases', elmnt);
	if (LoadedReleases === false) {
		if (TestType !== 0) {
			if (TestType === 3) {
				renderRepoReleases(getTestRepoReleases());
			}

		} else {
			getJSONP(apiEndpoint, function (data) {
				renderRepoReleases(data);
			}, function (err) { });
		}
	}
}

function renderRepoReleases(downloads) {
	var div = document.getElementById('org-main-releases');
	for (var download of downloads) {
		var donwloadCount = 0;
		if (download.name == null || download.name == "") download.name = download.tag_name;
		if (download.body == null) download.body = download.name;
		var html = `
			<div class="org-main-release">
				<div class="org-title" id="org-title">
					<a href="${download.html_url}"><span id="org-title-title">${download.name}</span></a>
					<p style="font-size:12px;">Released on ` + (new Date(download.published_at)) + `</p>
				</div>
				<p>` + (new showdown.Converter().makeHtml(download.body)) + `</p>`

		for (var asset of download.assets) {
			html += `
						<div class="org-main-release-asset">
							<a href="${asset.browser_download_url}">${asset.name}</a> <span style="float:right;">${formatBytes(asset.size, 2)}</span>
						</div>
					`;
			donwloadCount += asset.download_count;
		}

		html += `<div style="padding-top:10px;"> Total Download: ${donwloadCount}</div>
			</div>
		`;
		div.innerHTML += (html);
	}
	LoadedReleases = true;
}

function openContributorsPage(elmnt, apiEndpoint) {
	openRepoPage('Contributors', elmnt);
	if (LoadedContributors === false) {
		if (TestType !== 0) {
			if (TestType === 3) {
				renderRepoContributors(getTestRepoContributors());
			}

		} else {
			getJSONP(apiEndpoint, function (data) {
				renderRepoContributors(data);
			}, function (err) { });
		}
	}
}

function renderRepoContributors(contributors) {
	var div = document.getElementById('org-main-contibutors');
	for (var contributor of contributors) {
		var repoHTML = `
			<div class="org-main-contributor">
				<div class="org-title" id="org-title">
					<br/><img id="org-title-image" class="circular_image" alt="${contributor.login}" src="${contributor.avatar_url}">
					<br/><br/><a href="https://${contributor.login}.github.io/">${contributor.login}</a>
					<!--<p>${contributor.contributions} Contributions</p>-->
				</div>
			</div>
		`;
		div.innerHTML += (repoHTML);
	}
	LoadedContributors = true;
}

function openRepoPage(pageName, elmnt) {
	var i, tabcontent, tablinks;
	tabcontent = document.getElementsByClassName("tabcontent");
	for (i = 0; i < tabcontent.length; i++) {
		tabcontent[i].style.display = "none";
	}
	tablinks = document.getElementsByClassName("left-sidenav-a");
	for (i = 0; i < tablinks.length; i++) {
		tablinks[i].style.backgroundColor = "";
		tablinks[i].style.color = "black";
	}
	document.getElementById(pageName).style.display = "block";
	elmnt.style.color = 'grey';
}

function sortByStarCount(unsortedRepo, callback) {
	callback(unsortedRepo.sort(function (a, b) { return b.stargazers_count - a.stargazers_count; }))
}

function getReadmeLink(repoOwnerName, repoName) {
	return `https://raw.githubusercontent.com/${repoOwnerName}/${repoName}/${branch}/README.md`;
}

function getReadmeLink2(repoOwnerName, repoName) {
	return `https://raw.githubusercontent.com/${repoOwnerName}/${repoName}/${branch}/README.MD`;
}

function getContributingLink(repoOwnerName, repoName) {
	return `https://raw.githubusercontent.com/${repoOwnerName}/${repoName}/${branch}/CONTRIBUTING.md`;
}

function getContributingLink2(repoOwnerName, repoName) {
	return `https://raw.githubusercontent.com/${repoOwnerName}/${repoName}/${branch}/CONTRIBUTING.MD`;
}

function getRoadmapLink(repoOwnerName, repoName) {
	return `https://raw.githubusercontent.com/${repoOwnerName}/${repoName}/${branch}/ROADMAP.md`;
}

function getRoadmapLink2(repoOwnerName, repoName) {
	return `https://raw.githubusercontent.com/${repoOwnerName}/${repoName}/${branch}/ROADMAP.MD`;
}

function loadScript(url, callback) {
	// Adding the script tag to the head as suggested before
	var head = document.body;
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = url;

	// Then bind the event to the callback function.
	// There are several events for cross browser compatibility.
	script.onreadystatechange = callback;
	script.onload = callback;

	head.appendChild(script);
}

function openLink(url) {
	window.location = url;
}

//https://stackoverflow.com/a/18650828/6626422
function formatBytes(bytes, decimals = 2) {
	if (bytes === 0) return '0 Bytes';

	const k = 1024;
	const dm = decimals < 0 ? 0 : decimals;
	const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}



