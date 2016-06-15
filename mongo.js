/**
 * Created by Rahil on 15-06-2016.
 */
//lets require/import the mongodb native drivers.
var mongodb = require('mongodb');
var fs = require('fs');

//We need to work with "MongoClient" interface in order to connect to a mongodb server.
var MongoClient = mongodb.MongoClient;

// Connection URL. This is where your mongodb server is running.
var url = 'mongodb://localhost:27017/RahilClone';
var completeResult = [];
// Use connect method to connect to the Server
MongoClient.connect(url, function (err, db) {
    if (err) {
        console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
        //HURRAY!! We are connected. :)
        console.log('Connection established to', url);

        // Get the documents collection
        var collection = db.collection('Stock');
        collection.distinct('_id', function(err,result){
            if (err){
                console.log(err);
            }else{
                console.log("got " + result.length);
                completeResult = result;
            }
            var newCollection = db.collection('_User');
            newCollection.distinct('_id',function(err,results){
                if (err){
                    console.log(err);
                }
                else{
                    console.log("got " + results.length );
                    completeResult = completeResult.concat(results);
                }
                console.log("total " + completeResult.length);
                var ii,jj,temparray,chunk = 30;
                var tArray = [];
                for (ii=0,jj=completeResult.length; ii<jj; ii+=chunk) {
                    temparray = completeResult.slice(ii,ii+chunk);
                    // do whatever
                    tArray.push(temparray);
                }
                console.log("got tArray len is +" + tArray.length);
                fs.writeFile('arrayFile.txt',JSON.stringify(tArray), function (err) {
                    if (err)
                        return console.log(err);
                    console.log("file writing complete");
                });

                db.close();
            });
        });
    }
});