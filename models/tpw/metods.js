/**
 * TechemPower plain text test
 * @param {THTTPRequest} req
 * @param {THTTPResponse} resp
 */
function plaintext(req, resp){
    resp.statusCode = 200;	
    resp.writeHead('Content-Type: text/plain');
    resp.writeEnd('Hello, World!');
}
App.registerEndpoint('plaintext', plaintext, false);

/**
 * TechemPower JSON serialization test
 * @param {THTTPRequest} req
 * @param {THTTPResponse} resp
 */
function json(req, resp){
    resp.statusCode = 200;	
    resp.writeHead('Content-Type: application/json; charset=UTF-8');
    resp.writeEnd({ message: 'Hello, World!' });
}
App.registerEndpoint('json', json, false);


function rnd10000(){
  return Math.round(Math.random()*10000);
}

/**
 * TechemPower Test type 2: Single database query (ORM)
 * @param {THTTPRequest} req
 * @param {THTTPResponse} resp
 */
function db(req, resp){
var 
	  query = UB.Repository('World').attrs(['ID', 'randomNumber']),
	  data;
    data = query.where('ID', '=', rnd10000()).selectAsObject();
    resp.statusCode = 200;	
    resp.writeHead('Content-Type: application/json; charset=UTF-8');
    resp.writeEnd(data[0]);
}
App.registerEndpoint('db', db, false);

var 
  SQL = 'select id, randomNUmber from World where id = ?',
  dataStore = new TubDataStore('World');

/**
 * TechemPower Test type 2: Single database query (RAW)
 * @param {THTTPRequest} req
 * @param {THTTPResponse} resp
 */
function dbRaw(req, resp){	  
	dataStore.runSQL(SQL, {ID: rnd10000()});
    resp.statusCode = 200;	
    resp.writeHead('Content-Type: application/json; charset=UTF-8');
    resp.writeEnd({id: dataStore.get(0), randomNumber: dataStore.get(1)});
}
App.registerEndpoint('dbRaw', dbRaw, false);


var queryString = require('queryString');
/**
 * TechemPower Test type 3: Multiple database queries
 * @param {THTTPRequest} req
 * @param {THTTPResponse} resp
 */
function queries(req, resp){
    var
	  params = queryString.parse(req.parameters),
	  repeatNum = params['queries'] || 1,
	  result = [],	
	  data,
	  i;
	  
    repeatNum = (repeatNum > 500) ? 500 : repeatNum;
	for(i=0; i<repeatNum; i++){
	  data = UB.Repository('World').attrs(['ID', 'randomNumber']).where('ID', '=', rnd10000()).selectAsObject();
	  result.push(data[0]);
    }
	resp.statusCode = 200;	
    resp.writeHead('Content-Type: application/json; charset=UTF-8');
    resp.writeEnd(result);
}
App.registerEndpoint('queries', queries, false);


/**
 * TechemPower Test type 3: Multiple database queries (Raw);
 * @param {THTTPRequest} req
 * @param {THTTPResponse} resp
 */
function queriesRaw(req, resp){
    var
	  params = queryString.parse(req.parameters),
	  repeatNum = params['queries'] || 1,
	  result = [],	
	  i;
	  
    repeatNum = (repeatNum > 500) ? 500 : repeatNum;
    for(i=0; i<repeatNum; i++){
	  dataStore.runSQL(SQL, {ID: rnd10000()});
	  result.push({id: dataStore.get(0), randomNumber: dataStore.get(1)});
    }
    resp.statusCode = 200;	
    resp.writeHead('Content-Type: application/json; charset=UTF-8');
    resp.writeEnd(result);
}
App.registerEndpoint('queriesRaw', queriesRaw, false);

var
    fs = require('fs'),
    tpl = fs.readFileSync(App.domain.config.models.byName('TPW').path + '/Fortune.mustache'),
    mustache = require('mustache');

/**
 * TechemPower Test type 3: Multiple database queries (Raw);
 * @param {THTTPRequest} req
 * @param {THTTPResponse} resp
 */
function fortunes(req, resp){
    var
        data, rendered;

    data = UB.Repository('Fortune').attrs(['ID', 'message']).selectAsObject();
    data.push({ID: 0, message: 'Additional fortune added at request time'});
    _.sortBy(data, 'message');
    rendered = mustache.render(tpl, data);
    resp.statusCode = 200;
    resp.writeHead('Content-Type: text/html; charset=UTF-8');
    resp.writeEnd(rendered);
}
App.registerEndpoint('fortunes', fortunes, false);


var
    F_SQL = 'select ID, message from Fortune',
    store = new TubDataStore('Fortune');

/**
 * TechemPower Test type 3: Multiple database queries (Raw);
 * @param {THTTPRequest} req
 * @param {THTTPResponse} resp
 */
function fortunesRaw(req, resp){
    var
        data, rendered;

    store.runSQL(F_SQL, {});
    data = JSON.parse(store.asJSONObject);
    data.push({id: 0, message: 'Additional fortune added at request time'});
    _.sortBy(data, 'message');
    rendered = mustache.render(tpl, data);
    resp.statusCode = 200;
    resp.writeHead('Content-Type: text/html; charset=UTF-8');
    resp.writeEnd(rendered);
}
App.registerEndpoint('fortunesRaw', fortunesRaw, false);

var fortuneData = [
    {ID: 1	,message: 'fortune: No such file or directory'},
    {ID: 2	,message: 'A computer scientist is someone who fixes things that aren\'t broken.'},
    {ID: 3	,message: 'After enough decimal places, nobody gives a damn.'},
    {ID: 4	,message: 'A bad random number generator: 1, 1, 1, 1, 1, 4.33e+67, 1, 1, 1'},
    {ID: 5	,message: 'A computer program does what you tell it to do, not what you want it to do.'},
    {ID: 6	,message: 'Emacs is a nice operating system, but I prefer UNIX. — Tom Christaensen'},
    {ID: 7	,message: 'Any program that runs right is obsolete.'},
    {ID: 8	,message: 'A list is only as strong as its weakest link. — Donald Knuth'},
    {ID: 9	,message: 'Feature: A bug with seniority.'},
    {ID: 10	,message: 'Computers make very fast, very accurate mistakes.'},
    {ID: 11	,message: '<script>alert("This should not be displayed in a browser alert box.");</script>'},
    {ID: 12	,message: 'フレームワークのベンチマーク'}];


/**
 * TechemPower Test type 3: Multiple database queries (Raw, no database - all data in-memory);
 * @param {THTTPRequest} req
 * @param {THTTPResponse} resp
 */
function fortunesInMemoryRaw(req, resp){
    var
        data, rendered;

    data = _.cloneDeep(fortuneData);
    data.push({id: 0, message: 'Additional fortune added at request time'});
    _.sortBy(data, 'message');
    rendered = mustache.render(tpl, data);
    resp.statusCode = 200;
    resp.writeHead('Content-Type: text/html; charset=UTF-8');
    resp.writeEnd(rendered);
}
App.registerEndpoint('fortunesInMemoryRaw', fortunesInMemoryRaw, false);