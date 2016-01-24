$(document).ready(function() {

  var select = $('select');
  select.material_select();
  // Tabs are initialized automatically, but if you add tabs dynamically you will have to initialize them like this.
  // $('ul.tabs').tabs();


  $(".button-collapse").sideNav({
      menuWidth: 350,
  });


  // close sideNav on click
  $('#dropActivityMenu').click(function(){
    $('.button-collapse').sideNav('hide');
  });

  //   Modal 
  $('.modal-trigger').leanModal();
  $('#androidManifestModal').openModal();
});


var App = blocks.Application();
var TEMP_FILE_CONTENT = "";
var TEMP_FILE_NAME = "";
var widgets = [ "TextView", "EditText", "Button", "ImageView"];
var layouts = [ "FrameLayout", "RelativeLayout", "LinearLayout"];

function searchForIntents(inputString){
    var lines = inputString.split('\n');
    var regola = /\w*\s*=\s*new Intent\w*/;
    var tempResult = [];
    var result = [];
    var intentName="", intentType = "implicitIntent";
    
    for(var i= 0; i< lines.length; i++){
        if(lines[i].match(regola)){
            tempResult.push(lines[i].trim().split(' '));
        }
    }
    
    // regola = /\w/;
    for(var i= 0; i< tempResult.length; i++){
        for(var j= 0; j< tempResult[i].length; j++){
            if (tempResult[i][j] === 'Intent'){
                intentName = tempResult[i][j+1];
            }
            if (tempResult[i][j].match(new RegExp(/\w*.class/))){
                intentType= "explicitIntent";
            }   
        }
        result.push({name: intentName, type: intentType});
    }
    
    return result;
}

function searchForServices(inputString){
    var lines = inputString.split('\n');
    var regola1 = /\w*startService\w*/;
    var regola2 = /\w*bindService\w*/;
    var temp = [];
    var result = [];
    
    for(var i = 0; i < lines.length; i++ ){
        if(lines[i].match(regola1) || lines[i].match(regola2)){
            temp.push(lines[i].trim().split(' '));
        }
    }
    
    var regola= /\w*.class/;
    for(var i = 0; i < temp.length; i++ ){
        for(var j = 0; j < temp[i].length; j++){
            if(temp[i][j].match(regola)){
                result.push(temp[i][j].trim().split('.')[0]);
            }    
        }
    }
    
    return result;
}

function searchForReceivers(inputString){
    var lines = inputString.split('\n');
    var regola1 = /\w*\.sendBroadcast\w*/;
    var regola2 = /\w*\.sendStickyBroadcast\w*/;
    var temp = [];
    var result = [];
    
    // cerca le righe che fanno match con le regole
    for(var i = 0; i < lines.length; i++ ){
        if(lines[i].match(regola1) || lines[i].match(regola2)){
            temp.push(lines[i].trim().split(' '));
        }
    }
    
    // estrapola il nome della classe e lo aggiunge all'array result 
    for(var i = 0; i < temp.length; i++ ){
        for(var j = 0; j < temp[i].length; j++){
            if(temp[i][j].match(regola1) || temp[i][j].match(regola2)){
                result.push(temp[i][j].trim().split('.')[0]);
            }    
        }
    }
    
    return result;
}

function searchForContentProviders(inputString){
    var lines = inputString.split('\n');
    var regola1 = /\w*\.getContentResolver\w*/;
    var temp = [];
    var result = [];
    
    for(var i = 0; i < lines.length; i++ ){
        if(lines[i].match(regola1)){
            temp.push(lines[i].trim().split(' '));
        }
    }
    
    for(var i = 0; i < temp.length; i++ ){
        for(var j = 0; j < temp[i].length; j++){
            if(temp[i][j].match(regola1)){
                result.push("Content Provider");
            }    
        }
    }
}

function searchFor(inputString, regExpr){

        var lines = inputString.split('\n');

        // parse lines
        for(i=0; i < lines.length; i++){
        // if(lines[i].match(extendsClass)){
            if(lines[i].match(regExpr)){
                // var words = lines[i].trim().split('/(+\w+)+/i');
                var words = lines[i].trim().split(' ');
                return words;
                // parse words
                // function ( filter, action, array) ????

                // for(j = 0; j<words.length; j++){
                //  if(words[j] == 'extends'){
                //   console.log(words[j+1]);
                //  }
                // }
            }
        }
        return null;
}

function createUmlLink(from, to, type){
    switch(type){
        case "aggregation":
            return new joint.shapes.uml.Aggregation({
                source: {id: from},
                target: {id: to},
            });
            break;
        case "composition":
            return new joint.shapes.uml.Composition({
                source: {id: from},
                target: {id: to},
            });
            break;
        case "generalization":
            return new joint.shapes.uml.Generalization({
                source: {id: from},
                target: {id: to},
            });
            break;
        case "implementation":
            return new joint.shapes.uml.Implementation({
                source: {id: from},
                target: {id: to},
            });
            break;
        default: 
            console.log("UML Link not valid");
            return null;
    }
}

/*
 *
 *  MODELS
 *
 */

var AndroidManifest = App.Model({
    fileName: blocks.observable(""),
    fileContent: blocks.observable(""),
    uploaded: blocks.observable(false),
});

var Messages = App.Model({
    error : blocks.observable(""),
    layoutFile: blocks.observable(""),
    javaFile: blocks.observable("")
});

function MyDiagram(elementContainer){
    
    this.graph = new joint.dia.Graph;
    this.paper = new joint.dia.Paper({
        el: elementContainer,
        width: '100%',
        height: 500,
        model: this.graph,
        gridSize: 1
    });
}

MyDiagram.prototype = {
    constructor: MyDiagram,
}

function AndroidRect(xPos,yPos, name, type){
    return new joint.shapes.uml.AndroidComponent({
                    position: { x:xPos  , y: yPos },
                    size: { width: name.length*10+52, height: 100 },
                    name: name,
                    content: ['...'],
                    attrs: {
                        image:{
                            'xlink:href' : AndroidComponents[type].icon
                        }
                    }
                });
}



var Activity = App.Model({
    nome : blocks.observable(),
    isAttiva: blocks.observable(false),
    messages: Messages(),
    dia: blocks.observable(),
    
    layoutFile: blocks.observable(),
    layoutFileUploaded: blocks.observable(false),
    javaFile: blocks.observable(),
    javaFileUploaded: blocks.observable(false),
    
    recs: blocks.observable([]),

    toggleAttiva: function() {
        this.isAttiva(!this.isAttiva());
    },
    
    createActivityDiagram: function(){
        this.dia = ((this.dia instanceof MyDiagram) ? this.dia : new MyDiagram($('#'+this.nome)));
        
        if(this.dia instanceof MyDiagram){

            if(this.dia.graph.attributes.cells.length == 0){
                var r = AndroidRect(0,0, this.nome(), 'activity');
                this.recs.add(r);
            //    this.dia.graph.addCells(this.recs()); 
            }
            
        }
        location.href = '#' + this.nome;
    },

    setAttiva: function(){
        var activityNames = App.Source.activities;
        for(i=0; i< activityNames().length; i++){
            if(activityNames()[i].isAttiva()){
                activityNames()[i].toggleAttiva();
            }
        }
        
        
        this.toggleAttiva();    
        this.createActivityDiagram();
        App.Source.currentActivity = this;
        App.Source.updateDiagram();
        
    },
    
    
   
    loadJavaFile: function(evt){
        var file = document.getElementById("javaFile"+this.nome()).files[
            0];
        var fileType = /\.java$/;
        
        this.messages.javaFile("");
        
        if (file) {

            if (file.name.match(fileType)) {
                var reader = new FileReader();
                var cb = function(data,filename) {
                    TEMP_FILE_CONTENT = data;
                    TEMP_FILE_NAME = filename;
                }

                reader.onload = function(e) {
                    $.when(
                        cb(e.target.result, file.name)
                    ).then(
                        function(){
                            var curActivity = this.App.Source.currentActivity; 
                            curActivity.javaFileUploaded(true);
                            curActivity.javaFile(TEMP_FILE_CONTENT);
                            
                            var servicesFound = searchForServices(curActivity.javaFile());
                            for (var i = 0; i < servicesFound.length; i++) {
                                var r = AndroidRect( 10,10,servicesFound[i],'service'); 
                                curActivity.recs.add(r);
                                App.Source.updateDiagram();
                                var link = createUmlLink(r.id, curActivity.recs()[0].id, "composition" );
                                curActivity.dia.graph.addCell(link);
                            }
                            
                            var intentsFound = searchForIntents(curActivity.javaFile());
                            for (var i = 0; i < intentsFound.length; i++) {
                                var r = AndroidRect( 10,10,intentsFound[i].name,intentsFound[i].type); 
                                curActivity.recs.add(r);
                                App.Source.updateDiagram();
                                var link = createUmlLink(r.id, curActivity.recs()[0].id, "composition" );
                                curActivity.dia.graph.addCell(link);
                                    
                            }
                            
                            var receiversFound = searchForReceivers(curActivity.javaFile());
                            for (var i = 0; i < receiversFound.length; i++) {
                                var r = AndroidRect( 10,10,receiversFound[i],'broadcastReceiver'); 
                                curActivity.recs.add(r);
                                App.Source.updateDiagram();
                                var link = createUmlLink(r.id, curActivity.recs()[0].id, "composition" );
                                curActivity.dia.graph.addCell(link);
                                    
                            }
                            
                            var providersFound = searchForContentProviders(curActivity.javaFile());
                            for (var i = 0; i < providersFound.length; i++) {
                                var r = AndroidRect( 10,10,providersFound[i],'contentProvider'); 
                                curActivity.recs.add(r);
                                App.Source.updateDiagram();
                                var link = createUmlLink(r.id, curActivity.recs()[0].id, "composition" );
                                curActivity.dia.graph.addCell(link);
                                    
                            }
                            
                            // console.log(searchFor(curActivity.javaFile(), 'bindService'));
                            // console.log(searchFor(curActivity.javaFile(), 'sendBroadcast'));
                            // console.log(searchFor(curActivity.javaFile(), 'sendStickyBroadcast'));
                            
                        }
                    );

                }

                reader.readAsText(file);
                
                
            } else {
                this.layoutFileUploaded(false);
                this.messages.javaFile("This is not a valid JAVA file.");
            }
        } else {
            this.messages.javaFile("Can't open file.");
        }
    },
    
    loadLayoutFile: function(evt){
        var file = document.getElementById("layoutFile"+this.nome()).files[
            0];
        var fileType = /\.xml$/;
        
        this.messages.layoutFile("");
        
        if (file) {

            if (file.name.match(fileType)) {
                var reader = new FileReader();
                var cb = function(data,filename) {
                    TEMP_FILE_CONTENT = data;
                    TEMP_FILE_NAME = filename;
                }

                reader.onload = function(e) {
                    $.when(
                        cb(e.target.result, file.name)
                    ).then(
                        function(){
                            var curActivity = this.App.Source.currentActivity; 
                            curActivity.layoutFileUploaded(true);
                            curActivity.layoutFile(TEMP_FILE_CONTENT);
                            curActivity.parseLayoutForComponents();
                            this.App.Source.updateDiagram();
                        }
                    );

                }

                reader.readAsText(file);
                
                
            } else {
                this.layoutFileUploaded(false);
                this.messages.layoutFile("This is not a valid XML file.");
            }
        } else {
            this.messages.layoutFile("Can't open file.");
        }
    },
    
    parseLayoutTree: function(nodo, parent){
        var rectType = "noicon";
        if (layouts.indexOf(nodo.prop("tagName")) >= 0 ){
            rectType = "layout";
        }
        if (widgets.indexOf(nodo.prop("tagName")) >= 0){
            rectType = "widget";
        }
        var father = AndroidRect(
                    0,0, 
                    nodo.attr("android:id") ? 
                    nodo.attr("android:id").split('/').pop() : nodo.prop("tagName"), 
                    rectType 
                );
        this.recs.add(father);
        App.Source.updateDiagram();
        var link = createUmlLink(father.id, parent.id, "composition" );
        this.dia.graph.addCell(link);
        
        var nodes = nodo.children('*');
        for(var i=0; i< nodes.length; i++){
            var n = $(nodes[i]);
            var rectType = "noicon";
            
            if (layouts.indexOf(n.prop("tagName")) >= 0 ){
                rectType = "layout";
            }
            if (widgets.indexOf(n.prop("tagName")) >= 0){
                rectType = "widget";
            }
            
            var r = AndroidRect(
                    0,0, 
                    n.attr("android:id") ? 
                    n.attr("android:id").split('/').pop() : n.prop("tagName"), 
                    rectType 
                );
            
            this.recs.add(r);
            App.Source.updateDiagram();
            
            // creo link,  r.id -----> father.id
            var link = createUmlLink(r.id, father.id, "composition" );
            this.dia.graph.addCell(link);
            // TODO
            // aggiungere il link creato alla lista dei link dell'activity
            
            
            // se il nodo ha figli...
            if(n.children().length > 0 ){
                this.parseLayoutTree(n.children('*'), r);
                console.log("chiamata ricorsiva");
            }
        }
        
        
    },
    
    
    parseLayoutForComponents: function(){
        var xmlDoc = $.parseXML(this.layoutFile());
        var $xml = $(xmlDoc);
        var root = $xml.children().first();
        
        this.parseLayoutTree(root, this.recs()[0]);
    },


});

var Service = App.Model({
    nome: blocks.observable(),
});

var Provider = App.Model({
    nome : blocks.observable(),
});


// Collections

var Activities = App.Collection(Activity);
var Services = App.Collection(Service);
var Providers = App.Collection(Provider);


/*
 *
 *  VIEWS
 *
 */

App.View('Source', {
    messages: Messages(),
    manifest: AndroidManifest(),

    recsID: blocks.observable([]),
    
    activities : Activities(),
    currentActivity: Activity(),
    serviceNames : Services(),
    providerNames: Providers(),
    
    diagram : blocks.observable(),

    
    activitiesEmpty: blocks.observable(function(){
        return this.activities().length == 0;
    }),
    

    loadAndroidManifest: function(evt) {
        // var self = this;
        // console.log("Self is "+ self);
        var file = document.getElementById("AndroidManifestUploadButton").files[
            0];
        var fileType = /\.xml$/;

        if (file) {

            if (file.name.match(fileType)) {
                var reader = new FileReader();
                var cb = function(data,filename) {
                    TEMP_FILE_CONTENT = data;
                    TEMP_FILE_NAME = filename;
                }

                reader.onload = function(e) {
                    $.when(
                        cb(e.target.result, file.name)
                    ).then(
                        function(){
                            this.App.Source.storeManifest();
                            this.App.Source.manifest.uploaded(true);
                            
                            var listaAttivita = this.App.Source.getComponent('activity');
                            for(i=0; i< listaAttivita.length; i++){
                                
                                var newActivity = Activity({
                                    nome: listaAttivita[i],
                                    isAttiva:false,
                                    
                                });

                                this.App.Source.activities.add(newActivity);
                            }

                            var listaServizi = this.App.Source.getComponent('service');
                            listaServizi.forEach(function(e,i){
                                var newService = Service({
                                    nome : e,
                                });
                                this.App.Source.serviceNames.add(newService);
                            });
                             
                            var listaProviders = this.App.Source.getComponent('provider');
                            for(i=0; i< listaProviders.length; i++){
                                
                                var newProvider = Provider({
                                    nome: listaProviders[i],
                                    
                                });

                                this.App.Source.providerNames.add(newProvider);
                            }
                            
                            
                            
                            $('#androidManifestModal').closeModal();
                            
                        }
                    );

                }

                reader.readAsText(file);

                console.log("Name: " + file.name + "\n" +
                    "Last Modified Date :" + file.lastModifiedDate
                );

            } else {
                this.messages.error("This is not a valid XML file.");
            }
        } else {
            this.messages.error("Can't open file.");
        }


    },
    
     uploadAndroidManifest: function(evt) {
        this.loadAndroidManifest();
    },
    
    

    storeManifest: function(evt) {
        this.manifest.fileName(TEMP_FILE_NAME);
        this.manifest.fileContent(TEMP_FILE_CONTENT);
    },

    getComponent: function(component){
        var xmlDoc = $.parseXML(this.manifest.fileContent());
        var $xml = $(xmlDoc);
        var componentNameList = $xml.find(component);

        var names = [];

        componentNameList.each(function(){
            names.push($(this).attr("android:name").split('.').pop());
        });

        return names;
    },


    updateDiagram: blocks.observable(function(){
        
        this.recsID.removeAll();
        
        for(var i=0; i< this.currentActivity.recs().length;i++){
            if(this.currentActivity.recs()[i].attributes.name){

                this.recsID.add({
                        id: this.currentActivity.recs()[i].id, 
                        name:this.currentActivity.recs()[i].attributes.name
                    });    
            }
        }
        this.currentActivity.dia.graph.addCells(this.currentActivity.recs());
    }),


});
