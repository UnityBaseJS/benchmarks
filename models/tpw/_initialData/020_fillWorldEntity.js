/**
 * User: pavel.mash
 * 
 */

/**
 * Initial script for fill Words entity by 10000 random numbers as expected by TechEmPower test
 * Used by cmd\initialize command
 * @param {cmd.argv.serverSession} session
 */
module.exports = function(session) {
    "use strict";
    var desktopID, folderID,
        conn = session.connection;

    var testData = [];
    console.time('\tInsert 10000 test records to Word entity');
    for (var i=1; i<=10000; i++){
		testData.push({
			entity: 'World',
			method: 'insert',
			execParams: {
				ID: i,
				randomNumber: Math.round(Math.random() * 1000000)
			} 
		});
    }
    conn.runList(testData);
    console.timeEnd('\tInsert 10000 test records to Word entity');	
	
	var 
	fortuneData = [
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
		
    	console.time('\tInsert test records to Fortune entity');	
	testData = [];
	_.forEach(fortuneData, function(item){
		testData.push({
			entity: 'Fortune',
			method: 'insert',
			execParams: item 
		});
	});
	conn.runList(testData);
    console.timeEnd('\tInsert test records to Fortune entity');	

};
