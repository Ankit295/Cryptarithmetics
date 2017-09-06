var express=require ('express');
var app=express();
var path=require('path');
app.use(express.static('ai'))
app.get('/',function(req,res){

	res.sendFile(path.join(__dirname,'Cryptarithms.html'));	
});

app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
console.log("listening at 3000");