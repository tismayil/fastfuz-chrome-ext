chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
    
    let url = tabs[0].url;
    let domain = (new URL(url));
    domain = domain.hostname;
    $("#domain_name").html( domain );

    function checkU( uri ){
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open( "GET", uri, false ); 
        xmlHttp.send( null );
        return xmlHttp.status;
    }

    var i;
    var html = "";
    var nList = "";

    $.get('/files.txt', function(data) {
        nList += data;
     }, 'text');


    setTimeout(function run() {
    const FileList = nList.split("\n");
    function doTask(taskNum, next){
        var time = Math.floor(Math.random()*1000);
        $(".check-bar").val(FileList[taskNum]);
        setTimeout(function(){
            if( checkU( "https://"+domain+"/"+FileList[taskNum]) == "200" ){
                $("#loadBARbig").remove();
                $(".list-group").append(`
                    <a href="https://`+domain+`/`+FileList[taskNum]+`" target="p" >
                    <li class="list-group-item list-group-item-success">`+FileList[taskNum]+` Found</li>
                    </a>
                `)
            } 
            
            next();
        },time)
    }
    
    function createTask(taskNum){
        return function(next){
            doTask(taskNum, next);
        }
    }
    
    
    for (var i = 0; i < FileList.length; i++){
        $(document).queue('tasks', createTask(i));
    }
    
    $(document).queue('tasks', function(){
        $(".check-bar").val("Scan completed....");
        $("#loadBARbig").remove();
    });
    
    $(document).dequeue('tasks');


}, 1000);

});