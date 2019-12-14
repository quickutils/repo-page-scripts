

var IsTest = true;

main()
function main() {
	var orgName = "quickutils" ;
	var org = getOrganizationInfo(orgName);
}

function getOrganizationInfo(orgName) {
	if (IsTest) {
		setOrganizationInfo(getOrginfoTest());
	} else {
		getJSONP('https://api.github.com/orgs/' + orgName, function(data){
			setOrganizationInfo(data);
		});  
	}
}

function setOrganizationInfo(org) {
	setMeta(org);
	setTitle(org);
}

function setMeta(org) {
	document.querySelector('meta[name="description"]').setAttribute("content", org.description);
	document.querySelector('meta[property="og:title"]').setAttribute("content", org.name);
	document.querySelector('meta[property="og:image"]').setAttribute("content", org.avatar_url);
	document.querySelector('meta[property="og:description"]').setAttribute("content", org.description);
}

function setTitle(org) {
	document.title = org.name ;
	var titleDivContent = `
		<br/><img id="org-title-image" class="circular_image" alt="${org.description}" src="${org.avatar_url}">
		<br/><br/><span id="org-title-title" >${org.name}</span>	
	`;
	document.getElementById("org-title").innerHTML= titleDivContent; 
}

function getJSONP(url, success) {
    var ud = '_' + +new Date,
        script = document.createElement('script'),
        head = document.getElementsByTagName('head')[0] 
               || document.documentElement;
    window[ud] = function(data) {
        head.removeChild(script);
        success && success(data);
    };
    script.src = url.replace('callback=?', 'callback=' + ud);
    head.appendChild(script);
}

function getOrginfoTest() {
	return {
	  "login": "quickutils",
	  "id": 58535737,
	  "node_id": "MDEyOk9yZ2FuaXphdGlvbjU4NTM1NzM3",
	  "url": "https://api.github.com/orgs/quickutils",
	  "repos_url": "https://api.github.com/orgs/quickutils/repos",
	  "events_url": "https://api.github.com/orgs/quickutils/events",
	  "hooks_url": "https://api.github.com/orgs/quickutils/hooks",
	  "issues_url": "https://api.github.com/orgs/quickutils/issues",
	  "members_url": "https://api.github.com/orgs/quickutils/members{/member}",
	  "public_members_url": "https://api.github.com/orgs/quickutils/public_members{/member}",
	  "avatar_url": "https://avatars0.githubusercontent.com/u/58535737?v=4",
	  "description": "Portable scripts and utilities to get a single task done efficiently and quickly ",
	  "name": "Quick Utils",
	  "company": null,
	  "blog": "https://quickutils.github.io/",
	  "location": null,
	  "email": "azeezadewale98@gmail.com",
	  "is_verified": false,
	  "has_organization_projects": true,
	  "has_repository_projects": true,
	  "public_repos": 4,
	  "public_gists": 0,
	  "followers": 0,
	  "following": 0,
	  "html_url": "https://github.com/quickutils",
	  "created_at": "2019-12-04T23:57:15Z",
	  "updated_at": "2019-12-13T11:15:47Z",
	  "type": "Organization"
	};
}
