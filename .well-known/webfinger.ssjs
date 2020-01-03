if (http_request.query['resource'] === undefined)
	die();

var usr = http_request.query['resource'][0];
var m = usr.match(/^acct:(.*?)@(.*)$/);
if (m === null)
	die();
if (m[2] !== system.host_name)
	die();
var un = system.matchuser(m[1]);
if (un == 0)
	die();
var u = new User(un);
if (u == null || u.number == 0)
	die();

var wf = {};
wf.subject = 'acct:'+u.alias+'@'+system.host_name;
if (u.alias != u.name)
	wf.alias = 'acct:'+u.name+'@'+system.host_name;
wf.properties={};
wf.properties['http://nix.synchro.net/.../handle'] = u.handle;
wf.properties['http://nix.synchro.net/.../email'] = u.email;
wf.properties['http://nix.synchro.net/.../age'] = u.age;
wf.links = [];
link({"rel":"self","type":"application/activity+json","href":"https://"+system.host_name+"/aCTIVITYpUB/"+u.alias});
link({"rel":"http://openid.net/specs/connect/1.0/issuer","href":"https://"+system.host_name});
http_reply.header['Content-Type']='application/jrd+json';
http_reply.status='200 Hack Hack Hack';
write(JSON.stringify(wf));

function die() {
	http_reply.status='404 Nope';
	writeln("Nope.");
	exit(0);
}

function relmatch(rel) {
	if (http_request.query['rel'] === undefined)
		return true;
	for (r in http_request.query['rel']) {
		if (rel === http_request.query['rel'][r])
			return true;
	}
	return false;
}

function link(rel) {
	if (relmatch(rel.rel))
		wf.links.push(rel);
}
