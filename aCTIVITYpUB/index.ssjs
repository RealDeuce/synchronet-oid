var path=http_request.path_info.split(/\//);
if (path.length < 1)
	die();

var un = 0;
if (path.length > 1 && path[1] !== '...') {
	un = system.matchuser(path[1]);
	if (un > 0) {
		var u = new User(un);
		if (u === null || u.number === 0)
			path = [''];
	}
}

var r = {};

r['@content'] = "https://www.w3.org/ns/activitystreams","type";
var rs = http_request.request_string.replace(/\/index.ssjs$/,'');

switch(path.length) {
	case 1:
		r.type = 'Application';
		r.name = system.version_notice;
		r.id = 'http://'+system.host_name+rs;
		r.inbox = 'http://'+system.host_name+rs+'/.../inbox';
		r.outbox = 'http://'+system.host_name+rs+'/.../outbox';
		r.followers = 'http://'+system.host_name+rs+'/.../followers';
		r.following = 'http://'+system.host_name+rs+'/.../following';
		r.liked = 'http://'+system.host_name+rs+'/.../liked';
		r.likes = 'http://'+system.host_name+rs+'/.../likes';
		r.shares = 'http://'+system.host_name+rs+'/.../shares';
		break;
	case 2:
		r.type = 'Person';
		r.name = u.name;
		r.id = 'http://'+system.host_name+rs;
		r.inbox = 'http://'+system.host_name+rs+'/inbox';
		r.outbox = 'http://'+system.host_name+rs+'/outbox';
		r.followers = 'http://'+system.host_name+rs+'/followers';
		r.following = 'http://'+system.host_name+rs+'/following';
		r.liked = 'http://'+system.host_name+rs+'/liked';
		r.likes = 'http://'+system.host_name+rs+'/likes';
		r.shares = 'http://'+system.host_name+rs+'/shares';
		break;
	case 3:
		switch(path[2]) {
			case 'inbox':
			case 'outbox':
				if (http_request.method === 'POST') {
					http_reply.status="405 I Suck";
					writeln("So tired.");
					exit(0);
				}
				r.summary=path[2];
				r.type='OrderedCollection';
				r.totalItems=0;
				r.orderedItems=[];
				break;
			case 'followers':
			case 'following':
			case 'liked':
			case 'likes':
			case 'shares':
				if (http_request.method === 'POST') {
					http_reply.status="405 I Suck";
					writeln("So tired.");
					exit(0);
				}
				r.summary=path[2];
				r.type='Collection';
				r.totalItems=0;
				r.items=[];
				break;
			default:
				die();
		}
		break;
	default:
		die();
}

http_reply.header['Content-Type']='application/ld+json; profile="https://www.w3.org/ns/activitystreams';
write(JSON.stringify(r));

function die() {
	http_reply.status="404 Sad Trombone";
	writeln("Nope.");
	exit(0);
}
