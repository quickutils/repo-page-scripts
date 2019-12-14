

var IsTest = true;

main()
function main() {
	var isOrg = true;
	var url = window.location ; //"https://quickutils.github.io/";//
	var splited = url.replace("https://", '').replace(/\\|\//g, '').split(".github.io");
	var name = splited[0].replace(".github.io/", '');
	alert(name);
	if (splited.length > 1 && splited[1].trim() != "") {
		isOrg = false;
		name = splited[1];
	}
	var org = getOrganizationOrProfileInfo(name);
	var repos = getOrganizationOrProfileRepos(name);
}

function getOrganizationOrProfileInfo(orgName) {
	if (IsTest) {
		setOrganizationOrProfileInfo(getOrginfoTest());
	} else {
		getJSONP('https://api.github.com/orgs/' + orgName, function(data){
			setOrganizationOrProfileInfo(data);
		});  
	}
}

function setOrganizationOrProfileInfo(org) {
	setMeta(org);
	setTitle(org);
}

function getOrganizationOrProfileRepos(orgName) {
	if (IsTest) {
		setOrganizationOrProfileRepos(getOrgReposTest());
	} else {
		getJSONP('https://api.github.com/users/' + orgName + '/repos', function(data){
			setOrganizationOrProfileRepos(data);
		});  
	}
}

function setOrganizationOrProfileRepos(repos) {
	var div = document.getElementById('org-main');
	for (var repo of repos) {
		var repoHTML = `
			<div class="org-main-repo">
				<i class="fa fa-book"></i>
				<a href="https://${repo.owner.login}.github.io/${repo.name}"><span style="margin-left:5px;">${repo.name}</span></a>
				<p>
				${repo.description}
				</p>`
				
				+ (repo.language ? `<i class="fa fa-circle"></i> ${repo.language}` : `<i class="fa fa-circle"></i> None`) +
				
				`<stat> <i class="fa fa-star"></i> ${repo.stargazers_count}</stat>
				<stat> <i class="fa fa-code-fork"></i> ${repo.forks_count}</stat>
				</div>
		`;
		div.innerHTML += (repoHTML);
	}
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
		<br/><br/><a href="https://github.com/Thecarisma"><span id="org-title-title" >${org.name}</span></a>
		<p>${org.description}</p>
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
	  "has_OrganizationOrProfile_projects": true,
	  "has_repository_projects": true,
	  "public_repos": 4,
	  "public_gists": 0,
	  "followers": 0,
	  "following": 0,
	  "html_url": "https://github.com/quickutils",
	  "created_at": "2019-12-04T23:57:15Z",
	  "updated_at": "2019-12-13T11:15:47Z",
	  "type": "OrganizationOrProfile"
	};
}

function getOrgReposTest() {
	return [
	  {
		"id": 225980306,
		"node_id": "MDEwOlJlcG9zaXRvcnkyMjU5ODAzMDY=",
		"name": "dec2bin",
		"full_name": "quickutils/dec2bin",
		"private": false,
		"owner": {
		  "login": "quickutils",
		  "id": 58535737,
		  "node_id": "MDEyOk9yZ2FuaXphdGlvbjU4NTM1NzM3",
		  "avatar_url": "https://avatars0.githubusercontent.com/u/58535737?v=4",
		  "gravatar_id": "",
		  "url": "https://api.github.com/users/quickutils",
		  "html_url": "https://github.com/quickutils",
		  "followers_url": "https://api.github.com/users/quickutils/followers",
		  "following_url": "https://api.github.com/users/quickutils/following{/other_user}",
		  "gists_url": "https://api.github.com/users/quickutils/gists{/gist_id}",
		  "starred_url": "https://api.github.com/users/quickutils/starred{/owner}{/repo}",
		  "subscriptions_url": "https://api.github.com/users/quickutils/subscriptions",
		  "OrganizationOrProfiles_url": "https://api.github.com/users/quickutils/orgs",
		  "repos_url": "https://api.github.com/users/quickutils/repos",
		  "events_url": "https://api.github.com/users/quickutils/events{/privacy}",
		  "received_events_url": "https://api.github.com/users/quickutils/received_events",
		  "type": "OrganizationOrProfile",
		  "site_admin": false
		},
		"html_url": "https://github.com/quickutils/dec2bin",
		"description": "Convert a binary to decimal and decimal to binary (according to The Art of Assembly Language Book Chapter 1).",
		"fork": false,
		"url": "https://api.github.com/repos/quickutils/dec2bin",
		"forks_url": "https://api.github.com/repos/quickutils/dec2bin/forks",
		"keys_url": "https://api.github.com/repos/quickutils/dec2bin/keys{/key_id}",
		"collaborators_url": "https://api.github.com/repos/quickutils/dec2bin/collaborators{/collaborator}",
		"teams_url": "https://api.github.com/repos/quickutils/dec2bin/teams",
		"hooks_url": "https://api.github.com/repos/quickutils/dec2bin/hooks",
		"issue_events_url": "https://api.github.com/repos/quickutils/dec2bin/issues/events{/number}",
		"events_url": "https://api.github.com/repos/quickutils/dec2bin/events",
		"assignees_url": "https://api.github.com/repos/quickutils/dec2bin/assignees{/user}",
		"branches_url": "https://api.github.com/repos/quickutils/dec2bin/branches{/branch}",
		"tags_url": "https://api.github.com/repos/quickutils/dec2bin/tags",
		"blobs_url": "https://api.github.com/repos/quickutils/dec2bin/git/blobs{/sha}",
		"git_tags_url": "https://api.github.com/repos/quickutils/dec2bin/git/tags{/sha}",
		"git_refs_url": "https://api.github.com/repos/quickutils/dec2bin/git/refs{/sha}",
		"trees_url": "https://api.github.com/repos/quickutils/dec2bin/git/trees{/sha}",
		"statuses_url": "https://api.github.com/repos/quickutils/dec2bin/statuses/{sha}",
		"languages_url": "https://api.github.com/repos/quickutils/dec2bin/languages",
		"stargazers_url": "https://api.github.com/repos/quickutils/dec2bin/stargazers",
		"contributors_url": "https://api.github.com/repos/quickutils/dec2bin/contributors",
		"subscribers_url": "https://api.github.com/repos/quickutils/dec2bin/subscribers",
		"subscription_url": "https://api.github.com/repos/quickutils/dec2bin/subscription",
		"commits_url": "https://api.github.com/repos/quickutils/dec2bin/commits{/sha}",
		"git_commits_url": "https://api.github.com/repos/quickutils/dec2bin/git/commits{/sha}",
		"comments_url": "https://api.github.com/repos/quickutils/dec2bin/comments{/number}",
		"issue_comment_url": "https://api.github.com/repos/quickutils/dec2bin/issues/comments{/number}",
		"contents_url": "https://api.github.com/repos/quickutils/dec2bin/contents/{+path}",
		"compare_url": "https://api.github.com/repos/quickutils/dec2bin/compare/{base}...{head}",
		"merges_url": "https://api.github.com/repos/quickutils/dec2bin/merges",
		"archive_url": "https://api.github.com/repos/quickutils/dec2bin/{archive_format}{/ref}",
		"downloads_url": "https://api.github.com/repos/quickutils/dec2bin/downloads",
		"issues_url": "https://api.github.com/repos/quickutils/dec2bin/issues{/number}",
		"pulls_url": "https://api.github.com/repos/quickutils/dec2bin/pulls{/number}",
		"milestones_url": "https://api.github.com/repos/quickutils/dec2bin/milestones{/number}",
		"notifications_url": "https://api.github.com/repos/quickutils/dec2bin/notifications{?since,all,participating}",
		"labels_url": "https://api.github.com/repos/quickutils/dec2bin/labels{/name}",
		"releases_url": "https://api.github.com/repos/quickutils/dec2bin/releases{/id}",
		"deployments_url": "https://api.github.com/repos/quickutils/dec2bin/deployments",
		"created_at": "2019-12-05T00:08:46Z",
		"updated_at": "2019-12-08T14:24:51Z",
		"pushed_at": "2019-12-08T14:24:49Z",
		"git_url": "git://github.com/quickutils/dec2bin.git",
		"ssh_url": "git@github.com:quickutils/dec2bin.git",
		"clone_url": "https://github.com/quickutils/dec2bin.git",
		"svn_url": "https://github.com/quickutils/dec2bin",
		"homepage": "https://quickutils.github.io/dec2bin/",
		"size": 211,
		"stargazers_count": 2,
		"watchers_count": 2,
		"language": "Python",
		"has_issues": true,
		"has_projects": true,
		"has_downloads": true,
		"has_wiki": true,
		"has_pages": true,
		"forks_count": 0,
		"mirror_url": null,
		"archived": false,
		"disabled": false,
		"open_issues_count": 0,
		"license": {
		  "key": "mit",
		  "name": "MIT License",
		  "spdx_id": "MIT",
		  "url": "https://api.github.com/licenses/mit",
		  "node_id": "MDc6TGljZW5zZTEz"
		},
		"forks": 0,
		"open_issues": 0,
		"watchers": 2,
		"default_branch": "master"
	  },
	  {
		"id": 226189210,
		"node_id": "MDEwOlJlcG9zaXRvcnkyMjYxODkyMTA=",
		"name": "quickutils.github.io",
		"full_name": "quickutils/quickutils.github.io",
		"private": false,
		"owner": {
		  "login": "quickutils",
		  "id": 58535737,
		  "node_id": "MDEyOk9yZ2FuaXphdGlvbjU4NTM1NzM3",
		  "avatar_url": "https://avatars0.githubusercontent.com/u/58535737?v=4",
		  "gravatar_id": "",
		  "url": "https://api.github.com/users/quickutils",
		  "html_url": "https://github.com/quickutils",
		  "followers_url": "https://api.github.com/users/quickutils/followers",
		  "following_url": "https://api.github.com/users/quickutils/following{/other_user}",
		  "gists_url": "https://api.github.com/users/quickutils/gists{/gist_id}",
		  "starred_url": "https://api.github.com/users/quickutils/starred{/owner}{/repo}",
		  "subscriptions_url": "https://api.github.com/users/quickutils/subscriptions",
		  "OrganizationOrProfiles_url": "https://api.github.com/users/quickutils/orgs",
		  "repos_url": "https://api.github.com/users/quickutils/repos",
		  "events_url": "https://api.github.com/users/quickutils/events{/privacy}",
		  "received_events_url": "https://api.github.com/users/quickutils/received_events",
		  "type": "OrganizationOrProfile",
		  "site_admin": false
		},
		"html_url": "https://github.com/quickutils/quickutils.github.io",
		"description": "Quick Utils Website",
		"fork": false,
		"url": "https://api.github.com/repos/quickutils/quickutils.github.io",
		"forks_url": "https://api.github.com/repos/quickutils/quickutils.github.io/forks",
		"keys_url": "https://api.github.com/repos/quickutils/quickutils.github.io/keys{/key_id}",
		"collaborators_url": "https://api.github.com/repos/quickutils/quickutils.github.io/collaborators{/collaborator}",
		"teams_url": "https://api.github.com/repos/quickutils/quickutils.github.io/teams",
		"hooks_url": "https://api.github.com/repos/quickutils/quickutils.github.io/hooks",
		"issue_events_url": "https://api.github.com/repos/quickutils/quickutils.github.io/issues/events{/number}",
		"events_url": "https://api.github.com/repos/quickutils/quickutils.github.io/events",
		"assignees_url": "https://api.github.com/repos/quickutils/quickutils.github.io/assignees{/user}",
		"branches_url": "https://api.github.com/repos/quickutils/quickutils.github.io/branches{/branch}",
		"tags_url": "https://api.github.com/repos/quickutils/quickutils.github.io/tags",
		"blobs_url": "https://api.github.com/repos/quickutils/quickutils.github.io/git/blobs{/sha}",
		"git_tags_url": "https://api.github.com/repos/quickutils/quickutils.github.io/git/tags{/sha}",
		"git_refs_url": "https://api.github.com/repos/quickutils/quickutils.github.io/git/refs{/sha}",
		"trees_url": "https://api.github.com/repos/quickutils/quickutils.github.io/git/trees{/sha}",
		"statuses_url": "https://api.github.com/repos/quickutils/quickutils.github.io/statuses/{sha}",
		"languages_url": "https://api.github.com/repos/quickutils/quickutils.github.io/languages",
		"stargazers_url": "https://api.github.com/repos/quickutils/quickutils.github.io/stargazers",
		"contributors_url": "https://api.github.com/repos/quickutils/quickutils.github.io/contributors",
		"subscribers_url": "https://api.github.com/repos/quickutils/quickutils.github.io/subscribers",
		"subscription_url": "https://api.github.com/repos/quickutils/quickutils.github.io/subscription",
		"commits_url": "https://api.github.com/repos/quickutils/quickutils.github.io/commits{/sha}",
		"git_commits_url": "https://api.github.com/repos/quickutils/quickutils.github.io/git/commits{/sha}",
		"comments_url": "https://api.github.com/repos/quickutils/quickutils.github.io/comments{/number}",
		"issue_comment_url": "https://api.github.com/repos/quickutils/quickutils.github.io/issues/comments{/number}",
		"contents_url": "https://api.github.com/repos/quickutils/quickutils.github.io/contents/{+path}",
		"compare_url": "https://api.github.com/repos/quickutils/quickutils.github.io/compare/{base}...{head}",
		"merges_url": "https://api.github.com/repos/quickutils/quickutils.github.io/merges",
		"archive_url": "https://api.github.com/repos/quickutils/quickutils.github.io/{archive_format}{/ref}",
		"downloads_url": "https://api.github.com/repos/quickutils/quickutils.github.io/downloads",
		"issues_url": "https://api.github.com/repos/quickutils/quickutils.github.io/issues{/number}",
		"pulls_url": "https://api.github.com/repos/quickutils/quickutils.github.io/pulls{/number}",
		"milestones_url": "https://api.github.com/repos/quickutils/quickutils.github.io/milestones{/number}",
		"notifications_url": "https://api.github.com/repos/quickutils/quickutils.github.io/notifications{?since,all,participating}",
		"labels_url": "https://api.github.com/repos/quickutils/quickutils.github.io/labels{/name}",
		"releases_url": "https://api.github.com/repos/quickutils/quickutils.github.io/releases{/id}",
		"deployments_url": "https://api.github.com/repos/quickutils/quickutils.github.io/deployments",
		"created_at": "2019-12-05T21:06:13Z",
		"updated_at": "2019-12-05T21:42:52Z",
		"pushed_at": "2019-12-05T21:06:14Z",
		"git_url": "git://github.com/quickutils/quickutils.github.io.git",
		"ssh_url": "git@github.com:quickutils/quickutils.github.io.git",
		"clone_url": "https://github.com/quickutils/quickutils.github.io.git",
		"svn_url": "https://github.com/quickutils/quickutils.github.io",
		"homepage": "https://quickutils.github.io/",
		"size": 1,
		"stargazers_count": 1,
		"watchers_count": 1,
		"language": null,
		"has_issues": true,
		"has_projects": true,
		"has_downloads": true,
		"has_wiki": true,
		"has_pages": true,
		"forks_count": 0,
		"mirror_url": null,
		"archived": false,
		"disabled": false,
		"open_issues_count": 0,
		"license": {
		  "key": "mit",
		  "name": "MIT License",
		  "spdx_id": "MIT",
		  "url": "https://api.github.com/licenses/mit",
		  "node_id": "MDc6TGljZW5zZTEz"
		},
		"forks": 0,
		"open_issues": 0,
		"watchers": 1,
		"default_branch": "master"
	  },
	  {
		"id": 228013331,
		"node_id": "MDEwOlJlcG9zaXRvcnkyMjgwMTMzMzE=",
		"name": "repo-page-scripts",
		"full_name": "quickutils/repo-page-scripts",
		"private": false,
		"owner": {
		  "login": "quickutils",
		  "id": 58535737,
		  "node_id": "MDEyOk9yZ2FuaXphdGlvbjU4NTM1NzM3",
		  "avatar_url": "https://avatars0.githubusercontent.com/u/58535737?v=4",
		  "gravatar_id": "",
		  "url": "https://api.github.com/users/quickutils",
		  "html_url": "https://github.com/quickutils",
		  "followers_url": "https://api.github.com/users/quickutils/followers",
		  "following_url": "https://api.github.com/users/quickutils/following{/other_user}",
		  "gists_url": "https://api.github.com/users/quickutils/gists{/gist_id}",
		  "starred_url": "https://api.github.com/users/quickutils/starred{/owner}{/repo}",
		  "subscriptions_url": "https://api.github.com/users/quickutils/subscriptions",
		  "OrganizationOrProfiles_url": "https://api.github.com/users/quickutils/orgs",
		  "repos_url": "https://api.github.com/users/quickutils/repos",
		  "events_url": "https://api.github.com/users/quickutils/events{/privacy}",
		  "received_events_url": "https://api.github.com/users/quickutils/received_events",
		  "type": "OrganizationOrProfile",
		  "site_admin": false
		},
		"html_url": "https://github.com/quickutils/repo-page-scripts",
		"description": "Create your repository and OrganizationOrProfile web page using a single script. Just drop index.html and push.",
		"fork": false,
		"url": "https://api.github.com/repos/quickutils/repo-page-scripts",
		"forks_url": "https://api.github.com/repos/quickutils/repo-page-scripts/forks",
		"keys_url": "https://api.github.com/repos/quickutils/repo-page-scripts/keys{/key_id}",
		"collaborators_url": "https://api.github.com/repos/quickutils/repo-page-scripts/collaborators{/collaborator}",
		"teams_url": "https://api.github.com/repos/quickutils/repo-page-scripts/teams",
		"hooks_url": "https://api.github.com/repos/quickutils/repo-page-scripts/hooks",
		"issue_events_url": "https://api.github.com/repos/quickutils/repo-page-scripts/issues/events{/number}",
		"events_url": "https://api.github.com/repos/quickutils/repo-page-scripts/events",
		"assignees_url": "https://api.github.com/repos/quickutils/repo-page-scripts/assignees{/user}",
		"branches_url": "https://api.github.com/repos/quickutils/repo-page-scripts/branches{/branch}",
		"tags_url": "https://api.github.com/repos/quickutils/repo-page-scripts/tags",
		"blobs_url": "https://api.github.com/repos/quickutils/repo-page-scripts/git/blobs{/sha}",
		"git_tags_url": "https://api.github.com/repos/quickutils/repo-page-scripts/git/tags{/sha}",
		"git_refs_url": "https://api.github.com/repos/quickutils/repo-page-scripts/git/refs{/sha}",
		"trees_url": "https://api.github.com/repos/quickutils/repo-page-scripts/git/trees{/sha}",
		"statuses_url": "https://api.github.com/repos/quickutils/repo-page-scripts/statuses/{sha}",
		"languages_url": "https://api.github.com/repos/quickutils/repo-page-scripts/languages",
		"stargazers_url": "https://api.github.com/repos/quickutils/repo-page-scripts/stargazers",
		"contributors_url": "https://api.github.com/repos/quickutils/repo-page-scripts/contributors",
		"subscribers_url": "https://api.github.com/repos/quickutils/repo-page-scripts/subscribers",
		"subscription_url": "https://api.github.com/repos/quickutils/repo-page-scripts/subscription",
		"commits_url": "https://api.github.com/repos/quickutils/repo-page-scripts/commits{/sha}",
		"git_commits_url": "https://api.github.com/repos/quickutils/repo-page-scripts/git/commits{/sha}",
		"comments_url": "https://api.github.com/repos/quickutils/repo-page-scripts/comments{/number}",
		"issue_comment_url": "https://api.github.com/repos/quickutils/repo-page-scripts/issues/comments{/number}",
		"contents_url": "https://api.github.com/repos/quickutils/repo-page-scripts/contents/{+path}",
		"compare_url": "https://api.github.com/repos/quickutils/repo-page-scripts/compare/{base}...{head}",
		"merges_url": "https://api.github.com/repos/quickutils/repo-page-scripts/merges",
		"archive_url": "https://api.github.com/repos/quickutils/repo-page-scripts/{archive_format}{/ref}",
		"downloads_url": "https://api.github.com/repos/quickutils/repo-page-scripts/downloads",
		"issues_url": "https://api.github.com/repos/quickutils/repo-page-scripts/issues{/number}",
		"pulls_url": "https://api.github.com/repos/quickutils/repo-page-scripts/pulls{/number}",
		"milestones_url": "https://api.github.com/repos/quickutils/repo-page-scripts/milestones{/number}",
		"notifications_url": "https://api.github.com/repos/quickutils/repo-page-scripts/notifications{?since,all,participating}",
		"labels_url": "https://api.github.com/repos/quickutils/repo-page-scripts/labels{/name}",
		"releases_url": "https://api.github.com/repos/quickutils/repo-page-scripts/releases{/id}",
		"deployments_url": "https://api.github.com/repos/quickutils/repo-page-scripts/deployments",
		"created_at": "2019-12-14T11:42:21Z",
		"updated_at": "2019-12-14T16:06:30Z",
		"pushed_at": "2019-12-14T16:06:28Z",
		"git_url": "git://github.com/quickutils/repo-page-scripts.git",
		"ssh_url": "git@github.com:quickutils/repo-page-scripts.git",
		"clone_url": "https://github.com/quickutils/repo-page-scripts.git",
		"svn_url": "https://github.com/quickutils/repo-page-scripts",
		"homepage": "",
		"size": 15,
		"stargazers_count": 1,
		"watchers_count": 1,
		"language": "HTML",
		"has_issues": true,
		"has_projects": true,
		"has_downloads": true,
		"has_wiki": true,
		"has_pages": false,
		"forks_count": 0,
		"mirror_url": null,
		"archived": false,
		"disabled": false,
		"open_issues_count": 0,
		"license": {
		  "key": "gpl-3.0",
		  "name": "GNU General Public License v3.0",
		  "spdx_id": "GPL-3.0",
		  "url": "https://api.github.com/licenses/gpl-3.0",
		  "node_id": "MDc6TGljZW5zZTk="
		},
		"forks": 0,
		"open_issues": 0,
		"watchers": 1,
		"default_branch": "master"
	  },
	  {
		"id": 227117882,
		"node_id": "MDEwOlJlcG9zaXRvcnkyMjcxMTc4ODI=",
		"name": "stitchvariable",
		"full_name": "quickutils/stitchvariable",
		"private": false,
		"owner": {
		  "login": "quickutils",
		  "id": 58535737,
		  "node_id": "MDEyOk9yZ2FuaXphdGlvbjU4NTM1NzM3",
		  "avatar_url": "https://avatars0.githubusercontent.com/u/58535737?v=4",
		  "gravatar_id": "",
		  "url": "https://api.github.com/users/quickutils",
		  "html_url": "https://github.com/quickutils",
		  "followers_url": "https://api.github.com/users/quickutils/followers",
		  "following_url": "https://api.github.com/users/quickutils/following{/other_user}",
		  "gists_url": "https://api.github.com/users/quickutils/gists{/gist_id}",
		  "starred_url": "https://api.github.com/users/quickutils/starred{/owner}{/repo}",
		  "subscriptions_url": "https://api.github.com/users/quickutils/subscriptions",
		  "OrganizationOrProfiles_url": "https://api.github.com/users/quickutils/orgs",
		  "repos_url": "https://api.github.com/users/quickutils/repos",
		  "events_url": "https://api.github.com/users/quickutils/events{/privacy}",
		  "received_events_url": "https://api.github.com/users/quickutils/received_events",
		  "type": "OrganizationOrProfile",
		  "site_admin": false
		},
		"html_url": "https://github.com/quickutils/stitchvariable",
		"description": "Initiate a variable name change on a Java source file, support wildcard in variable name manipulation",
		"fork": false,
		"url": "https://api.github.com/repos/quickutils/stitchvariable",
		"forks_url": "https://api.github.com/repos/quickutils/stitchvariable/forks",
		"keys_url": "https://api.github.com/repos/quickutils/stitchvariable/keys{/key_id}",
		"collaborators_url": "https://api.github.com/repos/quickutils/stitchvariable/collaborators{/collaborator}",
		"teams_url": "https://api.github.com/repos/quickutils/stitchvariable/teams",
		"hooks_url": "https://api.github.com/repos/quickutils/stitchvariable/hooks",
		"issue_events_url": "https://api.github.com/repos/quickutils/stitchvariable/issues/events{/number}",
		"events_url": "https://api.github.com/repos/quickutils/stitchvariable/events",
		"assignees_url": "https://api.github.com/repos/quickutils/stitchvariable/assignees{/user}",
		"branches_url": "https://api.github.com/repos/quickutils/stitchvariable/branches{/branch}",
		"tags_url": "https://api.github.com/repos/quickutils/stitchvariable/tags",
		"blobs_url": "https://api.github.com/repos/quickutils/stitchvariable/git/blobs{/sha}",
		"git_tags_url": "https://api.github.com/repos/quickutils/stitchvariable/git/tags{/sha}",
		"git_refs_url": "https://api.github.com/repos/quickutils/stitchvariable/git/refs{/sha}",
		"trees_url": "https://api.github.com/repos/quickutils/stitchvariable/git/trees{/sha}",
		"statuses_url": "https://api.github.com/repos/quickutils/stitchvariable/statuses/{sha}",
		"languages_url": "https://api.github.com/repos/quickutils/stitchvariable/languages",
		"stargazers_url": "https://api.github.com/repos/quickutils/stitchvariable/stargazers",
		"contributors_url": "https://api.github.com/repos/quickutils/stitchvariable/contributors",
		"subscribers_url": "https://api.github.com/repos/quickutils/stitchvariable/subscribers",
		"subscription_url": "https://api.github.com/repos/quickutils/stitchvariable/subscription",
		"commits_url": "https://api.github.com/repos/quickutils/stitchvariable/commits{/sha}",
		"git_commits_url": "https://api.github.com/repos/quickutils/stitchvariable/git/commits{/sha}",
		"comments_url": "https://api.github.com/repos/quickutils/stitchvariable/comments{/number}",
		"issue_comment_url": "https://api.github.com/repos/quickutils/stitchvariable/issues/comments{/number}",
		"contents_url": "https://api.github.com/repos/quickutils/stitchvariable/contents/{+path}",
		"compare_url": "https://api.github.com/repos/quickutils/stitchvariable/compare/{base}...{head}",
		"merges_url": "https://api.github.com/repos/quickutils/stitchvariable/merges",
		"archive_url": "https://api.github.com/repos/quickutils/stitchvariable/{archive_format}{/ref}",
		"downloads_url": "https://api.github.com/repos/quickutils/stitchvariable/downloads",
		"issues_url": "https://api.github.com/repos/quickutils/stitchvariable/issues{/number}",
		"pulls_url": "https://api.github.com/repos/quickutils/stitchvariable/pulls{/number}",
		"milestones_url": "https://api.github.com/repos/quickutils/stitchvariable/milestones{/number}",
		"notifications_url": "https://api.github.com/repos/quickutils/stitchvariable/notifications{?since,all,participating}",
		"labels_url": "https://api.github.com/repos/quickutils/stitchvariable/labels{/name}",
		"releases_url": "https://api.github.com/repos/quickutils/stitchvariable/releases{/id}",
		"deployments_url": "https://api.github.com/repos/quickutils/stitchvariable/deployments",
		"created_at": "2019-12-10T12:41:21Z",
		"updated_at": "2019-12-12T11:47:42Z",
		"pushed_at": "2019-12-12T11:47:40Z",
		"git_url": "git://github.com/quickutils/stitchvariable.git",
		"ssh_url": "git@github.com:quickutils/stitchvariable.git",
		"clone_url": "https://github.com/quickutils/stitchvariable.git",
		"svn_url": "https://github.com/quickutils/stitchvariable",
		"homepage": "",
		"size": 10,
		"stargazers_count": 2,
		"watchers_count": 2,
		"language": "Python",
		"has_issues": true,
		"has_projects": true,
		"has_downloads": true,
		"has_wiki": true,
		"has_pages": false,
		"forks_count": 0,
		"mirror_url": null,
		"archived": false,
		"disabled": false,
		"open_issues_count": 0,
		"license": {
		  "key": "mit",
		  "name": "MIT License",
		  "spdx_id": "MIT",
		  "url": "https://api.github.com/licenses/mit",
		  "node_id": "MDc6TGljZW5zZTEz"
		},
		"forks": 0,
		"open_issues": 0,
		"watchers": 2,
		"default_branch": "master"
	  }
	];
}
